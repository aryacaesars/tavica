"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react"; // Added X for close button

export default function UserNotification() {
  const [showNotif, setShowNotif] = useState(false);
  const [completedDocs, setCompletedDocs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const audioRef = useRef(null);
  const notificationRef = useRef(null); // Ref for the notification wrapper

  useEffect(() => {
    let prevIds = [];
    async function getCompletedDocs() {
      console.log("UserNotification: Fetching completed documents from /api/signed-documents...");
      try {
        const response = await fetch('/api/signed-documents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const docs = await response.json();
        console.log("UserNotification: Fetched documents:", docs);

        // Filter documents to include only those from the last 6 hours
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const recentDocs = docs.filter(doc => {
          const docTime = new Date(doc.updatedAt || doc.createdAt);
          return docTime >= sixHoursAgo;
        });
        console.log("UserNotification: Recent documents (last 6 hours):", recentDocs);

        const newIds = recentDocs.map(doc => doc.id);
        const isNew = newIds.some(id => !prevIds.includes(id));
        
        if (isNew && prevIds.length > 0 && docs.length > prevIds.length) {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => console.error("Error playing sound:", error));
          }
        }
        prevIds = newIds;
        setCompletedDocs(recentDocs); // Use filtered docs
        const mappedNotifications = recentDocs.map(doc => ({ // Use filtered docs
          id: doc.id,
          title: doc.title || 'Dokumen tanpa judul',
          message: `Status: Dokumen telah selesai dan ditandatangani`,
          time: new Date(doc.updatedAt || doc.createdAt).toLocaleString('id-ID', { 
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' 
          }),
          type: 'success',
        }));
        console.log("UserNotification: Mapped notifications:", mappedNotifications);
        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("UserNotification: Error fetching signed documents:", error);
        // Optionally, set an error state here to display a message to the user
      }
    }
    getCompletedDocs();
    const interval = setInterval(getCompletedDocs, 10000); // polling setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log("UserNotification: Rendering with completedDocs.length:", completedDocs.length, "Notifications:", notifications);

  return (
    <div className="relative notification-wrapper" ref={notificationRef}>
      <audio ref={audioRef} src="/notification.wav" preload="auto" />
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
        <div className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Notifikasi</h3>
            <button 
              onClick={() => setShowNotif(false)} 
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Tutup notifikasi</span>
            </button>
          </div>
          {notifications.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <li key={notification.id} className="py-3">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {completedDocs.length > 0 && (
                 <button
                    onClick={() => {
                      setCompletedDocs([]);
                      // Ideally, you might want to call an API to mark notifications as read on the server too
                      console.log("UserNotification: Marking all as read.");
                    }}
                    className="mt-3 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Tandai semua sudah dibaca
                  </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Tidak ada notifikasi baru.</p>
          )}
        </div>
      )}
    </div>
  );
}
