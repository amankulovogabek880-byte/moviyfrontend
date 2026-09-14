import { z } from "zod";

export const partnerFormSchema = z.object({
  companyName: z.string().min(2, "Talab qilinadi"),
  email: z.string().email("Email formati noto'g'ri"),
  phone: z.string().optional(),
  discountPercent: z.number().min(0).max(100),
  password: z.string().min(6, "Kamida 6 belgi").optional(),
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
