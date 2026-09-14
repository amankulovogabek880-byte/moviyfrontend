import type { PartnerUserRole } from "./partner";

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

export type AdminRole = "SUPER_ADMIN" | "CONTENT_ADMIN" | "FINANCE_ADMIN";

export interface AdminMe {
  email: string;
  fullName?: string;
  adminRole: AdminRole;
}

export interface AdminTeamMember {
  id: string;
  fullName: string;
  email: string;
  adminRole: AdminRole;
  isActive: boolean;
}

export interface AdminTeamMemberFormInput {
  fullName: string;
  email: string;
  adminRole: AdminRole;
}

export interface B2BMe {
  email: string;
  fullName?: string;
  companyName: string;
  partnerId: string;
  partnerUserRole: PartnerUserRole;
}
