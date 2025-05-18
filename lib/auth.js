import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Try admin login first
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email }
          });

          if (admin) {
            const isValid = await bcrypt.compare(credentials.password, admin.password);
            if (isValid) {
              return {
                id: admin.id.toString(),
                email: admin.email,
                name: admin.name,
                role: "admin"
              };
            }
          }

          // If admin login fails, try user login
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            role: user.role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
};

export async function verifyAdminToken(token) {
  try {
    // Get admin from database by token
    const admin = await prisma.admin.findFirst({
      where: { 
        isActive: true,
        // Add token field to Admin model in schema.prisma
        token: token
      }
    });
    
    if (!admin) {
      return null;
    }
    
    return admin;
  } catch (error) {
    return null;
  }
}

export async function verifyAdminCredentials(email, password) {
  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return null;
  }

  return admin;
} 