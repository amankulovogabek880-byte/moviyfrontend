import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email formati noto'g'ri"),
  password: z.string().min(1, "Parol talab qilinadi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
