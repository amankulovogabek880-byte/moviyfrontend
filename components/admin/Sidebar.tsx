"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Users,
  Receipt,
  CreditCard,
  History,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { logoutRequest } from "@/hooks/useAuth";

const navItems = [
  { href: "/admin", label: "admin.nav.dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "admin.nav.tours", icon: Map },
  { href: "/admin/partners", label: "admin.nav.partners", icon: Users },
  { href: "/admin/bookings", label: "admin.nav.bookings", icon: Receipt },
  { href: "/admin/payments", label: "admin.nav.payments", icon: CreditCard },
  { href: "/admin/audit-log", label: "admin.nav.auditLog", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutRequest();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-16 items-center px-5">
        <span className="font-display text-lg font-bold text-accent">{t("admin.brand")}</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-surface"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.label)}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="mx-3 mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface"
      >
        <LogOut className="h-4 w-4" /> {t("common.logout")}
      </button>
    </aside>
  );
}
