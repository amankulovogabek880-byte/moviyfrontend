import { formatDateTime } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { EmptyState } from "@/components/shared/EmptyState";
import type { AuditLogEntry } from "@/types/audit";

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) return <EmptyState message={t("common.noResults")} />;

  return (
    <div className="overflow-x-auto rounded-xl2 border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">{t("admin.auditLog.colActor")}</th>
            <th className="px-4 py-3">{t("admin.auditLog.colAction")}</th>
            <th className="px-4 py-3">{t("admin.auditLog.colEntity")}</th>
            <th className="px-4 py-3">{t("admin.auditLog.colDate")}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-t border-border hover:bg-surface/50">
              <td className="px-4 py-3">{e.actorEmail}</td>
              <td className="px-4 py-3">{e.action}</td>
              <td className="px-4 py-3 text-muted">
                {e.entityType} #{e.entityId}
              </td>
              <td className="px-4 py-3 text-muted">{formatDateTime(e.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
