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
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session) {
      fetchSignedDocuments();
    }
  }, [session, status, router]);

  const fetchSignedDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/signed-documents', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch signed documents');
      }
      
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
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

  const downloadPDF = async (documentId, filename, hash, signature) => {
    try {
      // Generate QR code payload
      const payload = { hash, signature, docId: documentId, timestamp: new Date().toISOString() };
      const qrRes = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const qrData = await qrRes.json();
      if (!qrRes.ok) throw new Error(qrData.error || 'Failed to generate QR');

      // Request PDF with embedded QR
      const response = await fetch(`/api/documents/${documentId}/embed-qr`, {
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dokumen Tandatangan</h1>
      </div>

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
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.filename || '-'}</TableCell>
                    <TableCell className="font-mono text-xs">{doc.hash}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.verifiedAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.verifiedAt ? 'Terverifikasi' : 'Menunggu'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {doc.verifiedAt && (
<Button
  variant="outline"
  size="sm"
  onClick={() => downloadPDF(doc.documentId, doc.filename || `signed-document-${doc.documentId}.pdf`, doc.hash, doc.signature)}
>
  Download PDF
</Button>
                      )}
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