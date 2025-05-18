
"use client";


const DOCUMENT_OPTIONS = [
  { value: "domisili", label: "Surat Keterangan Domisili", desc: "Untuk keperluan domisili tempat tinggal." },
  { value: "usaha", label: "Surat Keterangan Usaha", desc: "Untuk keperluan legalitas usaha." },
  { value: "tidak-mampu", label: "Surat Keterangan Tidak Mampu", desc: "Untuk keperluan bantuan sosial, beasiswa, dll." },
  { value: "kelahiran", label: "Surat Keterangan Kelahiran", desc: "Untuk keperluan administrasi kelahiran." },
  { value: "pengantar-ktp", label: "Surat Pengantar KTP", desc: "Untuk keperluan pembuatan KTP baru." },
];

export default function UserDocumentRequestPage() {
  // Card click handler
  const handleCardClick = (docType) => {
    // Redirect ke halaman permohonan dokumen sesuai tipe
    window.location.href = `/user/permohonan?type=${docType}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center text-black">Pilih Jenis Dokumen</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DOCUMENT_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white shadow-md p-6 hover:border-black hover:shadow-lg transition"
              onClick={() => handleCardClick(opt.value)}
            >
              <div className="font-semibold text-lg text-black mb-2">{opt.label}</div>
              <div className="text-gray-500 text-sm">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
