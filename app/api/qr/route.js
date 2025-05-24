import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { hash, signature, docId, timestamp } = await request.json();
    if (!hash || !signature || !docId || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Debug log
    console.log('QR generation requested for:', { hash, docId });

    // Cari dokumen signedDocument berdasarkan docId
    const document = await prisma.signedDocument.findUnique({
      where: { id: docId }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found in database' }, { status: 404 });
    }

    // Gunakan data dari database, bukan dari request
    const qrData = {
      hash: document.hash,
      signature: document.signature,
      docId: document.id,
      previewUrl: `https://tavica.vercel.app/preview/${document.id}`
    };

    const qr = await QRCode.toDataURL(JSON.stringify(qrData), { type: 'image/png' });

    return NextResponse.json({ qr });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Error generating QR code: ' + error.message }, { status: 500 });
  }
}