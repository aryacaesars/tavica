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

    // Generate direct PDF URL for QR code
    const previewUrl = `https://tavica-git-backup-arya-caesars-projects.vercel.app/preview/${document.id}`;
    const qr = await QRCode.toDataURL(previewUrl, { type: 'image/png' });

    return NextResponse.json({ qr });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Error generating QR code: ' + error.message }, { status: 500 });
  }
} 