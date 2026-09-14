import { z } from "zod";

export const markPaidSchema = z.object({
  amount: z.number().min(1, "Summa 0 dan katta bo'lishi kerak"),
  note: z.string().optional(),
});

export type MarkPaidFormValues = z.infer<typeof markPaidSchema>;
