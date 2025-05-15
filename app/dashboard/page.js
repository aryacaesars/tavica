import StatsCards from "@/components/dashboard/stats-cards"
import RecentRequests from "@/components/dashboard/recent-requests"
import QueueManagement from "@/components/dashboard/queue-management"
import NotificationCenter from "@/components/dashboard/notification-center"

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        {/* Stats Cards */}
        <StatsCards />
        {/* Two Column Layout for Desktop */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Requests */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <RecentRequests />
          </div>
          {/* Queue Management */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <QueueManagement />
          </div>
        </div>
        {/* Notification Center */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <NotificationCenter />
        </div>
      </div>
    </main>
  )
}
