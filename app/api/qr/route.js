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

    // Coba temukan dokumen dengan beberapa cara
    let document = null;
    
    // Cara 1: Cari berdasarkan ID
    document = await prisma.signedDocument.findUnique({
      where: { id: docId }
    });
    
    // Cara 2: Jika tidak ditemukan, coba cari berdasarkan hash
    if (!document) {
      document = await prisma.signedDocument.findUnique({
        where: { hash: hash }
      });
    }
    
    // Cara 3: Cek tabel document jika memang ada relasi
    if (!document) {
      const originalDoc = await prisma.document.findUnique({
        where: { id: docId }
      });
      
      if (originalDoc) {
        // Cari signed document berdasarkan document ID
        document = await prisma.signedDocument.findFirst({
          where: { documentId: originalDoc.id }
        });
      }
    }

    if (!document) {
      console.log('Document not found for:', { hash, docId });
      return NextResponse.json({ error: 'Document not found in database' }, { status: 404 });
    }

    console.log('Document found:', document.id);
    
    // Generate QR code with verification data and preview URL
    const qrData = {
      hash: hash,
      signature: signature,
      docId: document.id, // Gunakan ID dari dokumen yang ditemukan
      previewUrl: `https://tavica.vercel.app/preview/${document.id}`
    };
    
    // Encode verification data to JSON string for QR code
    const qr = await QRCode.toDataURL(JSON.stringify(qrData), { type: 'image/png' });

    return NextResponse.json({ qr });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Error generating QR code: ' + error.message }, { status: 500 });
  }
}