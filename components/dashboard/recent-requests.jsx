import { FileText, MoreVertical, CheckCircle, Clock, XCircle } from "lucide-react"

export default function RecentRequests() {
  const requests = [
    {
      id: "REQ-001",
      name: "Budi Santoso",
      document: "Surat Keterangan Domisili",
      date: "2023-05-15",
      status: "Selesai",
    },
    {
      id: "REQ-002",
      name: "Siti Rahayu",
      document: "Surat Keterangan Usaha",
      date: "2023-05-16",
      status: "Dalam Proses",
    },
    {
      id: "REQ-003",
      name: "Ahmad Hidayat",
      document: "Surat Keterangan Tidak Mampu",
      date: "2023-05-16",
      status: "Dalam Proses",
    },
    {
      id: "REQ-004",
      name: "Dewi Lestari",
      document: "Surat Pengantar KTP",
      date: "2023-05-14",
      status: "Ditolak",
    },
    {
      id: "REQ-005",
      name: "Joko Widodo",
      document: "Surat Keterangan Kelahiran",
      date: "2023-05-13",
      status: "Selesai",
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "Selesai":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Dalam Proses":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Ditolak":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Permintaan Dokumen Terbaru</h2>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Lihat Semua</button>
      </div>

      <div className="mt-4 overflow-hidden">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Dokumen
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Tanggal
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-3 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-gray-400" />
                        {request.document}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.date}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
