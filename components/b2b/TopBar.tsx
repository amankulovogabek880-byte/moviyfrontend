"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { logoutRequest } from "@/hooks/useAuth";
import { useB2BMe } from "@/hooks/b2b/useMe";

const navItems = [
  { href: "/b2b", label: "b2b.nav.dashboard" },
  { href: "/b2b/tours", label: "b2b.nav.tours" },
  { href: "/b2b/bookings", label: "b2b.nav.bookings" },
];

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me } = useB2BMe();
  const items = [
    ...navItems,
    ...(me?.partnerUserRole === "OWNER" ? [{ href: "/b2b/team", label: "b2b.nav.team" }] : []),
    { href: "/b2b/profile", label: "b2b.nav.profile" },
  ];

  async function handleLogout() {
    await logoutRequest();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-accent text-accent-foreground">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold">{t("b2b.brand")}</span>
          <nav className="flex items-center gap-4 text-sm">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "opacity-80 hover:opacity-100",
                  pathname === item.href && "font-semibold opacity-100 underline"
                )}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100"
        >
          <LogOut className="h-4 w-4" /> {t("common.logout")}
        </button>
      </div>
    </header>
  );
}