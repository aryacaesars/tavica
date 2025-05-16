"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, ArrowUpRight } from "lucide-react"

export default function UserStats() {
  // In a real application, these would be fetched from an API
  const stats = [
    {
      title: "Total Pengguna",
      value: "1,248",
      icon: Users,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Pengguna Aktif",
      value: "1,186",
      icon: UserCheck,
      change: "+4%",
      changeType: "positive",
    },
    {
      title: "Pengguna Tidak Aktif",
      value: "62",
      icon: UserX,
      change: "-2%",
      changeType: "negative",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs">
              <span
                className={
                  stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                }
              >
                {stat.change}
              </span>
              <ArrowUpRight
                className={`ml-1 h-3 w-3 ${
                  stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                } ${stat.changeType === "negative" ? "rotate-180 transform" : ""}`}
              />
              <span className="ml-1 text-gray-500">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
