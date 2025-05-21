"use client"

import { FileText, Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"


export default function StatsCards() {
  const [stats, setStats] = useState([
    { name: "Total Dokumen", value: "-", icon: FileText, change: "", changeType: "increase" },
    { name: "Pengguna Aktif", value: "-", icon: Users, change: "", changeType: "increase" },
    { name: "Antrian Hari Ini", value: "-", icon: Clock, change: "", changeType: "decrease" },
  ])

  useEffect(() => {
    async function fetchStats() {
      // Fetch documents
      const docRes = await fetch("/api/documents");
      const docData = await docRes.json();
      const documents = Array.isArray(docData.documents) ? docData.documents : [];
      // Total dokumen
      const totalDocs = documents.length;
      // Antrian hari ini (status pending)
      const pendingDocs = documents.filter((d) => d.status === "pending").length;

      // Fetch users
      let userCount = "-";
      try {
        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        userCount = Array.isArray(userData.users) ? userData.users.length : "-";
      } catch {}

      setStats([
        { name: "Total Dokumen", value: totalDocs, icon: FileText, change: "", changeType: "increase" },
        { name: "Pengguna Aktif", value: userCount, icon: Users, change: "", changeType: "increase" },
        { name: "Antrian Hari Ini", value: pendingDocs, icon: Clock, change: "", changeType: pendingDocs > 0 ? "decrease" : "increase" },
      ]);
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      ))}
    </div>
  )
}
