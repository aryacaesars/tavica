"use client";
import { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";

export default function UserHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          {/* Space for mobile menu button if needed */}
        </div>
        <div className="flex-1" />
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
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
                  href="/user/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Profil Anda
                </Link>
                <Link
                  href="/auth/login"
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
  );
}
