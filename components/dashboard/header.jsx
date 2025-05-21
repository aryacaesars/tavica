"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, User } from "lucide-react"
import Link from "next/link"

import { fetchPendingDocuments } from "@/lib/dashboard-notifications"
import NotificationCenter from "./notification-center"

export default function DashboardHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [pendingDocs, setPendingDocs] = useState([])
  const [showNotif, setShowNotif] = useState(false)
  const prevPendingCount = useRef(0)
  const audioRef = useRef(null)
  // For notification center
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let prevIds = [];
    async function getPending() {
      const docs = await fetchPendingDocuments();
      // Play sound if ada dokumen pending baru (id baru)
      const newIds = docs.map(doc => doc.id);
      const isNew = newIds.some(id => !prevIds.includes(id));
      if (isNew && prevIds.length > 0) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }
      prevIds = newIds;
      setPendingDocs(docs);
      // Build notification objects for NotificationCenter
      setNotifications(
        docs.map(doc => ({
          id: doc.id,
          title: doc.title || 'Dokumen tanpa judul',
          message: `Status: Menunggu tanda tangan (${doc.userName || '-'})`,
          time: new Date(doc.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'info',
        }))
      );
    }
    getPending();
    const interval = setInterval(getPending, 5000); // polling setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Notification sound */}
      <audio ref={audioRef} src="/notification.wav" preload="auto" />
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          {/* This space is for the mobile menu button that's in the Sidebar component */}
        </div>

        {/* Search */}
        <div className="hidden flex-1 md:block">

        </div>


        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="relative rounded-full bg-white p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setShowNotif((v) => !v)}
            >
              <span className="sr-only">Lihat notifikasi</span>
              <Bell className="h-6 w-6" />
              {pendingDocs.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {pendingDocs.length}
                </span>
              )}
            </button>
            {/* Notification dropdown - always show when showNotif true */}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 max-h-80 z-20 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-2 px-4 overflow-y-auto space-y-2">
                <NotificationCenter notifications={notifications} onMarkAllRead={() => setPendingDocs([])} />
                <button
                  className="w-full text-center text-blue-600 hover:bg-gray-100 py-2 text-sm font-medium"
                  onClick={() => {
                    setShowNotif(false)
                    window.location.href = '/dashboard/sign'
                  }}
                >
                  Lihat semua & tanda tangani
                </button>
              </div>
            )}
          </div>

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
