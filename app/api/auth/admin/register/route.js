import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { verifyAdminToken } from "@/lib/auth";

const prisma = new PrismaClient();



export async function POST(request) {
  try {
    // --- AUTHORIZATION: Only superadmin can create admin ---
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const adminUser = await verifyAdminToken(token);
    if (!adminUser || adminUser.role !== "superadmin") {
      return NextResponse.json({ error: "Hanya superadmin yang bisa membuat admin" }, { status: 403 });
    }

    const { username, email, password, nama, jabatan, nip, noWa } = await request.json();
    if (!username || !email || !password || !nama || !jabatan || !nip || !noWa) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin dengan email ini sudah terdaftar" },
        { status: 400 }
      );
    }

    // Generate admin token
    const adminToken = crypto.randomBytes(32).toString('hex');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin (default role: 'admin')
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        nama,
        jabatan,
        nip,
        noWa,
        isActive: true,
        token: adminToken,
        role: 'admin' // <--- force role admin, not superadmin
      }
    });

    // Return admin token and details
    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      adminToken,
      admin: {
        id: admin.id,
        nama: admin.nama,
        jabatan: admin.jabatan,
        nip: admin.nip,
        noWa: admin.noWa,
        email: admin.email,
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}