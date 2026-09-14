import { LoginForm } from "@/components/shared/LoginForm";
import { t } from "@/lib/i18n";

export default function AdminLoginPage() {
  return <LoginForm role="admin" title={t("auth.loginTitleAdmin")} redirectTo="/admin" />;
}
