/**
 * The public `GET /public/bookings/:bookingNumber` endpoint requires a
 * `contact` query param (the email or phone used on the booking) — the
 * booking number alone isn't enough to look someone up. Right after a
 * booking is created we know the contact, so we stash it in sessionStorage
 * keyed by booking number and read it back on the status/success/review
 * pages. If it's missing (fresh tab, cleared storage, a link shared from
 * elsewhere) the pages fall back to asking for it — see
 * components/b2c/BookingContactGate.tsx.
 */
const STORAGE_PREFIX = "mv_booking_contact:";

export function storeBookingContact(bookingNumber: string, contact: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + bookingNumber, contact);
  } catch {
    // sessionStorage can throw in private-browsing/edge cases — non-fatal,
    // the contact gate will just ask the person to type it in again.
  }
}

export function getStoredBookingContact(bookingNumber: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_PREFIX + bookingNumber);
  } catch {
    return null;
  }
}