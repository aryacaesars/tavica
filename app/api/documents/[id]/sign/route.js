import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { hashBlake3 } from '@/lib/blake3';
import { sign } from '@/lib/ed25519';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const admin = await verifyAdminToken(token);
    
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) }
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }


    // Generate document hash using BLAKE3
    const encoder = new TextEncoder();
    const documentHash = hashBlake3(encoder.encode(document.pdfUrl));

    // Create digital signature using Ed25519
    const privateKey = process.env.ED25519_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "ED25519_PRIVATE_KEY not set" },
        { status: 500 }
      );
    }
    // Signature Ed25519 (hasil base64)
    const signature = await sign(documentHash, privateKey);

    // Generate QR code with document info
    const qrData = JSON.stringify({
      hash: documentHash,
      signature,
      adminId: admin.id,
      timestamp: new Date().toISOString()
    });

    const qrCode = await QRCode.toDataURL(qrData);

    // Embed QR code into PDF
    const pdfBytes = await fetch(document.pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    
    // Convert QR code to PNG
    const qrImage = await pdfDoc.embedPng(qrCode);
    
    // Add QR code to bottom right corner
    page.drawImage(qrImage, {
      x: page.getWidth() - 150,
      y: 50,
      width: 100,
      height: 100
    });

    // Save signed PDF
    const signedPdfBytes = await pdfDoc.save();
    const signedPdfBase64 = Buffer.from(signedPdfBytes).toString('base64');
    const signedPdfUrl = `data:application/pdf;base64,${signedPdfBase64}`;

    // Update document in database
    await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        status: 'verified',
        verifiedAt: new Date(),
        pdfUrl: signedPdfUrl
      }
    });

    // Store signed document record
    await prisma.signedDocument.create({
      data: {
        hash: documentHash,
        signature,
        filename: `signed-${document.title}.pdf`,
        documentId: document.id
      }
    });

    return NextResponse.json({
      success: true,
      message: "Document signed successfully",
      signedPdfUrl
    });

  } catch (error) {
    console.error('Signing error:', error);
    return NextResponse.json(
      { error: "Failed to sign document" },
      { status: 500 }
    );
  }
} 