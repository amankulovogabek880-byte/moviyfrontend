import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface CountdownParts {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export function getCountdown(expiresAt: string | null | undefined): CountdownParts {
  if (!expiresAt) return { totalMs: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalMs = new Date(expiresAt).getTime() - Date.now();
  if (totalMs <= 0) return { totalMs: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  return { totalMs, hours, minutes, seconds, expired: false };
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function remainingBalance(booking: { totalAmount: number; paidAmount: number }): number {
  return Math.max(0, booking.totalAmount - booking.paidAmount);
}
