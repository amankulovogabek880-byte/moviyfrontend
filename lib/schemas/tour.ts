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
  destination: z.string().min(2, "Talab qilinadi"),
  shortDescription: z.string().min(5, "Talab qilinadi"),
  description: z.string().min(10, "Talab qilinadi"),
  durationDays: z.number().min(1, "Kamida 1 kun"),
  basePrice: z.number().min(1, "Narx 0 dan katta bo'lishi kerak"),
  commissionPercent: z.number().min(0).max(100),
  itinerary: z.array(itineraryDaySchema),
});

export type TourFormValues = z.infer<typeof tourFormSchema>;

export const departureFormSchema = z.object({
  date: z.string().min(1, "Sana talab qilinadi"),
  totalSeats: z.number().min(1, "Kamida 1 joy"),
});

export type DepartureFormValues = z.infer<typeof departureFormSchema>;
