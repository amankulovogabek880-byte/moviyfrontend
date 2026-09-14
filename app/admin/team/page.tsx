"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminTeamMemberFormSchema, type AdminTeamMemberFormValues } from "@/lib/schemas/auth";
import { useAdminTeam, useAddAdminTeamMember } from "@/hooks/admin/useTeam";
import { useAdminMe } from "@/hooks/admin/useMe";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Skeleton } from "@/components/shared/Skeleton";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { AdminRole } from "@/types/auth";

const roleLabelKey: Record<AdminRole, string> = {
  SUPER_ADMIN: "admin.team.roleSuperAdmin",
  CONTENT_ADMIN: "admin.team.roleContentAdmin",
  FINANCE_ADMIN: "admin.team.roleFinanceAdmin",
};

export default function AdminTeamPage() {
  const { data: me, isLoading: meLoading } = useAdminMe();
  const { data, isLoading, isError, error, refetch } = useAdminTeam();
  const addMember = useAddAdminTeamMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminTeamMemberFormValues>({
    resolver: zodResolver(adminTeamMemberFormSchema),
    defaultValues: { fullName: "", email: "", adminRole: "CONTENT_ADMIN" },
  });

  async function onSubmit(values: AdminTeamMemberFormValues) {
    await addMember.mutateAsync(values);
    reset({ fullName: "", email: "", adminRole: "CONTENT_ADMIN" });
  }

  if (meLoading) return <Skeleton className="h-64 w-full rounded-xl2" />;
  if (me && me.adminRole !== "SUPER_ADMIN") {
    return <ErrorMessage message={t("admin.team.accessDenied")} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("admin.team.title")}</h1>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl2" />
      ) : isError ? (
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">{t("admin.team.colName")}</th>
                <th className="px-3 py-2">{t("admin.team.colEmail")}</th>
                <th className="px-3 py-2">{t("admin.team.colRole")}</th>
                <th className="px-3 py-2">{t("admin.team.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((member) => (
                <tr key={member.id} className="border-t border-border">
                  <td className="px-3 py-2">{member.fullName}</td>
                  <td className="px-3 py-2 text-muted">{member.email}</td>
                  <td className="px-3 py-2">{t(roleLabelKey[member.adminRole])}</td>
                  <td className="px-3 py-2">
                    <Badge tone={member.isActive ? "success" : "danger"}>
                      {member.isActive ? t("admin.partners.active") : t("admin.partners.suspended")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="rounded-xl2 border border-border p-5">
        <h2 className="mb-4 font-semibold">{t("admin.team.addMember")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
          <Input
            label={t("admin.team.colName")}
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Input
            label={t("admin.team.colEmail")}
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Select label={t("admin.team.colRole")} {...register("adminRole")}>
            <option value="SUPER_ADMIN">{t("admin.team.roleSuperAdmin")}</option>
            <option value="CONTENT_ADMIN">{t("admin.team.roleContentAdmin")}</option>
            <option value="FINANCE_ADMIN">{t("admin.team.roleFinanceAdmin")}</option>
          </Select>
          <Button type="submit" isLoading={addMember.isPending}>
            {t("admin.team.addMember")}
          </Button>
        </form>
      </section>
    </div>
  );
}
