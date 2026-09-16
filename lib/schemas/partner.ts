import { z } from "zod";

export const partnerFormSchema = z.object({
  companyName: z.string().min(2, "Talab qilinadi"),
  contactPerson: z.string().min(2, "Talab qilinadi"),
  email: z.string().email("Email formati noto'g'ri"),
  phone: z.string().optional(),
  discountPercent: z.number().min(0).max(100),
  // Only required when creating a new partner — see createPartnerFormSchema
  // below and components/admin/PartnerForm.tsx, which picks the right
  // schema based on `isNew` and only renders this field for new partners.
  // The backend now expects the admin to set the partner's initial
  // password directly rather than auto-generating and emailing one.
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak").optional(),
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

export const createPartnerFormSchema = partnerFormSchema.extend({
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
});

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

// Also used by app/b2b/team/page.tsx, where an OWNER adds their own AGENT
// sub-accounts — the backend expects an initial password from that form
// too, not just from the admin-side PartnerUsersEditor.
export const partnerUserFormSchema = z.object({
  fullName: z.string().min(2, "Talab qilinadi"),
  email: z.string().email("Email formati noto'g'ri"),
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
  role: z.enum(["OWNER", "AGENT"]),
});

export type PartnerUserFormValues = z.infer<typeof partnerUserFormSchema>;