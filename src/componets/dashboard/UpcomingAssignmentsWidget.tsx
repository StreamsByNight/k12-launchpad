import { ClipboardList, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CanvasTodoItem } from "@/hooks/useCanvas";

interface Props {
  items: CanvasTodoItem[];
  isLoading: boolean;
}

function formatDue(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: "Overdue", urgent: true };
  if (diffDays === 0) return { label: "Due today", urgent: true };
  if (diffDays === 1) return { label: "Due tomorrow", urgent: true };
  if (diffDays <= 7) return { label: `Due in ${diffDays}d`, urgent: false };
  return {
    label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    urgent: false,
  };
}

export default function UpcomingAssignmentsWidget({ items, isLoading }: Props) {
  const assignments = items.filter((i) => i.assignment);

  return (
    <div className="bg-card rounded-lg border border-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
            <ClipboardList className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-foreground">Upcoming Assignments</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {assignments.length} pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))
        ) : assignments.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">No pending assignments</p>
          </div>
        ) : (
          assignments.map((item, i) => {
            const a = item.assignment!;
            const due = formatDue(a.due_at);
            return (
              <div
                key={a.id ?? i}
                className="px-4 py-3 flex items-start gap-3 hover:bg-accent/40 transition-colors group cursor-pointer"
                onClick={() => a.html_url && window.open(a.html_url, "_blank")}
              >
                <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-primary/40 shrink-0 mt-0.5 transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {a.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.context_name && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {item.context_name}
                      </span>
                    )}
                    {due && a.due_at && (
                      <>
                        {item.context_name && <span className="text-muted-foreground/40 text-xs">·</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span
                            className={`text-xs font-medium ${due.urgent ? "text-red-500" : "text-muted-foreground"}`}
                          >
                            {due.label}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {a.html_url && (
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/60 shrink-0 mt-0.5 transition-colors" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
