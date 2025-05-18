"use client";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { FileText, CheckCircle } from "lucide-react";

export default function UserLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background w-full">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="flex flex-col items-center py-8">
            <img src="/TAVICA.svg" alt="TAVICA Logo" className="h-10 mb-4" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="/user">
                    <FileText className="mr-2 h-5 w-5" />
                    Pengajuan Dokumen
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/user/my-documents">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Dokumen Selesai
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="mt-auto mb-2 text-xs text-gray-400 flex justify-center">
            Tavica © 2025
          </SidebarFooter>
        </Sidebar>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
