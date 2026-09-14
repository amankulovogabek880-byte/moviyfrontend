"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerUserFormSchema, type PartnerUserFormValues } from "@/lib/schemas/partner";
import { useB2BTeam, useAddB2BTeamMember } from "@/hooks/b2b/useTeam";
import { useB2BMe } from "@/hooks/b2b/useMe";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Input } from "@/components/shared/Input";
import { Skeleton } from "@/components/shared/Skeleton";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function B2BTeamPage() {
  const { data: me, isLoading: meLoading } = useB2BMe();
  const { data, isLoading, isError, error, refetch } = useB2BTeam();
  const addMember = useAddB2BTeamMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerUserFormValues>({
    resolver: zodResolver(partnerUserFormSchema),
    defaultValues: { fullName: "", email: "", role: "AGENT" },
  });

  async function onSubmit(values: PartnerUserFormValues) {
    await addMember.mutateAsync(values);
    reset({ fullName: "", email: "", role: "AGENT" });
  }

  if (meLoading) return <Skeleton className="h-64 w-full rounded-xl2" />;
  if (me && me.partnerUserRole !== "OWNER") {
    return <ErrorMessage message={t("admin.team.accessDenied")} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("b2b.team.title")}</h1>

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
                <th className="px-3 py-2">{t("b2b.team.colName")}</th>
                <th className="px-3 py-2">{t("b2b.team.colEmail")}</th>
                <th className="px-3 py-2">{t("b2b.team.colRole")}</th>
                <th className="px-3 py-2">{t("b2b.team.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-3 py-2">{user.fullName}</td>
                  <td className="px-3 py-2 text-muted">{user.email}</td>
                  <td className="px-3 py-2">
                    {user.role === "OWNER" ? t("b2b.team.roleOwner") : t("b2b.team.roleAgent")}
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone={user.isActive ? "success" : "danger"}>
                      {user.isActive ? t("admin.partners.active") : t("admin.partners.suspended")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="rounded-xl2 border border-border p-5">
        <h2 className="mb-4 font-semibold">{t("b2b.team.addMember")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
          <Input
            label={t("b2b.team.colName")}
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Input
            label={t("b2b.team.colEmail")}
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" isLoading={addMember.isPending}>
            {t("b2b.team.addMember")}
          </Button>
        </form>
      </section>
    </div>
  );
}
