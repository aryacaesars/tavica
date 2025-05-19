import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  // 1. Cek token admin dari cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]*)/);
  const token = match ? match[1] : null;

  if (token) {
    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Not authenticated as admin" }, { status: 401 });
    }
    // Return data admin yang login via token
    return NextResponse.json({ admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      nama: admin.nama,
      jabatan: admin.jabatan,
      nip: admin.nip,
      noWa: admin.noWa,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      lastLogin: admin.lastLogin,
    }});
  }

  // 2. Fallback: session NextAuth (user login biasa)
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session?.user?.role !== "admin" && session?.user?.role !== "superadmin")) {
    return NextResponse.json({ error: "Not authenticated as admin" }, { status: 401 });
  }

  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(session.user.id) },
    select: {
      id: true,
      username: true,
      email: true,
      nama: true,
      jabatan: true,
      nip: true,
      noWa: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  return NextResponse.json({ admin });
}
