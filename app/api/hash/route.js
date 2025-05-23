import { NextResponse } from 'next/server';
import { hashBlake3 } from '@/lib/blake3';

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint only accepts POST requests with PDF files' },
    { status: 405 }
  );
}

// Handle POST requests
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please send a PDF file using form-data with key "file"' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(bytes);

    // Generate BLAKE3 hash
    const hashHex = hashBlake3(uint8);

    return NextResponse.json({ hash: hashHex });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file: ' + error.message },
      { status: 500 }
    );
  }
}