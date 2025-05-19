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

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data user");
        setUser(data.user);
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
          <TableRow>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.nik}</TableCell>
            <TableCell>{user.noWa}</TableCell>
            <TableCell>
              {user.tanggalLahir ? new Date(user.tanggalLahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </TableCell>
            <TableCell className="max-w-[200px] whitespace-normal align-top">
              <div style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {(() => {
                  const alamat = `Dusun ${user.dusun}, RT ${user.rt}/RW ${user.rw}, ${user.desa}, ${user.kecamatan}, ${user.kabupaten}, ${user.provinsi}`;
                  if (alamat.length > 60) {
                    return <>
                      {alamat.slice(0, 60)}<br />
                      {alamat.slice(60)}
                    </>;
                  }
                  return alamat;
                })()}
              </div>
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
        </TableBody>
      </Table>
    </main>
  );
}
