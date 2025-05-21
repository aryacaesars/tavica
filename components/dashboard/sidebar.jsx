"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, FileText, Users, Clock, Bell, Settings, LogOut, Menu, X, FileSignature } from "lucide-react"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Ambil role dari localStorage (hanya di client)
  let role = null;
  if (typeof window !== 'undefined') {
    role = localStorage.getItem('admin_role');
  }

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "User", icon: Users, href: "/dashboard/user" },
    { name: "E-Signature", icon: FileSignature, href: "/dashboard/sign" },
    { name : "Verifikasi", icon: Clock, href: "/dashboard/verify" },
    // Show Create Admin for all admin (superadmin or admin)
    { name: "Create Admin", icon: Settings, href: "/dashboard/create-admin" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed left-4 top-4 z-50 block md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-md bg-white p-2 text-gray-600 shadow-md"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden w-48 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col sticky top-0 h-screen z-30">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            Tavica Admin
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-900" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => {
                // Hapus cookie admin_token
                document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                // Hapus localStorage admin_role
                localStorage.removeItem('admin_role');
                // Redirect ke login
                window.location.href = "/auth/login";
              }}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              type="button"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-900" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>

          {/* Sidebar */}
          <div className="relative flex w-full max-w-[12rem] flex-1 flex-col bg-white pt-5">
            <div className="absolute right-0 top-0 -mr-12 pt-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-bold text-gray-900">Tavica Admin</span>
            </div>

            <div className="mt-5 flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-500 group-hover:text-gray-900" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-200 p-4">
                <Link
                  href="/"
                  className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="mr-4 h-6 w-6 flex-shrink-0 text-gray-500 group-hover:text-gray-900" />
                  Keluar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
