import { cn } from "@/lib/utils";

/**
 * A same-origin GET link into /api/proxy/<path> (see app/api/proxy/[...path]/route.ts),
 * styled like Button. Browser navigation to a same-origin URL automatically carries the
 * httpOnly session cookie, so this needs no client-side auth handling — the proxy route
 * reads the cookie, forwards it to the backend, and streams the binary response back.
 */
export function DownloadLink({
  path,
  children,
  variant = "outline",
  className,
}: {
  path: string;
  children: React.ReactNode;
  variant?: "outline" | "primary";
  className?: string;
}) {
  return (
    <a
      href={`/api/proxy/${path}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-accent text-accent-foreground hover:opacity-90"
          : "border border-border bg-transparent hover:bg-surface",
        className
      )}
    >
      {children}
    </a>
  );
}
