import { Badge } from "./Badge";
import { t } from "@/lib/i18n";
import type { BookingStatus } from "@/types/booking";

const toneMap: Record<BookingStatus, "success" | "warning" | "danger" | "neutral"> = {
  PENDING_PAYMENT: "warning",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  EXPIRED: "danger",
  CANCELLED: "neutral",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={toneMap[status]}>{t(`bookingStatus.${status}`)}</Badge>;
}
