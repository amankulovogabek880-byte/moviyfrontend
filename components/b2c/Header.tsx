import Link from "next/link";
import { t } from "@/lib/i18n";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl font-bold text-accent">
          {t("b2c.brand")}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-accent">
            {t("b2c.nav.home")}
          </Link>
          <Link href="/tours" className="hover:text-accent">
            {t("b2c.nav.tours")}
          </Link>
          <Link href="/booking/my-bookings" className="text-muted hover:text-accent">
            {t("b2c.nav.myBooking")}
          </Link>
        </nav>
      </div>
    </header>
  );
}