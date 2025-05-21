"use client";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminTable({ onCreateClick, createDisabled }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchAdmins() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/admin");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data admin");
        setAdmins(data.admins || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmins();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Daftar Admin</h2>
        <Button onClick={onCreateClick} disabled={createDisabled}>Create New Admin</Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Cari admin (username, email, nama, jabatan, NIP, WA) ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs border border-gray-300 rounded px-3 py-2"
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>No. WhatsApp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>Loading...</TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>Tidak ada admin terdaftar.</TableCell>
              </TableRow>
            ) : (
              (() => {
                const filtered = admins.filter((admin) => {
                  if (!search) return true;
                  const s = search.toLowerCase();
                  return (
                    (admin.username && admin.username.toLowerCase().includes(s)) ||
                    (admin.email && admin.email.toLowerCase().includes(s)) ||
                    (admin.nama && admin.nama.toLowerCase().includes(s)) ||
                    (admin.jabatan && admin.jabatan.toLowerCase().includes(s)) ||
                    (admin.nip && admin.nip.toLowerCase().includes(s)) ||
                    (admin.noWa && admin.noWa.toLowerCase().includes(s))
                  );
                });
                if (filtered.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-400 py-8">Tidak ada admin yang cocok dengan pencarian.</TableCell>
                    </TableRow>
                  );
                }
                return filtered.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.nama}</TableCell>
                    <TableCell>{admin.jabatan}</TableCell>
                    <TableCell>{admin.nip}</TableCell>
                    <TableCell>{admin.noWa}</TableCell>
                    <TableCell>{admin.isActive ? "Aktif" : "Nonaktif"}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ));
              })()
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
