import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/documents - Get all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Store a new document request
export async function POST(request) {
  try {
    const data = await request.json();
    const document = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        documentType: data.documentType,
        userName: data.userName,
        userNik: data.userNik,
        status: 'pending',
        pdfUrl: data.pdfUrl || ''
      }
    });
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
} 