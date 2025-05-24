import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { hash, signature, docId, timestamp } = await request.json();
    if (!hash || !signature || !docId || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Debug log lebih detail
    console.log('QR generation requested for:', { hash, docId, signature: signature.slice(0, 20) + '...' });

    // Coba beberapa cara pencarian dokumen
    let document = null;
    
    // Cara 1: Cari berdasarkan docId
    try {
      document = await prisma.signedDocument.findUnique({
        where: { id: docId }
      });
      if (document) {
        console.log('Document found by docId:', document.id);
      }
    } catch (error) {
      console.error('Error searching by docId:', error);
    }

    // Cara 2: Jika tidak ditemukan, cari berdasarkan hash
    if (!document) {
      try {
        document = await prisma.signedDocument.findUnique({
          where: { hash: hash }
        });
        if (document) {
          console.log('Document found by hash:', document.id);
        }
      } catch (error) {
        console.error('Error searching by hash:', error);
      }
    }

    // Cara 3: Debug - tampilkan semua dokumen untuk melihat struktur data
    if (!document) {
      console.log('Document not found, checking all documents...');
      const allDocs = await prisma.signedDocument.findMany({
        take: 5,
        select: { id: true, hash: true, filename: true }
      });
      console.log('Available documents:', allDocs);
    }

    if (!document) {
      return NextResponse.json({ 
        error: 'Document not found in database',
        debug: { searchedDocId: docId, searchedHash: hash }
      }, { status: 404 });
    }

    // Gunakan data dari database
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