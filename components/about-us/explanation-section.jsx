import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Hash } from "lucide-react"; // Added icon imports

export default function ExplanationSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="text-center p-8 bg-gray-50 border-b">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-800">
              Tentang Aplikasi Kami
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Platform aman dan terpercaya untuk manajemen dokumen digital Anda,
              didukung teknologi kriptografi terdepan.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-8 p-8 sm:p-10">
            <p className="leading-relaxed">
              Aplikasi ini dirancang untuk menyediakan platform yang aman dan
              terpercaya untuk manajemen dokumen digital. Kami memahami betapa
              pentingnya keamanan dan integritas data dalam setiap transaksi dan
              komunikasi digital.
            </p>
            <p className="leading-relaxed">
              Untuk memastikan tingkat keamanan tertinggi, aplikasi kami
              mengimplementasikan teknologi kriptografi modern. Secara khusus, kami
              menggunakan:
            </p>

            {/* Ed25519 Section */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="flex items-center mb-3">
                <ShieldCheck className="w-7 h-7 text-black mr-3" />{/* Added icon */}
                <h3 className="text-2xl font-semibold text-gray-800">Ed25519</h3>
              </div>
              <p className="text-gray-600 leading-relaxed ml-10"> {/* Added margin for alignment */}
                Algoritma tanda tangan digital yang cepat dan aman berbasis
                kurva eliptik Edwards. Ed25519 menawarkan keamanan tinggi
                terhadap serangan umum dan efisiensi dalam pembuatan dan
                verifikasi tanda tangan. Ini memastikan bahwa setiap dokumen
                yang ditandatangani melalui platform kami adalah otentik dan
                tidak dapat disangkal.
              </p>
            </div>

            {/* BLAKE3 Section */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="flex items-center mb-3">
                <Hash className="w-7 h-7 text-blsck mr-3" />{/* Added icon */}
                <h3 className="text-2xl font-semibold text-gray-800">BLAKE3</h3>
              </div>
              <p className="text-gray-600 leading-relaxed ml-10"> {/* Added margin for alignment */}
                Fungsi hash kriptografi yang sangat cepat dan aman. BLAKE3
                digunakan untuk menghasilkan sidik jari unik (hash) dari setiap
                dokumen. Ini memungkinkan verifikasi integritas dokumen dengan
                cepat, memastikan bahwa dokumen tidak diubah sejak terakhir
                kali di-hash. Kecepatan BLAKE3 juga berkontribusi pada
                kinerja aplikasi yang responsif.
              </p>
            </div>

            <p className="mt-8 leading-relaxed font-medium text-gray-800">
              Dengan kombinasi Ed25519 untuk tanda tangan digital dan BLAKE3 untuk
              hashing, kami memberikan solusi yang kuat untuk melindungi dokumen
              Anda dari pemalsuan dan modifikasi yang tidak sah, sambil memastikan
              proses yang efisien dan ramah pengguna.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
