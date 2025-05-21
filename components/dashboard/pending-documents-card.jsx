"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"

export default function PendingDocumentsCard() {
  const [pendingDocs, setPendingDocs] = useState([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchPending() {
      const res = await fetch("/api/documents")
      const json = await res.json()
      const documents = Array.isArray(json.documents) ? json.documents : []
      setPendingDocs(documents.filter(d => d.status === "pending"))
    }
    fetchPending()
  }, [])

  const filtered = pendingDocs.filter(doc => {
    const q = search.toLowerCase()
    return (
      doc.title?.toLowerCase().includes(q) ||
      doc.userName?.toLowerCase().includes(q) ||
      doc.userNik?.toLowerCase().includes(q)
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumen Pending</CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Cari judul, nama pemohon, atau NIK..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Tidak ada dokumen pending</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(doc => (
              <li
                key={doc.id}
                className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded transition"
                onClick={() => router.push(`/dashboard/sign?id=${doc.id}`)}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') router.push(`/dashboard/sign?id=${doc.id}`) }}
                role="button"
                aria-label={`Buka dokumen ${doc.title || doc.id}`}
              >
                <span className="flex items-center justify-center h-8 w-8 rounded bg-yellow-100 text-yellow-700">
                  <Clock className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{doc.title || "Tanpa Judul"}</div>
                  <div className="text-xs text-gray-500 truncate">{doc.userName || "-"} &bull; {doc.userNik || "-"}</div>
                </div>
                <span className="text-xs text-yellow-700 font-semibold">Pending</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
