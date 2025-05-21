import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/user - Ambil semua user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const users = await prisma.user.findMany({
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
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ users });
  } catch (err) {
    // Selalu return JSON meski error
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
