"use client";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import UserNotification from "./UserNotification"; // Added
import { signOut } from "next-auth/react";

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
          <UserNotification /> {/* Added */}
          {/* Notification bell */}
          {/* <div className="relative notification-wrapper"> // Removed
            <button // Removed
              onClick={() => setShowNotif(!showNotif)} // Removed
              className="flex rounded-full bg-white p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" // Removed
            > // Removed
              <span className="sr-only">Lihat notifikasi</span> // Removed
              <Bell className="h-6 w-6" /> // Removed
              {completedDocs.length > 0 && ( // Removed
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"> // Removed
                  {completedDocs.length} // Removed
                </span> // Removed
              )} // Removed
            </button> // Removed
            {showNotif && ( // Removed
              <div className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 notification-wrapper"> // Removed
                <NotificationCenter  // Removed
                  notifications={notifications}  // Removed
                  onMarkAllRead={() => setCompletedDocs([])}  // Removed
                /> // Removed
              </div> // Removed
            )} // Removed
          </div>           */} {/* Profile dropdown */}
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
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    signOut({ callbackUrl: '/auth/login' });
                  }}
                >
                  Keluar
                </button>
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
      // if (showNotif && !event.target.closest('.notification-wrapper')) { // Removed
      //   setShowNotif(false); // Removed
      // } // Removed
      
      // Close profile menu when clicking outside
      if (isProfileMenuOpen && !event.target.closest('.profile-wrapper')) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]); // Removed showNotif
}
