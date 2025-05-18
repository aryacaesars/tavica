"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/TAVICA.svg" alt="Tavica Logo" className="h-30 w-30" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center w-full">
          <div className="flex items-center justify-center w-full gap-10 ml-20">
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Fitur
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Tentang Kami
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Kontak
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login" className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 text-sm font-medium text-white hover:from-gray-700 hover:to-gray-800"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              href="#features"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Fitur
            </Link>
            <Link
              href="#about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="#contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
            <div className="mt-4 flex flex-col space-y-2">
              <Link
                href="/login"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full rounded-md bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:from-gray-700 hover:to-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
