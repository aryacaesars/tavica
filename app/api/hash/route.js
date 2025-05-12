import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

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
    const buffer = Buffer.from(bytes);

    // Generate SHA-256 hash
    const hash = createHash('sha256');
    hash.update(buffer);
    const hashHex = hash.digest('hex');

    return NextResponse.json({ hash: hashHex });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file: ' + error.message },
      { status: 500 }
    );
  }
} 