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

    // Only allow download if verified
    if (document.status !== 'verified') {
      return NextResponse.json(
        { error: 'Document not verified yet' },
        { status: 403 }
      );
    }

    // Fetch PDF from URL
    const pdfRes = await fetch(document.pdfUrl);
    if (!pdfRes.ok) {
      throw new Error('Failed to fetch PDF');
    }
    const pdfBytes = await pdfRes.arrayBuffer();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    return NextResponse.json({
      pdf: `data:application/pdf;base64,${base64Pdf}`,
      filename: `signed-${document.title}.pdf`
    });
  } catch (error) {
    console.error('Error in GET /embed-qr:', error);
    return NextResponse.json(
      { error: 'Failed to get signed PDF: ' + error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument } from 'pdf-lib';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { qrCode } = await request.json();

    if (!qrCode) {
      return NextResponse.json(
        { error: 'Missing QR code data' },
        { status: 400 }
      );
    }

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
    const pdfBytes = await pdfRes.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    
    // Convert QR code to PNG
    const qrCodeBase64 = qrCode.split(',')[1];
    const qrCodeBytes = Buffer.from(qrCodeBase64, 'base64');
    const qrImage = await pdfDoc.embedPng(qrCodeBytes);
    
    // Add QR code to bottom right corner
    const { width, height } = page.getSize();
    const qrWidth = width * 0.2;
    const qrHeight = qrWidth;
    
    page.drawImage(qrImage, {
      x: width - qrWidth - 20,
      y: 20,
      width: qrWidth,
      height: qrHeight
    });

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(modifiedPdfBytes).toString('base64');
    
    // Update document in database
    await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        status: 'verified',
        verifiedAt: new Date()
      }
    });

    return NextResponse.json({ 
      pdf: `data:application/pdf;base64,${base64Pdf}`,
      filename: `signed-${document.title}.pdf`
    });
  } catch (error) {
    console.error('Error embedding QR code:', error);
    return NextResponse.json(
      { error: 'Failed to embed QR code: ' + error.message },
      { status: 500 }
    );
  }
} 