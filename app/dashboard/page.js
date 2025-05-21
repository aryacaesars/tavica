import StatsCards from "@/components/dashboard/stats-cards"
import RecentRequests from "@/components/dashboard/recent-requests"
import QueueManagement from "@/components/dashboard/queue-management"
import NotificationCenter from "@/components/dashboard/notification-center"
import DocumentFinishedChart from "@/components/dashboard/document-finished-chart"
import PendingDocumentsCard from "@/components/dashboard/pending-documents-card"

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        {/* Stats Cards */}
        <StatsCards />
        <div className="my-6">
          <DocumentFinishedChart />
        </div>
        <div className="my-6">
          <PendingDocumentsCard />
        </div>
        {/* Two Column Layout for Desktop */}
  
      </div>
    </main>
  )
}
