import { z } from "zod";

export const itineraryDaySchema = z.object({
  day: z.number().min(1),
  title: z.string().min(1, "Talab qilinadi"),
  description: z.string().min(1, "Talab qilinadi"),
});

export const tourFormSchema = z.object({
  title: z.string().min(3, "Kamida 3 belgi"),
  slug: z
    .string()
    .min(3, "Kamida 3 belgi")
    .regex(/^[a-z0-9-]+$/, "Faqat kichik harflar, raqamlar va chiziqcha"),
  categoryId: z.string().optional(),
  destination: z.string().min(2, "Talab qilinadi"),
  country: z.string().min(2, "Talab qilinadi"),
  city: z.string().min(2, "Talab qilinadi"),
  description: z.string().min(10, "Talab qilinadi"),
  durationDays: z.number().min(1, "Kamida 1 kun"),
  basePrice: z.number().min(1, "Narx 0 dan katta bo'lishi kerak"),
  commissionAmount: z.number().min(0, "0 dan kichik bo'lishi mumkin emas"),
  currency: z.string().optional(),
  active: z.boolean().optional(),
  itinerary: z.array(itineraryDaySchema),
});

export type TourFormValues = z.infer<typeof tourFormSchema>;

export const departureFormSchema = z.object({
  departureDate: z.string().min(1, "Jo'nash sanasi talab qilinadi"),
  returnDate: z.string().min(1, "Qaytish sanasi talab qilinadi"),
  totalSeats: z.number().min(1, "Kamida 1 joy"),
  basePriceOverride: z.number().min(0).optional(),
  commissionOverride: z.number().min(0).optional(),
});

export type DepartureFormValues = z.infer<typeof departureFormSchema>;

export const departurePriceUpdateSchema = z.object({
  price: z.number().min(0, "Narx manfiy bo'lishi mumkin emas").optional(),
});

export type DeparturePriceUpdateValues = z.infer<typeof departurePriceUpdateSchema>;

export const priceTierFormSchema = z.object({
  type: z.enum(["ADULT", "CHILD"]),
  label: z.string().min(1, "Talab qilinadi"),
  percentOfBase: z.number().min(0, "0 dan katta bo'lishi kerak").max(500),
  ageFrom: z.number().min(0).optional(),
  ageTo: z.number().min(0).optional(),
});

export type PriceTierFormValues = z.infer<typeof priceTierFormSchema>;

export const roomTypeFormSchema = z.object({
  name: z.string().min(1, "Talab qilinadi"),
  extraAmount: z.number().min(0, "0 dan katta bo'lishi kerak"),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeFormSchema>;

export const addOnFormSchema = z.object({
  name: z.string().min(1, "Talab qilinadi"),
  price: z.number().min(0, "0 dan katta bo'lishi kerak"),
});

export type AddOnFormValues = z.infer<typeof addOnFormSchema>;