import { LoginForm } from "@/components/shared/LoginForm";
import { t } from "@/lib/i18n";

export default function B2BLoginPage() {
  return <LoginForm role="b2b" title={t("auth.loginTitleB2b")} redirectTo="/b2b" />;
}
