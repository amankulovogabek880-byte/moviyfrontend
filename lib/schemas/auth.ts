import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email formati noto'g'ri"),
  password: z.string().min(1, "Parol talab qilinadi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const adminTeamMemberFormSchema = z.object({
  fullName: z.string().min(2, "Talab qilinadi"),
  email: z.string().email("Email formati noto'g'ri"),
  adminRole: z.enum(["SUPER_ADMIN", "CONTENT_ADMIN", "FINANCE_ADMIN"]),
});

export type AdminTeamMemberFormValues = z.infer<typeof adminTeamMemberFormSchema>;
