import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    // Set cookie user_id agar bisa diambil di API lain
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    res.headers.set(
      "Set-Cookie",
      `user_id=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
