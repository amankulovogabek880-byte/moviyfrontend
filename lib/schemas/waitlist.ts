import { z } from "zod";

export const waitlistFormSchema = z.object({
  fullName: z.string().min(3, "F.I.Sh. kamida 3 belgidan iborat bo'lishi kerak"),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami formati noto'g'ri"),
  email: z.string().email("Email formati noto'g'ri"),
  paxCount: z.number().min(1, "Kamida 1 kishi bo'lishi kerak").max(50),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
