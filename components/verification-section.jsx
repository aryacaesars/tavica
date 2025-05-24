import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileCheck, Shield } from "lucide-react"

export default function VerificationSection() {
  return (
    <section id="verifikasi" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Verifikasi Keaslian Dokumen
          </h2>
          <p className="text-lg text-gray-600">
            Pastikan dokumen yang Anda terima asli dan belum dimodifikasi dengan sistem verifikasi digital kami.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="shadow-sm border-2 border-black-100">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <FileCheck className="h-12 w-12 text-black-600" />
              </div>
              <CardTitle>Upload Dokumen</CardTitle>
              <CardDescription>
                Upload dokumen PDF yang ingin Anda verifikasi keasliannya
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-sm border-2 border-black-100">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-black-600" />
              </div>
              <CardTitle>Proses Verifikasi</CardTitle>
              <CardDescription>
                Sistem kami secara otomatis memverifikasi tanda tangan digital dan QR code pada dokumen
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-sm border-2 border-black-100">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-black-600" />
              </div>
              <CardTitle>Hasil Verifikasi</CardTitle>
              <CardDescription>
                Dapatkan hasil verifikasi keaslian dokumen secara instan dan akurat
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Verifikasi Dokumen Anda Sekarang</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Pastikan legalitas dan keaslian dokumen dengan sistem verifikasi digital yang cepat dan andal. 
            Cukup upload dokumen PDF Anda dan dapatkan hasilnya dalam hitungan detik.
          </p>
          <Link href="/verify">
            <Button size="lg" className="bg-black hover:bg-black/80 text-white">
              Verifikasi Dokumen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
