'use client';

import { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: '',
    userName: '',
    userNik: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil data dokumen",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal mengirim dokumen');

      await fetchDocuments();
      setFormData({ title: '', description: '', documentType: '', userName: '', userNik: '' });
      setIsDialogOpen(false);
      toast({
        title: "Sukses",
        description: "Dokumen berhasil dikirim",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignature = async (documentId) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/sign`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Gagal menandatangani dokumen');

      await fetchDocuments();
      setIsSignatureDialogOpen(false);
      setSelectedDocument(null);
      toast({
        title: "Sukses",
        description: "Dokumen berhasil ditandatangani",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dokumen Permohonan</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Buat Permohonan Baru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Permohonan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Permohonan</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Jenis Dokumen</Label>
                <select
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  <option value="surat-keterangan">Surat Keterangan</option>
                  <option value="surat-domisili">Surat Domisili</option>
                  <option value="surat-usaha">Surat Keterangan Usaha</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">Nama Lengkap</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userNik">NIK</Label>
                <Input
                  id="userNik"
                  name="userNik"
                  value={formData.userNik}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></span> Mengirim...</span>
                ) : 'Kirim Permohonan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Permohonan</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
              <span className="ml-3 text-gray-700">Memuat data...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Jenis Dokumen</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verifikasi</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell>{doc.userName}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status === 'pending' ? 'Menunggu' :
                        doc.status === 'verified' ? 'Terverifikasi' : 'Ditolak'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {doc.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSignature(doc.id)}
                          disabled={isVerifying}
                        >
                          {isVerifying ? (
                            <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></span>Verifikasi...</span>
                          ) : 'Verifikasi'}
                        </Button>
                      )}
                      {doc.pdfUrl && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => window.open(doc.pdfUrl, '_blank')}
                        >
                          Lihat PDF
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Verifikasi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin memverifikasi dokumen ini?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => handleSignature(selectedDocument)}>
                Konfirmasi Verifikasi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
