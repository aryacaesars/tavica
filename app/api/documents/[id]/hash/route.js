import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

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
    const buffer = Buffer.from(pdfBuffer);

    // Generate SHA-256 hash
    const hash = createHash('sha256');
    hash.update(buffer);
    const hashHex = hash.digest('hex');

    return NextResponse.json({ hash: hashHex });
  } catch (error) {
    console.error('Error hashing document:', error);
    return NextResponse.json(
      { error: 'Failed to hash document: ' + error.message },
      { status: 500 }
    );
  }
} 