import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react"


// notifications: array of {id, title, message, time, type}
export default function NotificationCenter({ notifications = [], onMarkAllRead }) {

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

  // Debug: tombol test suara notifikasi
  const playTestSound = () => {
    const audio = document.createElement('audio');
    audio.src = '/notification.wav';
    audio.play();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Pusat Notifikasi</h2>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900" onClick={onMarkAllRead}>Tandai Semua Dibaca</button>
      </div>

      <div className="mt-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Tidak ada notifikasi</div>
        ) : (
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Lihat Semua Notifikasi</button>
      </div>
    </div>
  )
}
