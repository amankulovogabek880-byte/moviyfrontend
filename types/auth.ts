export type UserRole = "b2b" | "admin";

export interface LoginInput {
  email: string;
  password: string;
}

export interface Session {
  role: UserRole;
  email: string;
  partnerId?: string;
  companyName?: string;
}
