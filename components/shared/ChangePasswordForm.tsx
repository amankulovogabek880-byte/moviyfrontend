"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/schemas/auth";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";

/**
 * Shared by app/admin/profile and app/b2b/profile — the backend exposes a
 * parallel `PATCH .../me/change-password` route on both surfaces (see
 * hooks/admin/useMe.ts's useChangeAdminPassword and hooks/b2b/useMe.ts's
 * useChangeB2BPassword), so the form itself only needs the section title
 * and the mutation to call.
 */
export function ChangePasswordForm({
  title,
  isSubmitting,
  onSubmit,
}: {
  title: string;
  isSubmitting: boolean;
  onSubmit: (values: ChangePasswordFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  async function handleFormSubmit(values: ChangePasswordFormValues) {
    await onSubmit(values);
    reset({ currentPassword: "", newPassword: "" });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex max-w-sm flex-col gap-4"
      >
        <Input
          label={t("common.currentPassword")}
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <Input
          label={t("common.newPassword")}
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Button type="submit" isLoading={isSubmitting} className="self-start">
          {t("common.changePassword")}
        </Button>
      </form>
    </section>
  );
}