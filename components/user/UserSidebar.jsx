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
import { FileText, CheckCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserSidebar() {
  const menuItems = [
    { name: "Pengajuan Dokumen", icon: FileText, href: "/user" },
    { name: "Dokumen Selesai", icon: CheckCircle, href: "/user/my-documents" },
  ];

  return (
    <aside className="hidden w-48 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col sticky top-0 h-screen z-30">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link href="/user" className="text-xl font-bold text-gray-900">
          Tavica User
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-900" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
            type="button"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-900" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
