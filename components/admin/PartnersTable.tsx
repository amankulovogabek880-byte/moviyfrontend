import Link from "next/link";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { t } from "@/lib/i18n";
import type { Partner } from "@/types/partner";

export function PartnersTable({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return <EmptyState message={t("common.noResults")} />;

  return (
    <div className="overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">{t("admin.partners.colCompany")}</th>
            <th className="px-4 py-3">{t("admin.partners.colEmail")}</th>
            <th className="px-4 py-3">{t("admin.partners.colDiscount")}</th>
            <th className="px-4 py-3">{t("admin.partners.colStatus")}</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p) => (
            <tr key={p.id} className="border-t border-border hover:bg-surface/50">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/partners/${p.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {p.companyName}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{p.email}</td>
              <td className="px-4 py-3">{p.discountPercent}%</td>
              <td className="px-4 py-3">
                <Badge tone={p.isActive ? "success" : "neutral"}>
                  {p.isActive ? t("admin.partners.active") : t("admin.partners.suspended")}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
