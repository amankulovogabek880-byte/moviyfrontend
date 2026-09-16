import { z } from "zod";

export const partnerFormSchema = z.object({
  companyName: z.string().min(2, "Talab qilinadi"),
  contactPerson: z.string().min(2, "Talab qilinadi"),
  email: z.string().email("Email formati noto'g'ri"),
  phone: z.string().optional(),
  discountPercent: z.number().min(0).max(100),
  // `password` olib tashlandi — backend parolni o'zi yaratib, emailga yuboradi
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

export const partnerTourDiscountFormSchema = z.object({
  tourId: z.string().min(1, "Turni tanlang"),
  discountPercent: z.number().min(0).max(100),
});

export type PartnerTourDiscountFormValues = z.infer<typeof partnerTourDiscountFormSchema>;

export const partnerPaymentTermsSchema = z.object({
  paymentType: z.enum(["PREPAID", "POSTPAID"]),
  creditLimit: z.number().min(0, "0 dan katta bo'lishi kerak").optional(),
});

export type PartnerPaymentTermsValues = z.infer<typeof partnerPaymentTermsSchema>;

export const partnerUserFormSchema = z.object({
  fullName: z.string().min(2, "Talab qilinadi"),
  email: z.string().email("Email formati noto'g'ri"),
  role: z.enum(["OWNER", "AGENT"]),
});

export type PartnerUserFormValues = z.infer<typeof partnerUserFormSchema>;