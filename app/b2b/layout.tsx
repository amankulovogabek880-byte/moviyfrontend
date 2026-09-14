"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "@/components/b2b/TopBar";

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/b2b/login";

  return (
    <div className="theme-b2b min-h-screen bg-background text-sm text-foreground">
      {!isLogin && <TopBar />}
      <main className={isLogin ? "" : "mx-auto max-w-7xl px-4 py-6"}>{children}</main>
    </div>
  );
}
