'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session) {
      fetchDocuments();
    }
  }, [session, status, router]);

  // Ambil dokumen pending dari /api/documents, dokumen verified dari /api/signed-documents
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      // Ambil dokumen pending dari /api/documents
      const pendingRes = await fetch('/api/documents', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      let pendingDocuments = [];
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        // Support { documents: [...] } atau array langsung
        const docs = Array.isArray(pendingData) ? pendingData : pendingData.documents;
        pendingDocuments = docs.filter(doc => !doc.verifiedAt);
      }

      // Ambil dokumen verified dari /api/signed-documents
      const verifiedRes = await fetch('/api/signed-documents', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      let verifiedDocuments = [];
      if (verifiedRes.ok) {
        const verifiedData = await verifiedRes.json();
        // Support array langsung atau { documents: [...] }
        verifiedDocuments = Array.isArray(verifiedData) ? verifiedData : (verifiedData.documents || []);
      }

      // Gabungkan, pending dulu lalu verified
      setDocuments([...pendingDocuments, ...verifiedDocuments]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal mengambil data dokumen",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (signedDocumentId, filename, hash, signature) => {
    setDownloadingId(signedDocumentId);
    try {
      // Generate QR code payload
      const payload = { hash, signature, docId: signedDocumentId, timestamp: new Date().toISOString() };
      const qrRes = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const qrData = await qrRes.json();
      if (!qrRes.ok) throw new Error(qrData.error || 'Failed to generate QR');

      // Get the signed document to find the original document ID for embed-qr API
      const signedDocRes = await fetch(`/api/signed-documents/${signedDocumentId}/download`, {
        credentials: 'include'
      });
      if (!signedDocRes.ok) throw new Error('Failed to get signed document info');
      const signedDocData = await signedDocRes.json();
      const originalDocumentId = signedDocData.documentId || signedDocumentId;

      // Request PDF with embedded QR
      const response = await fetch(`/api/documents/${originalDocumentId}/embed-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ qrCode: qrData.qr }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch signed document');
      }
      const data = await response.json();
      // Create download link
      const link = document.createElement('a');
      link.href = data.pdf; // base64 PDF
      link.download = data.filename || filename || `signed-document-${documentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Gagal mengunduh dokumen",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Filter dokumen pending
  const pendingDocuments = documents.filter(doc => !doc.verifiedAt);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dokumen Tandatangan</h1>
      </div>

      {/* Searchbar */}
      <div className="mb-4 max-w-md">
        <Input
          type="text"
          placeholder="Cari nama file, hash, status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabel Dokumen Pending */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dokumen Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama File</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Tidak ada dokumen pending
                  </TableCell>
                </TableRow>
              ) : (
                pendingDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.title || '-'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Menunggu</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabel Semua Dokumen */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen Tandatangan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama File</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verifikasi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Tidak ada dokumen
                  </TableCell>
                </TableRow>
              ) : (
                documents
                  .filter(doc => doc.verifiedAt) // hanya tampilkan dokumen yang sudah diverifikasi
                  .filter(doc => {
                    const q = search.toLowerCase();
                    return (
                      (!search) ||
                      (doc.filename && doc.filename.toLowerCase().includes(q)) ||
                      (doc.hash && doc.hash.toLowerCase().includes(q)) ||
                      (doc.verifiedAt && 'terverifikasi'.includes(q))
                    );
                  })
                  .map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{doc.filename || '-'}</TableCell>
                      <TableCell className="font-mono text-xs">{doc.hash}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Terverifikasi</span>
                      </TableCell>
                      <TableCell>
                        {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadPDF(doc.id, doc.filename || `signed-document-${doc.id}.pdf`, doc.hash, doc.signature)}
                          disabled={downloadingId === doc.id}
                        >
                          {downloadingId === doc.documentId ? (
                            <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></span>Downloading...</span>
                          ) : 'Download PDF'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 