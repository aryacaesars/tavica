"use client"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Hero() {
  const { data: session } = useSession()
  const userRole = session?.user?.role

  let href = "/auth/login" // Default if not logged in
  if (session) {
    if (userRole === "user") {
      href = "/user"
    } else if (userRole === "admin" || userRole === "superadmin") {
      href = "/dashboard"
    }
  }

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden py-16 sm:py-24">
      <div className="flex flex-1 items-center justify-center w-full">
        <div className="w-full max-w-2xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Permohonan Dokumen Kelurahan Digital
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Tavica menyederhanakan administrasi desa dengan platform digital yang aman dan efisien. Kelola dokumen,
            antrian, dan komunikasi dengan warga secara mudah dan transparan.
          </p>
          <div className="mt-10 flex flex-col items-center space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Link
              href={href}
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
      </div>
    </section>
  )
}
