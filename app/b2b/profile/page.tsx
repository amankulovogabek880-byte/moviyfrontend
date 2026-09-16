"use client";

import { useState } from "react";
import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";
import { useChangeB2BPassword } from "@/hooks/b2b/useMe";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { ChangePasswordFormValues } from "@/lib/schemas/auth";

export default function B2BProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const changePassword = useChangeB2BPassword();

  async function handleSubmit(values: ChangePasswordFormValues) {
    setError(null);
    setSaved(false);
    try {
      await changePassword.mutateAsync(values);
      setSaved(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t("b2b.profile.title")}</h1>
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-success">{t("common.passwordChanged")}</p>}
      <ChangePasswordForm
        title={t("b2b.profile.changePasswordTitle")}
        isSubmitting={changePassword.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}