"use client";
import { useState, useEffect, useRef } from "react";
import { User, Bell } from "lucide-react";
import Link from "next/link";
import { fetchCompletedDocuments } from "@/lib/dashboard-notifications";
import NotificationCenter from "@/components/dashboard/notification-center";

export default function UserHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [completedDocs, setCompletedDocs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const prevCompletedCount = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let prevIds = [];
    async function getCompletedDocs() {
      const docs = await fetchCompletedDocuments();
      // Play sound if ada dokumen selesai baru (id baru)
      const newIds = docs.map(doc => doc.id);
      const isNew = newIds.some(id => !prevIds.includes(id));
      if (isNew && prevIds.length > 0) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }
      prevIds = newIds;
      setCompletedDocs(docs);
      // Build notification objects for NotificationCenter
      setNotifications(
        docs.map(doc => ({
          id: doc.id,
          title: doc.title || 'Dokumen tanpa judul',
          message: `Status: Dokumen telah selesai dan ditandatangani`,
          time: new Date(doc.updatedAt || doc.createdAt).toLocaleString('id-ID', { 
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' 
          }),
          type: 'success',
        }))
      );
    }
    getCompletedDocs();
    const interval = setInterval(getCompletedDocs, 10000); // polling setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <audio ref={audioRef} src="/notification.wav" preload="auto" />
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          {/* Space for mobile menu button if needed */}
        </div>
        <div className="flex-1" />
        {/* Right side icons */}
        <div className="flex items-center space-x-4">          {/* Notification bell */}
          <div className="relative notification-wrapper">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="flex rounded-full bg-white p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <span className="sr-only">Lihat notifikasi</span>
              <Bell className="h-6 w-6" />
              {completedDocs.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {completedDocs.length}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 notification-wrapper">
                <NotificationCenter 
                  notifications={notifications} 
                  onMarkAllRead={() => setCompletedDocs([])} 
                />
              </div>
            )}
          </div>          {/* Profile dropdown */}
          <div className="relative ml-3 profile-wrapper">
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
            )}          </div>
        </div>
      </div>
    </header>
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close notification center when clicking outside
      if (showNotif && !event.target.closest('.notification-wrapper')) {
        setShowNotif(false);
      }
      
      // Close profile menu when clicking outside
      if (isProfileMenuOpen && !event.target.closest('.profile-wrapper')) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif, isProfileMenuOpen]);
}
