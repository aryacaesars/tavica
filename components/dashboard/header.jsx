"use client"

import { useState } from "react"
import { Bell, Search, User } from "lucide-react"
import Link from "next/link"

export default function DashboardHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          {/* This space is for the mobile menu button that's in the Sidebar component */}
        </div>

        {/* Search */}
        <div className="hidden flex-1 md:block">
          <div className="relative max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari..."
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative rounded-full bg-white p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <span className="sr-only">Lihat notifikasi</span>
            <Bell className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              3
            </span>
          </button>

          {/* Profile dropdown */}
          <div className="relative ml-3">
            <div>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <span className="sr-only">Buka menu pengguna</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              </button>
            </div>

            {isProfileMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Profil Anda
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Pengaturan
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Keluar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
