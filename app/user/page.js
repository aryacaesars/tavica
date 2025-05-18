

"use client";
import Link from "next/link";
import { FileText, CheckCircle } from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const DOCUMENT_OPTIONS = [
  { value: "domisili", label: "Surat Keterangan Domisili", desc: "Untuk keperluan domisili tempat tinggal." },
  { value: "usaha", label: "Surat Keterangan Usaha", desc: "Untuk keperluan legalitas usaha." },
  { value: "tidak-mampu", label: "Surat Keterangan Tidak Mampu", desc: "Untuk keperluan bantuan sosial, beasiswa, dll." },
  { value: "kelahiran", label: "Surat Keterangan Kelahiran", desc: "Untuk keperluan administrasi kelahiran." },
  { value: "pengantar-ktp", label: "Surat Pengantar KTP", desc: "Untuk keperluan pembuatan KTP baru." },
];


export default function UserDocumentRequestPage() {
  const handleCardClick = (docType) => {
    window.location.href = `/user/permohonan?type=${docType}`;
  };

  return (
    <>
      {/* Header */}
      <header className="w-full h-20 flex items-center justify-end px-8 border-b bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-black font-medium hidden sm:block">User</span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-300 to-gray-100 border border-gray-300 flex items-center justify-center">
            <span className="text-lg text-gray-500">👤</span>
          </div>
        </div>
      </header>
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-white">
        <h1 className="text-3xl font-bold mb-10 text-center text-black tracking-tight">Pilih Jenis Dokumen</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {DOCUMENT_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className="cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-lg p-10 flex flex-col items-center justify-center hover:border-black hover:shadow-2xl hover:-translate-y-1 transition-all min-h-[180px] group"
              onClick={() => handleCardClick(opt.value)}
            >
              <div className="font-semibold text-xl text-black mb-2 text-center group-hover:text-blue-700 transition-colors">{opt.label}</div>
              <div className="text-gray-500 text-base text-center group-hover:text-gray-700 transition-colors">{opt.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
