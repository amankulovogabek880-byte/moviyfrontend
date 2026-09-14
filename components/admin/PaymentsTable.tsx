import { formatDateTime, formatUsd } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PaymentTransaction } from "@/types/payment";

export function PaymentsTable({ payments }: { payments: PaymentTransaction[] }) {
  if (payments.length === 0) return <EmptyState message={t("common.noResults")} />;

  return (
    <div className="overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">{t("admin.payments.colBooking")}</th>
            <th className="px-4 py-3">{t("admin.payments.colMethod")}</th>
            <th className="px-4 py-3">{t("admin.payments.colAmount")}</th>
            <th className="px-4 py-3">{t("admin.payments.colStatus")}</th>
            <th className="px-4 py-3">{t("admin.payments.colDate")}</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t border-border hover:bg-surface/50">
              <td className="px-4 py-3 font-mono">{p.bookingNumber}</td>
              <td className="px-4 py-3">
                {p.method === "CLICK"
                  ? t("admin.payments.methodClick")
                  : t("admin.payments.methodManual")}
              </td>
              <td className="px-4 py-3">{formatUsd(p.amount)}</td>
              <td className="px-4 py-3">
                <Badge
                  tone={
                    p.status === "SUCCESS"
                      ? "success"
                      : p.status === "FAILED"
                        ? "danger"
                        : "warning"
                  }
                >
                  {p.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted">{formatDateTime(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
