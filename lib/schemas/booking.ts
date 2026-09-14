import { z } from "zod";

export const bookingContactSchema = z.object({
  fullName: z.string().min(3, "F.I.Sh. kamida 3 belgidan iborat bo'lishi kerak"),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami formati noto'g'ri"),
  email: z.string().email("Email formati noto'g'ri"),
  paxCount: z.number().min(1, "Kamida 1 kishi bo'lishi kerak").max(50),
  addOnIds: z.array(z.string()).optional(),
});

export type BookingContactFormValues = z.infer<typeof bookingContactSchema>;

export const travelerBookingSchema = z
  .object({
    fullName: z.string().min(3, "F.I.Sh. kamida 3 belgidan iborat bo'lishi kerak"),
    phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami formati noto'g'ri"),
    email: z.string().email("Email formati noto'g'ri"),
    adultCount: z.number().min(1, "Kamida 1 kattalar bo'lishi kerak").max(50),
    childCount: z.number().min(0, "Manfiy bo'lishi mumkin emas").max(50),
    childAges: z.array(z.number().min(0).max(17)),
    roomTypeId: z.string().optional(),
    addOnIds: z.array(z.string()).optional(),
  })
  .refine((values) => values.childAges.length === values.childCount, {
    message: "Har bir bola uchun yoshini kiriting",
    path: ["childAges"],
  });

export type TravelerBookingFormValues = z.infer<typeof travelerBookingSchema>;

export const cancelBookingSchema = z.object({
  refundAmount: z.number().min(0, "Manfiy bo'lishi mumkin emas"),
  note: z.string().optional(),
});

export type CancelBookingFormValues = z.infer<typeof cancelBookingSchema>;

export const reviewFormSchema = z.object({
  rating: z.number().min(1, "Bahoni tanlang").max(5),
  comment: z.string().min(5, "Kamida 5 belgi"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
