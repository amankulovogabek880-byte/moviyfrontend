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

// Shared by both the admin (PATCH admin/me/change-password) and hamkor
// (PATCH b2b/me/change-password) profile pages — see
// hooks/admin/useMe.ts / hooks/b2b/useMe.ts and app/admin/profile,
// app/b2b/profile.
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Joriy parolni kiriting"),
  newPassword: z.string().min(8, "Kamida 8 belgi"),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;