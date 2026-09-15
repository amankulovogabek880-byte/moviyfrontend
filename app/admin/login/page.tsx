import { redirect } from "next/navigation";

// Kept only so old bookmarks/links to /admin/login don't 404 — the real
// login form now lives at /login (see app/login/page.tsx). The backend's
// `role` in the login response decides whether someone ends up in /admin
// or /b2b, so there's no reason to keep separate login pages/logic here.
export default function AdminLoginRedirectPage() {
  redirect("/login");
}