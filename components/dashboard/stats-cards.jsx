import { FileText, Users, Clock, Bell } from "lucide-react"

export default function StatsCards() {
  const stats = [
    {
      name: "Total Dokumen",
      value: "128",
      icon: FileText,
      change: "+12.5%",
      changeType: "increase",
    },
    {
      name: "Pengguna Aktif",
      value: "2,345",
      icon: Users,
      change: "+3.2%",
      changeType: "increase",
    },
    {
      name: "Antrian Hari Ini",
      value: "42",
      icon: Clock,
      change: "-5.1%",
      changeType: "decrease",
    },
    {
      name: "Notifikasi Terkirim",
      value: "856",
      icon: Bell,
      change: "+18.7%",
      changeType: "increase",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <stat.icon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`inline-flex items-center text-sm font-medium ${
                stat.changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change}
              <span className="ml-1.5 text-xs text-gray-500">dari bulan lalu</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
