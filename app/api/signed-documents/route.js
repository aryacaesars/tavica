import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

const signedDocuments = await prisma.signedDocument.findMany({
  orderBy: { createdAt: 'desc' },
  include: { document: true } // pastikan ada relasi di model Prisma
});

    return NextResponse.json(signedDocuments);
  } catch (error) {
    console.error('Error fetching signed documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signed documents' },
      { status: 500 }
    );
  }
} 