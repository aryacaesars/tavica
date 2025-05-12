import { PDFDocument } from 'pdf-lib';
import jsQR from 'jsqr';

export async function embedQRCodeInPDF(pdfBytes, qrCodeDataUrl) {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Get page dimensions
    const { width, height } = firstPage.getSize();
    
    // Convert QR code data URL to PNG bytes
    const qrCodeBase64 = qrCodeDataUrl.split(',')[1];
    const qrCodeBytes = Buffer.from(qrCodeBase64, 'base64');
    
    // Embed the QR code image
    const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
    
    // Calculate QR code dimensions (20% of page width)
    const qrCodeWidth = width * 0.2;
    const qrCodeHeight = qrCodeWidth; // Keep aspect ratio 1:1
    
    // Draw QR code in bottom right corner with 20px margin
    firstPage.drawImage(qrCodeImage, {
      x: width - qrCodeWidth - 20,
      y: 20,
      width: qrCodeWidth,
      height: qrCodeHeight,
    });
    
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error embedding QR code in PDF:', error);
    throw error;
  }
}

export async function extractQRFromPDF(file) {
  try {
    if (typeof window === 'undefined') {
      throw new Error('This function must be called from a client component');
    }
    if (!file) throw new Error('No file provided');
    if (file.type !== 'application/pdf') throw new Error('File must be a PDF');

    const arrayBuffer = await file.arrayBuffer();

    // Use browser build of pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist/build/pdf');
    await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjsLib.GlobalWorkerOptions.workerSrc = window.URL.createObjectURL(
      new Blob(
        [
          '(',
          function () {
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
          }.toString(),
          ')()',
        ],
        { type: 'application/javascript' }
      )
    );

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code) throw new Error('No QR code found in the PDF');
    
    try {
      const qrData = JSON.parse(code.data);
      if (!qrData.hash || !qrData.signature) {
        throw new Error('Invalid QR code format. Expected JSON with hash and signature fields');
      }
      return { hash: qrData.hash, signature: qrData.signature };
    } catch (error) {
      throw new Error('Invalid QR code format. Expected valid JSON data');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error extracting QR code from PDF:', errorMessage);
    throw new Error(errorMessage);
  }
} 