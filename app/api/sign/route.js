import { NextResponse } from 'next/server';
import { sign } from '@/lib/ed25519';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { hash, filename, documentId } = await request.json();
    if (!hash) {
      return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
    }

    // Get private key from environment variable
    const privateKey = process.env.ED25519_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: 'Private key not set in .env.local' }, { status: 500 });
    }

    // Sign the hash (convert hash hex to Uint8Array)
    const message = Buffer.from(hash, 'hex');
    const signature = await sign(message, privateKey);

    // Store document in database
    try {
      const signedDocument = await prisma.signedDocument.create({
        data: {
          hash,
          signature,
          filename,
          verifiedAt: new Date(),
          documentId
        }
      });
      
      return NextResponse.json({ 
        signature,
        signedDocumentId: signedDocument.id 
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Document already exists, update it
        const signedDocument = await prisma.signedDocument.update({
          where: { hash },
          data: {
            signature,
            filename,
            verifiedAt: new Date(),
            documentId
          }
        });
        
        return NextResponse.json({ 
          signature,
          signedDocumentId: signedDocument.id 
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error signing hash:', error);
    return NextResponse.json({ error: 'Error signing hash: ' + error.message }, { status: 500 });
  }
} 