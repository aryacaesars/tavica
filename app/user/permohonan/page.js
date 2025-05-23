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

import { useRouter } from "next/navigation";

function PermohonanSuratPageInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari API (misal: /api/user/me)
    async function fetchUser() {
      setLoadingUser(true);
      setError("");
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data user");
        setUser(data.user);
      } catch (err) {
        setError(err.message || "Gagal mengambil data user");
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPdfUrl("");
    setLoadingSubmit(true);
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
      // Redirect ke halaman my-documents setelah submit sukses
      router.push("/user/my-documents");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!type || !DOC_LABELS[type]) {
    return <div className="text-center mt-16 text-red-600">Tipe dokumen tidak valid.</div>;
  }

  return (
    <>
      {/* Loader hanya saat submit dokumen */}
      {loadingSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl px-8 py-10 flex flex-col items-center min-w-[320px]">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <div className="text-lg font-bold mb-2 text-gray-800">Mengajukan dokumen...</div>
            <div className="text-gray-500 text-sm text-center">Mohon tunggu, permohonan Anda sedang diproses</div>
          </div>
        </div>
      )}
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
              <Button type="submit" className="w-full" disabled={loadingSubmit}>
                {loadingSubmit ? "Memproses..." : "Ajukan & Generate PDF"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

export default function PermohonanSuratPage() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <PermohonanSuratPageInner />
    </Suspense>
  );
}
