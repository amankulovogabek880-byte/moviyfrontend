import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { t } from "@/lib/i18n";

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-danger/30 bg-danger/5 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-danger" />
      <p className="text-sm text-danger">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
