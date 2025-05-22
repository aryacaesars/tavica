"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [countdown, setCountdown] = useState(5);
  const [redirectPath, setRedirectPath] = useState("");
  const [userType, setUserType] = useState("");
  useEffect(() => {
    if (!session) return; // Wait for session to be loaded
    
    // Determine user type and correct redirect path based on session
    const path = window.location.search;
    const params = new URLSearchParams(path);
    const from = params.get("from") || "";
    
    // Get user role from NextAuth session
    const userRole = session?.user?.role || "user";
    
    // Set user type for display
    setUserType(userRole === "admin" || userRole === "superadmin" ? "admin" : "user");
    
    // Determine where to redirect based on user role
    let redirectTo = "/";
    if (userRole === "admin" || userRole === "superadmin") {
      redirectTo = "/dashboard";
    } else if (userRole === "user") {
      redirectTo = "/user";
    }
    
    setRedirectPath(redirectTo);
    
  }, [session]);
  
  useEffect(() => {
    if (!redirectPath) return; // Don't start countdown until redirectPath is set
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to ensure this doesn't happen during render
          setTimeout(() => {
            router.push(redirectPath);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectPath, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[90%] max-w-md shadow-lg">        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/TAVICA.svg"
              alt="TAVICA Logo"
              width={120}
              height={40}
              className="h-12 w-auto"
            />
          </div>
          <div className="flex justify-center mb-3">
            <ShieldAlert className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Akses Ditolak
          </CardTitle>
          <CardDescription className="text-center">
            Anda tidak memiliki izin untuk mengakses halaman ini
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
              <p className="text-sm text-gray-700">
                {userType === "admin"
                  ? "Sebagai Admin, Anda tidak dapat mengakses halaman yang khusus untuk pengguna reguler."
                  : "Sebagai Pengguna, Anda tidak dapat mengakses halaman yang khusus untuk admin."}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Anda akan diarahkan ke {redirectPath === "/dashboard" ? "Dashboard Admin" : 
                  redirectPath === "/user" ? "Halaman Pengguna" : "Halaman Utama"} dalam{" "}
                <span className="font-bold text-red-600">{countdown}</span> detik.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            variant="outline" 
            className="w-full" 
            asChild
          >
            <Link href="/">
              Kembali ke Beranda
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}