"use client";

import Image from "next/image";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex h-[100%] w-[100%] flex-col items-center">{children}</main>;
}
