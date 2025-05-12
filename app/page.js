"use client"
import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import QRDisplay from '../components/QRDisplay';

export default function HomePage() {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signedPdf, setSignedPdf] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  async function handleUpload(file) {
    setLoading(true);
    setError('');
    setQr(null);
    setSignedPdf(null);
    setOriginalFile(file);
    
    try {
      // 1. Hash the PDF
      const formData = new FormData();
      formData.append('file', file);
      const hashRes = await fetch('/api/hash', { method: 'POST', body: formData });
      const hashData = await hashRes.json();
      if (!hashRes.ok) throw new Error(hashData.error || 'Failed to hash PDF');
      const hash = hashData.hash;

      // 2. Sign the hash
      const signRes = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          hash,
          filename: file.name
        })
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || 'Failed to sign hash');
      const signature = signData.signature;

      // 3. Generate QR
      const docId = file.name;
      const timestamp = new Date().toISOString();
      const qrRes = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash, signature, docId: file.name, timestamp })
      });
      const qrData = await qrRes.json();
      if (!qrRes.ok) throw new Error(qrData.error || 'Failed to generate QR');
      setQr(qrData.qr);

      // 4. Embed QR code in PDF
      const embedFormData = new FormData();
      embedFormData.append('file', file);
      embedFormData.append('qrCode', qrData.qr);
      const embedRes = await fetch('/api/embed-qr', { method: 'POST', body: embedFormData });
      const embedData = await embedRes.json();
      if (!embedRes.ok) throw new Error(embedData.error || 'Failed to embed QR code');
      setSignedPdf(embedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (!signedPdf) return;
    
    const link = document.createElement('a');
    link.href = signedPdf.pdf;
    link.download = signedPdf.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">PDF Signature & QR Generator</h1>
      <UploadForm onUpload={handleUpload} loading={loading} />
      {error && <div className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</div>}
      <QRDisplay qr={qr} />
      {signedPdf && (
        <button
          onClick={handleDownload}
          className="mt-4 py-2 px-4 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition"
        >
          Download Signed PDF
        </button>
      )}
    </main>
  );
}
