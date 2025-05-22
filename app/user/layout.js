"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/user/UserSidebar";
import Link from "next/link";
import { FileText, CheckCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import UserHeader from "@/components/user/UserHeader";

export default function UserLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background w-full">
        {/* Sidebar */}
        <UserSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen w-full">
          <UserHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
