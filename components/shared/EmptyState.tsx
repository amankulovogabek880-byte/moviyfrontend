import { Inbox } from "lucide-react";

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-border py-16 text-center text-muted">
      {icon ?? <Inbox className="h-8 w-8" />}
      <p>{message}</p>
    </div>
  );
}
