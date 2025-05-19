"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ProfileCard = dynamic(() => import("./ProfileCard"), { ssr: false });

export default function ProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdmin() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data admin");
        setAdmin(data.admin);
      } catch (err) {
        setError(err.message || "Gagal mengambil data admin");
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Profil Admin</h1>
      {error && <div className="mb-4 text-destructive text-center">{error}</div>}
      <ProfileCard admin={admin} loading={loading} />
    </div>
  );
}
