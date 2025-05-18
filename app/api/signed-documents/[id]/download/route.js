import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) {
    return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
  }

  const signedDocument = await prisma.signedDocument.findUnique({
    where: { id: documentId }
  });

  if (!signedDocument) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Return the document data including hash and signature
  return NextResponse.json({
    id: signedDocument.id,
    hash: signedDocument.hash,
    signature: signedDocument.signature,
    filename: signedDocument.filename,
    pdfUrl: signedDocument.pdfUrl,
    createdAt: signedDocument.createdAt,
    verifiedAt: signedDocument.verifiedAt
  });
} 