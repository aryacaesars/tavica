import { NextResponse } from 'next/server';
import { verify } from '@/lib/ed25519';
import { prisma } from '@/lib/prisma';
import { calculateFileHash, calculateOriginalPDFHash, verifyPDFIntegrity } from '@/lib/pdf-utils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const qrData = formData.get('qrData');
    
    if (!file || !qrData) {
      return NextResponse.json({ error: 'Missing file or QR data' }, { status: 400 });
    }

    console.log('Raw QR data received:', qrData);

    // Parse QR data dengan error handling
    let parsedQRData;
    try {
      // Coba parse sebagai JSON jika string
      if (typeof qrData === 'string') {
        parsedQRData = JSON.parse(qrData);
      } else {
        parsedQRData = qrData;
      }
    } catch (jsonError) {
      console.log('JSON parse failed:', jsonError.message);
      console.log('Raw QR data type:', typeof qrData);
      console.log('Raw QR data length:', qrData.length);
      console.log('Raw QR data preview:', qrData.substring(0, 100));
      
      // Jika gagal parse, mungkin QR data adalah docId saja
      try {
        const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/qr?docId=${qrData}`;
        console.log('Attempting to fetch QR data from API:', apiUrl);
        
        const qrApiResponse = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('QR API response status:', qrApiResponse.status);
        
        if (qrApiResponse.ok) {
          const qrApiData = await qrApiResponse.json();
          console.log('QR API response data:', qrApiData);
          parsedQRData = qrApiData.qrData || qrApiData;
        } else {
          const errorData = await qrApiResponse.json();
          console.log('QR API error response:', errorData);
          throw new Error(`QR API call failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (apiError) {
        console.error('API error details:', apiError);
        return NextResponse.json({ 
          error: 'Invalid QR code format and failed to retrieve from API',
          valid: false,
          debug: {
            jsonError: jsonError.message,
            apiError: apiError.message,
            rawQRData: qrData,
            qrDataType: typeof qrData
          }
        }, { status: 400 });
      }
    }

    console.log('Parsed QR data:', parsedQRData);

    // Extract data dengan support untuk format baru yang include previewUrl
    const { hash: qrHash, signature: qrSignature, docId, previewUrl } = parsedQRData;

    console.log('Extracted values:', { 
      qrHash: qrHash ? qrHash.substring(0, 16) + '...' : null, 
      qrSignature: qrSignature ? qrSignature.substring(0, 16) + '...' : null, 
      docId, 
      previewUrl 
    });

    if (!qrHash || !qrSignature || !docId) {
      return NextResponse.json({ 
        error: 'QR code missing required data (hash, signature, or docId)',
        valid: false,
        debug: {
          hasHash: !!qrHash,
          hasSignature: !!qrSignature,
          hasDocId: !!docId,
          receivedData: parsedQRData,
          qrDataKeys: Object.keys(parsedQRData || {}),
          extractedValues: { qrHash, qrSignature, docId, previewUrl }
        }
      }, { status: 400 });
    }

    // Get file buffer
    const fileBuffer = await file.arrayBuffer();
    
    // **DUAL VERIFICATION**
    
    // 1. Get document from database
    const document = await prisma.signedDocument.findUnique({
      where: { id: docId }
    });

    if (!document) {
      return NextResponse.json({ 
        error: 'Document not found in database',
        valid: false 
      }, { status: 404 });
    }

    // **TAMBAHAN: Debug log**
    console.log('Document from DB:', {
      id: document.id,
      hash: document.hash,
      filename: document.filename
    });

    console.log('Comparison:', {
      qrHash,
      dbHash: document.hash,
      matches: qrHash === document.hash
    });

    // 2. Comprehensive PDF integrity check
    const integrityResult = await verifyPDFIntegrity(
      fileBuffer, 
      document.hash, 
      parsedQRData
    );

    if (!integrityResult.valid) {
      return NextResponse.json({ 
        error: 'PDF integrity verification failed',
        valid: false,
        details: integrityResult.checks,
        debug: {
          errorMessage: integrityResult.error,
          documentHashFromDB: document.hash,
          qrHashFromCode: qrHash,
          calculatedHash: integrityResult.checks?.calculatedHash
        }
      }, { status: 400 });
    }

    // 3. Cryptographic signature verification
    const publicKey = process.env.ED25519_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: 'Public key not set' }, { status: 500 });
    }

    const message = Buffer.from(document.hash, 'hex');
    const isSignatureValid = await verify(message, document.signature, publicKey);

    if (!isSignatureValid) {
      return NextResponse.json({ 
        error: 'Cryptographic signature verification failed',
        valid: false 
      }, { status: 400 });
    }

    // 4. Update verification timestamp
    await prisma.signedDocument.update({
      where: { id: docId },
      data: { verifiedAt: new Date() }
    });

    return NextResponse.json({ 
      valid: true,
      document: {
        filename: document.filename,
        createdAt: document.createdAt,
        verifiedAt: new Date(),
        integrity: 'verified',
        previewUrl: previewUrl // Include preview URL in response
      },
      checks: {
        documentIntegrity: integrityResult.valid,
        qrDataValid: integrityResult.checks.qrData,
        documentHashValid: integrityResult.checks.documentHash,
        cryptographicSignature: isSignatureValid,
        hashDetails: integrityResult.checks
      }
    });

  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json({ 
      error: 'Error verifying signature: ' + error.message,
      valid: false
    }, { status: 500 });
  }
}