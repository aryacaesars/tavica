import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/documents - Get all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error getting documents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/documents - Store a new document hash
export async function POST(request) {
  try {
    const { hash, signature, filename } = await request.json();
    
    if (!hash || !signature) {
      return NextResponse.json({ error: 'Missing hash or signature' }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        hash,
        signature,
        filename
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error storing document:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Document with this hash already exists' 
      }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 