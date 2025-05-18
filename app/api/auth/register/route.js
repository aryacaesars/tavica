import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const {
      username, email, password, tanggalLahir, nik, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi, noWa
    } = await req.json();
    if (!username || !email || !password || !tanggalLahir || !nik || !dusun || !rt || !rw || !desa || !kecamatan || !kabupaten || !provinsi || !noWa) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Cek user sudah ada
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }, { nik }] },
    });
    if (existing) {
      return NextResponse.json({ error: "Email, username, atau NIK sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        tanggalLahir: new Date(tanggalLahir),
        nik,
        dusun,
        rt,
        rw,
        desa,
        kecamatan,
        kabupaten,
        provinsi,
        noWa,
        // role otomatis 'user' dari default
      },
    });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
