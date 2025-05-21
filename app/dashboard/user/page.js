"use client"

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

export default function DashboardUserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data user");
        // Ambil user pertama saja agar tampilan tidak berubah
        setUser(Array.isArray(data.users) ? data.users[0] : null);
      } catch (err) {
        setError(err.message || "Gagal mengambil data user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <div>Memuat data user...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>User tidak ditemukan.</div>;

return (
  <main className="max-w-full overflow-x-auto bg-white p-8 rounded-lg shadow-md mt-8">
    <h1 className="text-2xl font-bold mb-6 text-center">Data User</h1>
    <div className="flex justify-end mb-4">
      <input
        type="text"
        className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Cari nama, email, NIK, atau WA..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>NIK</TableHead>
          <TableHead>No. WA</TableHead>
          <TableHead>Tanggal Lahir</TableHead>
          <TableHead>Alamat</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {user && (!search || [user.username, user.email, user.nik, user.noWa].some(val => val && val.toLowerCase().includes(search.toLowerCase()))) ? (
          <TableRow>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.nik}</TableCell>
            <TableCell>
              {user.noWa ? (
                <a
                  href={`https://wa.me/62${user.noWa.replace(/^0+/, '').replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline hover:text-green-800"
                >
                  {user.noWa}
                </a>
              ) : ''}
            </TableCell>
            <TableCell>
              {user.tanggalLahir ? new Date(user.tanggalLahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </TableCell>
            <TableCell className="max-w-[200px] whitespace-pre-line align-top">
              {[
                `Dusun ${user.dusun}`,
                `RT ${user.rt}/RW ${user.rw}`,
              ].filter(Boolean).join(',\n')}
            </TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold"
                onClick={async () => {
                  if (!window.confirm('Yakin ingin menghapus akun user ini?')) return;
                  try {
                    const res = await fetch(`/api/user/me`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Gagal menghapus user');
                    window.location.reload();
                  } catch (err) {
                    alert(err.message || 'Gagal menghapus user');
                  }
                }}
              >
                Hapus
              </button>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-400">Tidak ada user yang cocok.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </main>
);
}
