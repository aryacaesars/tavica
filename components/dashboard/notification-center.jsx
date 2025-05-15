import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react"

export default function NotificationCenter() {
  const notifications = [
    {
      id: 1,
      title: "Permintaan Dokumen Baru",
      message: "Budi Santoso telah mengajukan permintaan Surat Keterangan Domisili",
      time: "5 menit yang lalu",
      type: "info",
    },
    {
      id: 2,
      title: "Antrian Menumpuk",
      message: "Terdapat lebih dari 20 orang dalam antrian untuk layanan Pembuatan KTP",
      time: "30 menit yang lalu",
      type: "warning",
    },
    {
      id: 3,
      title: "Dokumen Selesai",
      message: "5 dokumen telah selesai diproses dan siap untuk diambil",
      time: "1 jam yang lalu",
      type: "success",
    },
    {
      id: 4,
      title: "Pengumuman Sistem",
      message: "Sistem akan melakukan pemeliharaan pada tanggal 20 Mei 2023 pukul 23:00 WIB",
      time: "3 jam yang lalu",
      type: "info",
    },
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Pusat Notifikasi</h2>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Tandai Semua Dibaca</button>
      </div>

      <div className="mt-4">
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li key={notification.id} className="py-4">
              <div className="flex">
                <div className="mr-4 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                </div>
                <div>
                  <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    <span className="sr-only">Tutup</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Lihat Semua Notifikasi</button>
      </div>
    </div>
  )
}
