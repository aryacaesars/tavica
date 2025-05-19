
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminTable from "../../../components/dashboard/AdminTable";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useRef } from "react";

export default function CreateAdminPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nama: "",
    jabatan: "",
    nip: "",
    noWa: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admin, setAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      setAdminLoading(true);
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (res.ok) {
          setAdmin(data.admin);
        } else {
          setAdmin(null);
        }
      } catch {
        setAdmin(null);
      } finally {
        setAdminLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Ambil token dari cookie (bukan localStorage)
      let token = null;
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/);
        if (match) token = match[1];
      }
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers,
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat admin");
      setSuccess("Admin berhasil dibuat!");
      setForm({ username: "", email: "", password: "", nama: "", jabatan: "", nip: "", noWa: "" });
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state

  if (adminLoading) {
    return <div className="max-w-full mx-auto mt-10">Loading...</div>;
  }


  // Tidak ada redirect, admin biasa tetap bisa akses sebagai viewer


  // Handler for create button click
  const handleCreateClick = () => {
    if (admin && admin.role === "superadmin") {
      setOpen(true);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-10">
      <AdminTable
        onCreateClick={handleCreateClick}
        createDisabled={admin?.role !== "superadmin"}
      />

      {/* Dialog Form Create Admin (hanya superadmin yang bisa submit) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Admin Baru</DialogTitle>
            <DialogDescription>Isi form berikut untuk membuat admin baru.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input name="username" id="username" value={form.username} onChange={handleChange} placeholder="Username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input name="nama" id="nama" value={form.nama} onChange={handleChange} placeholder="Nama Lengkap" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input name="jabatan" id="jabatan" value={form.jabatan} onChange={handleChange} placeholder="Jabatan" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nip">NIP</Label>
              <Input name="nip" id="nip" value={form.nip} onChange={handleChange} placeholder="NIP" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noWa">No. WhatsApp</Label>
              <Input name="noWa" id="noWa" value={form.noWa} onChange={handleChange} placeholder="08xxxxxxxxxx" required />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={loading || admin?.role !== "superadmin"}>{loading ? "Menyimpan..." : "Buat Admin"}</Button>
            </DialogFooter>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {success && <div className="text-green-600 mt-2">{success}</div>}
          </form>
        </DialogContent>
      </Dialog>

      {/* Warning Modal untuk admin biasa */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Akses Ditolak</DialogTitle>
            <DialogDescription>Hanya superadmin yang berhak membuat admin baru!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)} className="w-full">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
