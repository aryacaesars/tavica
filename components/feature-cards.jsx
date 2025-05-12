import { Clock, FileSignature, Bell } from "lucide-react"

export default function FeatureCards() {
  const features = [
    {
      title: "Antrian Online",
      description:
        "Sistem antrian digital yang memudahkan warga untuk mendaftar dan memantau status antrian tanpa harus menunggu di kantor kelurahan.",
      icon: Clock,
    },
    {
      title: "E-Signature",
      description:
        "Tanda tangan elektronik yang aman dan legal untuk mempercepat proses pengesahan dokumen tanpa perlu tatap muka.",
      icon: FileSignature,
    },
    {
      title: "Notifikasi Real-time",
      description:
        "Dapatkan pemberitahuan instan tentang status dokumen, jadwal antrian, dan pengumuman penting dari kelurahan.",
      icon: Bell,
    },
  ]

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Fitur Unggulan</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Tavica menyediakan berbagai fitur yang dirancang untuk memudahkan administrasi kelurahan dan meningkatkan
            pelayanan kepada warga.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <feature.icon className="h-6 w-6 text-gray-800" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
