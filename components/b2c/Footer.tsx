import Link from "next/link";
import { t } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <span>
          © {new Date().getFullYear()} {t("b2c.brand")}
        </span>
        {/* Admin/hamkor login intentionally kept out of the main nav — see
            components/b2c/Header.tsx, which now points "Mening bronlarim" to
            /my-bookings instead. This link is the only remaining way to reach
            the staff/partner login from the public site. */}
        <Link href="/login" className="text-xs text-muted hover:text-accent">
          {t("b2c.footer.staffLogin")}
        </Link>
      </div>
    </footer>
  );
}