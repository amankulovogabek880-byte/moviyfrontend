"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="theme-admin min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="theme-admin flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
