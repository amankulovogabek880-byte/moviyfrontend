export type NotificationChannel = "SMS" | "EMAIL";
export type NotificationStatus = "SUCCESS" | "FAILED";

export interface NotificationLogEntry {
  id: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  message?: string;
  sentAt: string;
}
