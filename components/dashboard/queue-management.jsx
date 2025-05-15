import { Clock, User, ArrowRight } from "lucide-react"

export default function QueueManagement() {
  const currentQueue = [
    {
      number: "A001",
      name: "Rudi Hartono",
      service: "Pembuatan KTP",
      status: "Sedang Dilayani",
      counter: "Loket 1",
    },
    {
      number: "A002",
      name: "Rina Wijaya",
      service: "Surat Keterangan Domisili",
      status: "Menunggu",
      counter: "Loket 2",
    },
    {
      number: "A003",
      name: "Doni Kusuma",
      service: "Legalisir Dokumen",
      status: "Menunggu",
      counter: "Loket 1",
    },
    {
      number: "A004",
      name: "Maya Sari",
      service: "Surat Keterangan Usaha",
      status: "Menunggu",
      counter: "Loket 3",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Manajemen Antrian</h2>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Lihat Semua</button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-gray-500" />
            <h3 className="ml-2 text-sm font-medium text-gray-900">Antrian Saat Ini</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">A001</div>
          <div className="mt-1 text-sm text-gray-500">Loket 1 - Pembuatan KTP</div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center">
            <User className="h-6 w-6 text-gray-500" />
            <h3 className="ml-2 text-sm font-medium text-gray-900">Total Antrian Hari Ini</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">42</div>
          <div className="mt-1 text-sm text-gray-500">12 Selesai, 30 Menunggu</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">Antrian Berikutnya</h3>
        <ul className="mt-2 divide-y divide-gray-200">
          {currentQueue.map((queue) => (
            <li key={queue.number} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      queue.status === "Sedang Dilayani" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        queue.status === "Sedang Dilayani" ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      {queue.number}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{queue.name}</p>
                    <p className="text-xs text-gray-500">{queue.service}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      queue.status === "Sedang Dilayani"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {queue.status}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{queue.counter}</span>
                  {queue.status === "Menunggu" && (
                    <button className="ml-4 rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
