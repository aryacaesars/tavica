

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

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-black tracking-tight">Pilih Jenis Dokumen</h1>
        <div className="w-full flex justify-center mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {DOCUMENT_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white shadow-md p-8 flex flex-col items-center justify-center hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all min-h-[160px] group"
                onClick={() => handleCardClick(opt.value)}
              >
                <div className="font-semibold text-lg text-black mb-2 text-center group-hover:text-blue-700 transition-colors">{opt.label}</div>
                <div className="text-gray-500 text-sm text-center group-hover:text-gray-700 transition-colors">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
