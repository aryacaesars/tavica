import { NextResponse } from 'next/server';
import { embedQRCodeInPDF } from '@/lib/pdf-utils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const qrCode = formData.get('qrCode');

    if (!file || !qrCode) {
      return NextResponse.json(
        { error: 'Missing required fields: file and qrCode' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const pdfBytes = await file.arrayBuffer();
    
    // Embed QR code in PDF
    const modifiedPdfBytes = await embedQRCodeInPDF(pdfBytes, qrCode);
    
    // Convert to base64 for response
    const base64Pdf = Buffer.from(modifiedPdfBytes).toString('base64');
    
    return NextResponse.json({ 
      pdf: `data:application/pdf;base64,${base64Pdf}`,
      filename: file.name.replace('.pdf', '_signed.pdf')
    });
  } catch (error) {
    console.error('Error embedding QR code:', error);
    return NextResponse.json(
      { error: 'Error embedding QR code: ' + error.message },
      { status: 500 }
    );
  }
} 