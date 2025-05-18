import { NextResponse } from "next/server";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSuratTemplate } from "@/lib/surat-utils";

export async function POST(request) {
  try {
    const data = await request.json();
    const { nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi, documentType } = data;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Ambil template sesuai jenis surat
    const template = getSuratTemplate(documentType, { nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi });

    // Dynamic Y positioning
    let y = 750;
    const lineHeight = 18;
    template.forEach(({ text, x, size = 12, isMultiline }) => {
      if (isMultiline) {
        const lines = text.split('\n');
        lines.forEach((line) => {
          page.drawText(line, { x, y, size, font, color: rgb(0,0,0) });
          y -= lineHeight;
        });
      } else {
        page.drawText(text, { x, y, size, font, color: rgb(0,0,0) });
        y -= lineHeight;
      }
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    return NextResponse.json({
      pdfUrl: `data:application/pdf;base64,${base64}`,
      filename: `surat-${documentType || "dokumen"}.pdf`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


