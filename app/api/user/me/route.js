import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Ambil user dari session cookie (id disimpan di cookie 'user_id')
export async function GET(req) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ 
    where: { id: parseInt(session.user.id) },
    select: {
      id: true,
      username: true,
      email: true,
      nik: true,
      dusun: true,
      rt: true,
      rw: true,
      desa: true,
      kecamatan: true,
      kabupaten: true,
      provinsi: true,
      tanggalLahir: true,
      noWa: true,
      role: true,
    }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
