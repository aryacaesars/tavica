"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRDisplay from '../../../components/sign/QRDisplay';

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signedPdf, setSignedPdf] = useState(null);
  const router = useRouter();

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSignDocument(document) {
    setLoading(true);
    setError('');
    setQr(null);
    setSignedPdf(null);
    setSelectedDocument(document);
    
    try {
      // 1. Hash the PDF
      const hashRes = await fetch(`/api/documents/${document.id}/hash`);
      const hashData = await hashRes.json();
      if (!hashRes.ok) throw new Error(hashData.error || 'Failed to hash PDF');
      const hash = hashData.hash;

      // 2. Sign the hash
      const signRes = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          hash,
          filename: document.title
        })
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || 'Failed to sign hash');
      const signature = signData.signature;

      // 3. Generate QR
      const timestamp = new Date().toISOString();
      const qrRes = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash, signature, docId: document.id, timestamp })
      });
      const qrData = await qrRes.json();
      if (!qrRes.ok) throw new Error(qrData.error || 'Failed to generate QR');
      setQr(qrData.qr);

      // 4. Embed QR code in PDF
      const embedRes = await fetch(`/api/documents/${document.id}/embed-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: qrData.qr })
      });
      const embedData = await embedRes.json();
      if (!embedRes.ok) throw new Error(embedData.error || 'Failed to embed QR code');
      setSignedPdf(embedData);

      // Refresh documents list
      await fetchDocuments();
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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Document Signing</h1>
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-4xl">
        <div className="flex-1 flex flex-col items-center md:items-end md:justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Select Document to Sign</h2>
              {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedDocument?.id === doc.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSignDocument(doc)}
                  >
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.status === 'verified' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-center text-gray-500">No documents available</p>
                )}
              </div>
            </div>
            {signedPdf && (
              <button
                onClick={handleDownload}
                className="mt-4 py-2 px-4 rounded bg-black text-white font-bold hover:bg-gray-900 transition w-full"
              >
                Download Signed PDF
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start md:justify-center">
          <QRDisplay qr={qr} />
        </div>
      </div>
    </main>
  );
}
