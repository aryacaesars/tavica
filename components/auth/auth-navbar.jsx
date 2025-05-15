import Link from "next/link"

export default function AuthNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6 border-b border-gray-200 bg-white backdrop-blur-sm flex items-center">
      <Link href="/" className="text-base font-medium text-gray-700 hover:text-gray-900">
        &larr; Kembali ke Beranda
      </Link>
    </nav>
  )
}