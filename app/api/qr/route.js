import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { hash, signature, docId, timestamp } = await request.json();
    if (!hash || !signature || !docId || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get document from database to ensure it exists
    const document = await prisma.document.findUnique({
      where: { hash }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found in database' }, { status: 404 });
    }

    const payload = { 
      hash, 
      signature, 
      docId: document.id, // Use database ID instead of filename
      timestamp 
    };
    const jsonString = JSON.stringify(payload);

    // Generate QR code as data URL (PNG, base64)
    const qr = await QRCode.toDataURL(jsonString, { type: 'image/png' });

    return NextResponse.json({ qr });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Error generating QR code: ' + error.message }, { status: 500 });
  }
} 