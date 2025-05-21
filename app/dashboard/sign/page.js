"use client"

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import QRDisplay from '../../../components/sign/QRDisplay';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signedPdf, setSignedPdf] = useState(null);
  const [search, setSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState('');
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
          filename: document.title,
          documentId: document.id
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

      // 4. Fetch admin info
      const adminRes = await fetch('/api/admin/me', { credentials: 'include' });
      const adminData = await adminRes.json();
      console.log('ADMIN DATA:', adminData); // DEBUG
      if (!adminRes.ok) throw new Error(adminData.error || 'Gagal mengambil data admin');
      const { nama, nip, jabatan } = adminData.admin || {};
      console.log('ADMIN FIELDS:', { nama, nip, jabatan }); // DEBUG
      const date = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

      // 5. Embed QR code in PDF with admin info
      const embedRes = await fetch(`/api/documents/${document.id}/embed-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: qrData.qr,
          adminNama: nama,
          adminNip: nip,
          adminJabatan: jabatan,
          date
        })
      });
      // DEBUG: log what is sent to backend
      console.log('SEND TO EMBED-QR:', { qrCode: qrData.qr, adminNama: nama, adminNip: nip, adminJabatan: jabatan, date });
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



  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-0 px-2 md:px-6">
      <h1 className="text-3xl font-bold text-foreground mb-8 mt-16 text-center">Document Signing</h1>
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 md:gap-8 w-full max-w-6xl mx-auto mt-2">
        {/* Pending Documents Card */}
        <div className="w-full md:flex-[4] flex flex-col items-center">
          <Card className="w-full max-w-5xl shadow-md">
            <CardHeader>
              <CardTitle>Dokumen Pending untuk Ditandatangani</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <div className="mb-4 text-destructive text-center">{error}</div>}
              <div className="mb-4 flex justify-end w-full">
                <Input
                  type="text"
                  placeholder="Cari dokumen..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px] md:min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24 md:w-32">Tanggal</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Nama Pemohon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-28 md:w-36 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.filter(doc => {
                      if (doc.status !== 'pending') return false;
                      if (!search) return true;
                      const s = search.toLowerCase();
                      return (
                        (doc.title && doc.title.toLowerCase().includes(s)) ||
                        (doc.userName && doc.userName.toLowerCase().includes(s)) ||
                        (doc.status && doc.status.toLowerCase().includes(s))
                      );
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">Tidak ada dokumen pending</TableCell>
                      </TableRow>
                    )}
                    {documents.filter(doc => {
                      if (doc.status !== 'pending') return false;
                      if (!search) return true;
                      const s = search.toLowerCase();
                      return (
                        (doc.title && doc.title.toLowerCase().includes(s)) ||
                        (doc.userName && doc.userName.toLowerCase().includes(s)) ||
                        (doc.status && doc.status.toLowerCase().includes(s))
                      );
                    }).map((doc) => (
                      <TableRow key={doc.id} data-state={selectedDocument?.id === doc.id ? 'selected' : undefined}>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.userName || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800`}>
                            {doc.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant={selectedDocument?.id === doc.id ? 'default' : 'outline'}
                            onClick={() => handleSignDocument(doc)}
                            disabled={loading}
                          >
                            {loading && selectedDocument?.id === doc.id ? (
                              <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></span>Memproses...</span>
                            ) : 'Tandatangani'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {/* History Card: Verified Documents */}
          <Card className="w-full max-w-5xl shadow-md mt-8">
            <CardHeader>
              <CardTitle>Riwayat Dokumen Terverifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end w-full">
                <Input
                  type="text"
                  placeholder="Cari riwayat dokumen..."
                  value={searchHistory}
                  onChange={e => setSearchHistory(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px] md:min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24 md:w-32">Tanggal</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Nama Pemohon</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.filter(doc => {
                      if (doc.status !== 'verified') return false;
                      if (!searchHistory) return true;
                      const s = searchHistory.toLowerCase();
                      return (
                        (doc.title && doc.title.toLowerCase().includes(s)) ||
                        (doc.userName && doc.userName.toLowerCase().includes(s)) ||
                        (doc.status && doc.status.toLowerCase().includes(s))
                      );
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">Belum ada dokumen terverifikasi</TableCell>
                      </TableRow>
                    )}
                    {documents.filter(doc => {
                      if (doc.status !== 'verified') return false;
                      if (!searchHistory) return true;
                      const s = searchHistory.toLowerCase();
                      return (
                        (doc.title && doc.title.toLowerCase().includes(s)) ||
                        (doc.userName && doc.userName.toLowerCase().includes(s)) ||
                        (doc.status && doc.status.toLowerCase().includes(s))
                      );
                    }).map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.userName || '-'}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {doc.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* QR Code Card dihapus sesuai permintaan */}
      </div>
    </main>
  );
}
