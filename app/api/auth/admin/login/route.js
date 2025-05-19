import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');

    // Update admin with new token
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        token,
        lastLogin: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role // pastikan role dikembalikan
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 