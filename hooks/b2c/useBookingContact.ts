"use client";

import { useEffect, useState } from "react";
import { getStoredBookingContact, storeBookingContact } from "@/lib/booking-contact";

/**
 * Resolves the contact (email/phone) needed to look up a public booking.
 * Priority: an explicit `?contact=` query param, then whatever was stashed
 * in sessionStorage right after the booking was created (see
 * lib/booking-contact.ts). If neither is present, `contact` stays null and
 * the page should render BookingContactGate to ask for it — calling
 * `setContact` both updates state and persists it for next time.
 */
export function useBookingContact(bookingNumber: string, queryContact?: string | null) {
  const [contact, setContactState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!bookingNumber) {
      setHydrated(true);
      return;
    }
    if (queryContact) {
      storeBookingContact(bookingNumber, queryContact);
      setContactState(queryContact);
      setHydrated(true);
      return;
    }
    setContactState(getStoredBookingContact(bookingNumber));
    setHydrated(true);
  }, [bookingNumber, queryContact]);

  function setContact(value: string) {
    storeBookingContact(bookingNumber, value);
    setContactState(value);
  }

  return { contact, setContact, hydrated };
}