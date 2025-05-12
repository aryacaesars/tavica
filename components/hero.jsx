import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Permohonan Dokumen Kelurahan Digital
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Tavica menyederhanakan administrasi desa dengan platform digital yang aman dan efisien. Kelola dokumen,
              antrian, dan komunikasi dengan warga secara mudah dan transparan.
            </p>
            <div className="mt-10 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/register"
                className="rounded-md bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-3 text-center text-base font-medium text-white shadow-sm hover:from-gray-700 hover:to-gray-800"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="#features"
                className="rounded-md border border-gray-300 bg-white px-8 py-3 text-center text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          <div className="relative mx-auto max-w-xl lg:mx-0">
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Tavica Dashboard Preview"
              width={500}
              height={500}
              className="rounded-xl shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
