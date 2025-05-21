"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

export default function ProfileCard({ admin, loading }) {
  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mb-2">
          <User className="h-12 w-12 text-gray-500" />
        </div>
        <CardTitle className="text-xl text-center">
          {loading ? <Skeleton className="h-6 w-32" /> : admin?.nama || admin?.username || "-"}
        </CardTitle>
        <div className="text-sm text-gray-500">{loading ? <Skeleton className="h-4 w-24" /> : admin?.jabatan || "Admin"}</div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField label="Email" value={admin?.email} loading={loading} />
          <ProfileField label="Username" value={admin?.username} loading={loading} />
          <ProfileField label="NIP" value={admin?.nip} loading={loading} />
          <ProfileField label="No. WA" value={admin?.noWa} loading={loading} />
          <ProfileField label="Role" value={admin?.role} loading={loading} />
          <ProfileField label="Status" value={admin?.isActive ? "Aktif" : "Nonaktif"} loading={loading} />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileField({ label, value, loading }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-gray-500">{label}</Label>
      {loading ? <Skeleton className="h-5 w-28" /> : <span className="text-base font-medium text-gray-900">{value || "-"}</span>}
    </div>
  );
}
