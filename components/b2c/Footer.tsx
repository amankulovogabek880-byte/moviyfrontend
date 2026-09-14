import { t } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
      <div className="mx-auto max-w-6xl px-4">
        © {new Date().getFullYear()} {t("b2c.brand")}
      </div>
    </footer>
  );
}
