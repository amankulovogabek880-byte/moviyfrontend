"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";
import { useLogin } from "@/hooks/useAuth";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { homePathForRole } from "@/lib/auth";

/**
 * Single, unified login form for both admin and hamkor (partner) accounts.
 * There is no role picker — the backend tells us who the person is via
 * `role` in the login response, and we redirect to the right panel from
 * there (see hooks/useAuth.ts and app/api/auth/login/route.ts).
 */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      const result = await login.mutateAsync(values);
      router.push(homePathForRole(result.role));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.invalidCredentials"));
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold">{t("auth.loginTitle")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        {error && <p className="text-sm text-danger">{error}</p>}
        <Input
          label={t("auth.emailLabel")}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label={t("auth.passwordLabel")}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" isLoading={login.isPending} size="lg">
          {login.isPending ? t("auth.loggingIn") : t("auth.submit")}
        </Button>
      </form>
    </div>
  );
}