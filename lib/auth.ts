export const SESSION_COOKIE = "session";
export const REFRESH_COOKIE = "mv_refresh";
export const ROLE_COOKIE = "role";

export type UserRole = "b2b" | "admin";

/**
 * There is a single unified login page now — admin and hamkor (partner)
 * both authenticate at /login, and the backend's `role` in the response
 * decides where they land afterwards (see components/shared/LoginForm.tsx
 * and app/api/auth/login/route.ts). This helper exists so any remaining
 * code that needs "the login page" doesn't hardcode the path.
 */
export function loginPath(): string {
  return "/login";
}

export function homePathForRole(role: UserRole): string {
  return role === "admin" ? "/admin" : "/b2b";
}