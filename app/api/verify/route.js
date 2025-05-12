import { NextResponse } from 'next/server';
import { verify } from '@/lib/ed25519';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { hash, signature } = await request.json();
    if (!hash || !signature) {
      return NextResponse.json({ error: 'Missing hash or signature' }, { status: 400 });
    }

    // Check if document exists in database
    const document = await prisma.document.findUnique({
      where: { hash }
    });

    if (!document) {
      return NextResponse.json({ 
        error: 'Document not found in database',
        valid: false 
      }, { status: 404 });
    }

    // Get public key from environment variable
    const publicKey = process.env.ED25519_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: 'Public key not set in .env.local' }, { status: 500 });
    }

    // Convert hash hex to Uint8Array
    const message = Buffer.from(hash, 'hex');
    const isValid = await verify(message, signature, publicKey);

    // If verification is successful, update the verification timestamp
    if (isValid) {
      await prisma.document.update({
        where: { hash },
        data: { verifiedAt: new Date() }
      });
    }

    return NextResponse.json({ 
      valid: isValid,
      document: {
        filename: document.filename,
        createdAt: document.createdAt,
        verifiedAt: document.verifiedAt
      }
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json({ 
      error: 'Error verifying signature: ' + error.message,
      details: error.stack
    }, { status: 500 });
  }
} 