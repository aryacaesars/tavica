import Sidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"

export const metadata = {
  title: "Dashboard Admin - Tavica",
  description: "Panel administrasi untuk pengelolaan dokumen kelurahan digital",
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
