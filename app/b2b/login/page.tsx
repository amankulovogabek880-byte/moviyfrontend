import { redirect } from "next/navigation";

// Kept only so old bookmarks/links to /b2b/login don't 404 — the real
// login form now lives at /login (see app/login/page.tsx).
export default function B2BLoginRedirectPage() {
  redirect("/login");
}