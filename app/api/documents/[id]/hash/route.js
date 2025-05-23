import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashBlake3 } from '@/lib/blake3';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get document from database
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Fetch PDF from URL
    const pdfRes = await fetch(document.pdfUrl);
    if (!pdfRes.ok) {
      throw new Error('Failed to fetch PDF');
    }

    // Convert PDF to buffer
    const pdfBuffer = await pdfRes.arrayBuffer();
    const uint8 = new Uint8Array(pdfBuffer);

    // Generate BLAKE3 hash (hex)
    const hashHex = hashBlake3(uint8);

    return NextResponse.json({ hash: hashHex });
  } catch (error) {
    console.error('Error hashing document:', error);
    return NextResponse.json(
      { error: 'Failed to hash document: ' + error.message },
      { status: 500 }
    );
  }
}