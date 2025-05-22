"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/user/me");
        if (!res.ok) throw new Error("Gagal mengambil data user");
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mb-2">
          <User className="h-12 w-12 text-gray-500" />
        </div>
        <CardTitle className="text-xl text-center">
          {loading ? <Skeleton className="h-6 w-32" /> : user?.username || "-"}
        </CardTitle>
        <div className="text-sm text-gray-500">{loading ? <Skeleton className="h-4 w-24" /> : user?.email || "User"}</div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <tbody>
              <ProfileRow label="NIK" value={user?.nik} loading={loading} />
              <ProfileRow label="No. WhatsApp" value={user?.noWa} loading={loading} />
              <ProfileRow label="Tanggal Lahir" value={user?.tanggalLahir ? new Date(user.tanggalLahir).toLocaleDateString("id-ID") : "-"} loading={loading} />
              <ProfileRow label="Dusun" value={user?.dusun} loading={loading} />
              <ProfileRow label="RT/RW" value={user?.rt && user?.rw ? `RT ${user.rt}/RW ${user.rw}` : "-"} loading={loading} />
              <ProfileRow label="Desa" value={user?.desa} loading={loading} />
              <ProfileRow label="Kecamatan" value={user?.kecamatan} loading={loading} />
              <ProfileRow label="Kabupaten" value={user?.kabupaten} loading={loading} />
              <ProfileRow label="Provinsi" value={user?.provinsi} loading={loading} />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


function ProfileRow({ label, value, loading }) {
  return (
    <tr>
      <td className="py-2 pr-4 text-gray-500 font-medium align-top whitespace-nowrap w-32">{label}</td>
      <td className="py-2 text-gray-900">{loading ? <Skeleton className="h-5 w-28" /> : (value || "-")}</td>
    </tr>
  );
}

