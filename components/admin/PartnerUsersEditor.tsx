"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { partnerUserFormSchema, type PartnerUserFormValues } from "@/lib/schemas/partner";
import {
  useAddPartnerUser,
  useSetPartnerUserActive,
  useDeletePartnerUser,
} from "@/hooks/admin/usePartners";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { t } from "@/lib/i18n";
import type { PartnerUser } from "@/types/partner";

export function PartnerUsersEditor({
  partnerId,
  users,
}: {
  partnerId: string;
  users: PartnerUser[];
}) {
  const addUser = useAddPartnerUser(partnerId);
  const setUserActive = useSetPartnerUserActive(partnerId);
  const deleteUser = useDeletePartnerUser(partnerId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerUserFormValues>({
    resolver: zodResolver(partnerUserFormSchema),
    defaultValues: { fullName: "", email: "", password: "", role: "AGENT" },
  });

  async function onSubmit(values: PartnerUserFormValues) {
    await addUser.mutateAsync(values);
    reset({ fullName: "", email: "", password: "", role: "AGENT" });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.partnerForm.employees")}</h2>
      <div className="mb-4 flex flex-col gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{user.fullName}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={user.role === "OWNER" ? "accent" : "neutral"}>
                {user.role === "OWNER"
                  ? t("admin.partnerForm.roleOwner")
                  : t("admin.partnerForm.roleAgent")}
              </Badge>
              <Badge tone={user.isActive ? "success" : "danger"}>
                {user.isActive ? t("admin.partners.active") : t("admin.partners.suspended")}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                isLoading={setUserActive.isPending}
                onClick={() =>
                  setUserActive.mutate({ userId: user.id, isActive: !user.isActive })
                }
              >
                {user.isActive ? t("admin.partnerForm.block") : t("admin.partnerForm.unblock")}
              </Button>
              <button
                type="button"
                onClick={() => deleteUser.mutate(user.id)}
                className="rounded p-1.5 text-danger hover:bg-danger/10"
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-muted">{t("common.noResults")}</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <Input
          label={t("admin.partnerForm.employeesAddName")}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label={t("admin.partnerForm.employeesAddEmail")}
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label={t("admin.partnerForm.employeesAddPassword")}
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Select label={t("admin.partnerForm.employeesAddRole")} {...register("role")}>
          <option value="OWNER">{t("admin.partnerForm.roleOwner")}</option>
          <option value="AGENT">{t("admin.partnerForm.roleAgent")}</option>
        </Select>
        <Button type="submit" isLoading={addUser.isPending}>
          {t("admin.partnerForm.employeesAdd")}
        </Button>
      </form>
    </section>
  );
}