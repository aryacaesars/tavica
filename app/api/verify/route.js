import { NextResponse } from 'next/server';
import { verify } from '@/lib/ed25519';
import { prisma } from '@/lib/prisma';
import { calculateFileHash } from '@/lib/pdf-utils'; // fungsi untuk hitung hash file

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const qrData = formData.get('qrData'); // data dari QR yang di-scan
    
    if (!file || !qrData) {
      return NextResponse.json({ error: 'Missing file or QR data' }, { status: 400 });
    }

    const parsedQRData = JSON.parse(qrData);
    const { hash: qrHash, signature: qrSignature, docId } = parsedQRData;

    // 1. Hitung hash dari file PDF yang di-upload
    const fileBuffer = await file.arrayBuffer();
    const actualFileHash = await calculateFileHash(new Uint8Array(fileBuffer));

    // 2. Cari dokumen di database berdasarkan docId dari QR
    const document = await prisma.signedDocument.findUnique({
      where: { id: docId }
    });

    if (!document) {
      return NextResponse.json({ 
        error: 'Document not found in database',
        valid: false 
      }, { status: 404 });
    }

    // 3. Verifikasi triple check:
    // - Hash dari QR harus sama dengan hash di database
    // - Hash dari file yang di-upload harus sama dengan hash di database
    // - Signature harus valid
    
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

    // 4. Verifikasi cryptographic signature
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

    // 5. Semua check passed - dokumen valid
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
        integrity: 'verified'
      },
      checks: {
        qrHashMatch: true,
        fileHashMatch: true,
        signatureMatch: true,
        cryptographicValid: true
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