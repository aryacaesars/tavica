import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { hash, signature, docId, timestamp } = await request.json();
    if (!hash || !signature || !docId || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get document from database to ensure it exists
    const document = await prisma.signedDocument.findUnique({
      where: { hash }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found in database' }, { status: 404 });
    }

    // Generate QR code with verification data and preview URL
    const qrData = {
      hash: hash,
      signature: signature,
      docId: docId,
      previewUrl: `https://tavica.vercel.app/preview/${doc.documentid}`
    };
    
    // Encode verification data to JSON string for QR code
    const qr = await QRCode.toDataURL(JSON.stringify(qrData), { type: 'image/png' });

    return NextResponse.json({ qr });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Error generating QR code: ' + error.message }, { status: 500 });
  }
}