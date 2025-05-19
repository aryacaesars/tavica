"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DOC_LABELS = {
  "domisili": "Surat Keterangan Domisili",
  "usaha": "Surat Keterangan Usaha",
  "tidak-mampu": "Surat Keterangan Tidak Mampu",
  "kelahiran": "Surat Keterangan Kelahiran",
  "pengantar-ktp": "Surat Pengantar KTP"
};

import { Suspense } from "react";

function PermohonanSuratPageInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari API (misal: /api/user/me)
    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data user");
        setUser(data.user);
      } catch (err) {
        setError(err.message || "Gagal mengambil data user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPdfUrl("");
    setLoading(true);
    try {
      const res = await fetch("/api/permohonan-surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: user.username,
          nik: user.nik,
          tanggalLahir: user.tanggalLahir,
          noWa: user.noWa,
          dusun: user.dusun,
          rt: user.rt,
          rw: user.rw,
          desa: user.desa,
          kecamatan: user.kecamatan,
          kabupaten: user.kabupaten,
          provinsi: user.provinsi,
          documentType: type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat PDF");
      setPdfUrl(data.pdfUrl || data.pdf);

      // Send document information to dashboard/documents
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: DOC_LABELS[type],
          description: `Permohonan ${DOC_LABELS[type]} dari ${user.username}`,
          status: "pending",
          documentType: type,
          pdfUrl: data.pdfUrl || data.pdf,
          userId: user.id,
          userName: user.username,
          userNik: user.nik
        }),
      });
      
      if (!docRes.ok) {
        console.error("Failed to send document to dashboard");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!type || !DOC_LABELS[type]) {
    return <div className="text-center mt-16 text-red-600">Tipe dokumen tidak valid.</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">{DOC_LABELS[type]}</h1>
        {user && (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label>Nama Lengkap</Label>
              <div className="mt-1 p-2 border rounded bg-gray-50">{user.username}</div>
            </div>
            <div>
              <Label>NIK</Label>
              <div className="mt-1 p-2 border rounded bg-gray-50">{user.nik}</div>
            </div>
            <div>
              <Label>Alamat Lengkap</Label>
              <div className="mt-1 p-2 border rounded bg-gray-50">
                {user.dusun && (<span>Dusun {user.dusun}, </span>)}
                RT {user.rt}/RW {user.rw}, Desa {user.desa}, Kec. {user.kecamatan}, Kab. {user.kabupaten}, Prov. {user.provinsi}
              </div>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Ajukan & Generate PDF"}
            </Button>
          </form>
        )}

      </div>
    </main>
  );
}

export default function PermohonanSuratPage() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <PermohonanSuratPageInner />
    </Suspense>
  );
}
