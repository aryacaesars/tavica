import { NextResponse } from 'next/server';
import { verify } from '@/lib/ed25519';
import { prisma } from '@/lib/prisma';
import { calculateFileHash } from '@/lib/pdf-utils';

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
      // Jika gagal parse, mungkin QR data adalah docId saja
      try {
        const qrApiResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/qr?docId=${qrData}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (qrApiResponse.ok) {
          const qrApiData = await qrApiResponse.json();
          parsedQRData = qrApiData.qrData || qrApiData;
        } else {
          throw new Error('QR API call failed');
        }
      } catch (apiError) {
        return NextResponse.json({ 
          error: 'Invalid QR code format and failed to retrieve from API',
          valid: false 
        }, { status: 400 });
      }
    }

    console.log('Parsed QR data:', parsedQRData);

    // Extract data dengan support untuk format baru yang include previewUrl
    const { hash: qrHash, signature: qrSignature, docId, previewUrl } = parsedQRData;

    console.log('Extracted values:', { qrHash: !!qrHash, qrSignature: !!qrSignature, docId: !!docId, previewUrl });

    if (!qrHash || !qrSignature || !docId) {
      return NextResponse.json({ 
        error: 'QR code missing required data (hash, signature, or docId)',
        valid: false,
        debug: {
          hasHash: !!qrHash,
          hasSignature: !!qrSignature,
          hasDocId: !!docId,
          receivedData: parsedQRData
        }
      }, { status: 400 });
    }

    // 1. Hitung hash dari file PDF yang di-upload
    const fileBuffer = await file.arrayBuffer();
    const actualFileHash = await calculateFileHash(new Uint8Array(fileBuffer));

    // 2. Ambil data dari database, API signed-document, dan API QR
    const [document, apiResponse, qrApiResponse] = await Promise.all([
      // Data dari database
      prisma.signedDocument.findUnique({
        where: { id: docId }
      }),
      // Data dari API signed-document untuk cross-reference
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/signed-document/${docId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.ok ? res.json() : null).catch(() => null),
      // Data dari API QR untuk verifikasi QR code
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/qr?docId=${docId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.ok ? res.json() : null).catch(() => null)
    ]);

    if (!document) {
      return NextResponse.json({ 
        error: 'Document not found in database',
        valid: false 
      }, { status: 404 });
    }

    // 3. Cross-reference dengan API data (jika tersedia)
    if (apiResponse && apiResponse.document) {
      const apiDoc = apiResponse.document;
      
      // Verifikasi consistency antara database dan API
      if (apiDoc.hash !== document.hash || apiDoc.signature !== document.signature) {
        return NextResponse.json({ 
          error: 'Data inconsistency detected between database and API',
          valid: false,
          details: 'Internal data mismatch - possible tampering'
        }, { status: 500 });
      }
    }

    // 4. Verifikasi QR code dengan API QR (skip jika tidak ada response)
    if (qrApiResponse && qrApiResponse.qrData) {
      const apiQRData = qrApiResponse.qrData;
      
      // Verifikasi consistency QR data dari scan vs API
      if (apiQRData.hash !== qrHash || 
          apiQRData.signature !== qrSignature || 
          apiQRData.docId !== docId) {
        return NextResponse.json({ 
          error: 'QR code data does not match API records',
          valid: false,
          details: 'QR code may be tampered or invalid'
        }, { status: 400 });
      }
    }

    // 5. Triple verification:
    const hashFromDB = document.hash;
    const signatureFromDB = document.signature;

    // Check 1: QR hash vs DB hash
    if (qrHash !== hashFromDB) {
      return NextResponse.json({ 
        error: 'QR code hash does not match database',
        valid: false,
        details: 'QR code may be tampered or copied'
      }, { status: 400 });
    }

    // Check 2: Actual file hash vs DB hash
    if (actualFileHash !== hashFromDB) {
      return NextResponse.json({ 
        error: 'File hash does not match database',
        valid: false,
        details: 'File content has been modified or this is not the original file'
      }, { status: 400 });
    }

    // Check 3: QR signature vs DB signature
    if (qrSignature !== signatureFromDB) {
      return NextResponse.json({ 
        error: 'QR signature does not match database',
        valid: false,
        details: 'QR code signature is invalid'
      }, { status: 400 });
    }

    // 6. Verifikasi cryptographic signature
    const publicKey = process.env.ED25519_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: 'Public key not set' }, { status: 500 });
    }

    const message = Buffer.from(hashFromDB, 'hex');
    const isSignatureValid = await verify(message, signatureFromDB, publicKey);

    if (!isSignatureValid) {
      return NextResponse.json({ 
        error: 'Cryptographic signature verification failed',
        valid: false 
      }, { status: 400 });
    }

    // 7. Update verification timestamp
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
        qrHashMatch: true,
        fileHashMatch: true,
        signatureMatch: true,
        cryptographicValid: true,
        apiConsistency: !!apiResponse,
        qrApiConsistency: !!qrApiResponse
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