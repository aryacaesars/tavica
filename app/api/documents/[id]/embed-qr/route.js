// Only one GET handler is needed, keep this if you want to support GET for download
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) }
    });
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    if (document.status !== 'verified') {
      return NextResponse.json(
        { error: 'Document not verified yet' },
        { status: 403 }
      );
    }
    // Ambil base64 PDF dari kolom pdfUrl
    if (!document.pdfUrl || !document.pdfUrl.startsWith('data:application/pdf;base64,')) {
      return NextResponse.json(
        { error: 'Signed PDF not found, silakan embed QR dulu.' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      pdf: document.pdfUrl,
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
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { qrCode, adminNama, adminNip, adminJabatan, date } = body;
    console.log('RECEIVED IN EMBED-QR:', { qrCode, adminNama, adminNip, adminJabatan, date }); // DEBUG

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
    // Geser QR code ke kiri 4px dari posisi sebelumnya
    const qrX = width - qrWidth - 30;
    // Naikkan posisi QR code lebih tinggi agar teks admin muat di bawahnya
    const marginBottom = 120; // px jarak dari bawah halaman
    const qrY = marginBottom;

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrWidth,
      height: qrHeight
    });

    // Draw admin info below QR with embedded font
    const fontSize = 13;
    const textGap = fontSize + 2;
    // Selalu pakai data admin dari request body (akun yang login)
    const nama = adminNama || '-';
    const nip = adminNip || '-';
    const jabatan = adminJabatan || '-';
    const infoLines = [
      `Nama: ${nama}`,
      `NIP: ${nip}`,
      `Jabatan: ${jabatan}`,
      date ? `Tanggal: ${date}` : ''
    ];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Tulis info admin di bawah QR, rata kiri bawah halaman
    const textX = qrX;
    let textY = qrY + qrHeight + 12;
    for (const line of infoLines) {
      page.drawText(line, {
        x: textX,
        y: textY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        opacity: 1
      });
      textY += textGap;
    }

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(modifiedPdfBytes).toString('base64');
    
    // Simpan base64 PDF ke kolom pdfUrl
    await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        status: 'verified',
        verifiedAt: new Date(),
        pdfUrl: `data:application/pdf;base64,${base64Pdf}`
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