"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

export default function DocumentFinishedChart() {
  const [chartData, setChartData] = useState([])
  const [months, setMonths] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/documents")
      const json = await res.json()
      const documents = Array.isArray(json.documents) ? json.documents : []
      // Group by month/year, count finished (status: 'verified')
      const finished = documents.filter(d => d.status === "verified")
      const byMonth = {}
      finished.forEach(doc => {
        const date = new Date(doc.verifiedAt)
        if (isNaN(date)) return
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        byMonth[key] = (byMonth[key] || 0) + 1
      })
      // Sort by month, take last 6 months
      const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))
      const last6 = sorted.slice(-6)
      setMonths(last6.map(([k]) => {
        const [y, m] = k.split("-")
        return `${m}/${y}`
      }))
      setChartData(last6.map(([k, v]) => {
        const [y, m] = k.split("-")
        return { month: `${m}/${y}`, selesai: v }
      }))
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekap Dokumen Selesai (6 Bulan Terakhir)</CardTitle>
        <CardDescription>Jumlah dokumen berstatus selesai (verified) per bulan</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada dokumen selesai</div>
        ) : (
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32} style={{ fontSize: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(v) => [v, 'Selesai']} />
                <Bar dataKey="selesai" fill="hsl(var(--chart-1, 142, 71%, 45%))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan total dokumen selesai 6 bulan terakhir
        </div>
      </CardFooter>
    </Card>
  )
}