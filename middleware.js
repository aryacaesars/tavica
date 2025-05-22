import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;


    // Admin routes (allow both admin and superadmin)
    if (path.startsWith("/dashboard") && token?.role !== "admin" && token?.role !== "superadmin") {
      return NextResponse.redirect(new URL("/unauthorized?from=" + encodeURIComponent(path), req.url));
    }

    // User routes
    if (path.startsWith("/user") && !token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Regular users should not access admin pages
    if (path.startsWith("/user") && (token?.role === "admin" || token?.role === "superadmin")) {
      return NextResponse.redirect(new URL("/unauthorized?from=" + encodeURIComponent(path), req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/user/:path*",
    "/dashboard/:path*",
  ],
}; 