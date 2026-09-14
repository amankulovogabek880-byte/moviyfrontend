export const SESSION_COOKIE = "session";
export const ROLE_COOKIE = "role";

export type UserRole = "b2b" | "admin";

export function loginPathForRole(role: UserRole): string {
  return role === "admin" ? "/admin/login" : "/b2b/login";
}

export function homePathForRole(role: UserRole): string {
  return role === "admin" ? "/admin" : "/b2b";
}
