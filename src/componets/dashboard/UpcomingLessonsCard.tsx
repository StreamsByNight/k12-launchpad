import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CanvasTodoItem } from "@/hooks/useCanvas";

interface Props {
  items: CanvasTodoItem[];
  isLoading: boolean;
}

function formatDue(dateStr?: string) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Past due";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDueColor(dateStr?: string) {
  if (!dateStr) return "text-muted-foreground";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "text-destructive";
  if (diffDays <= 1) return "text-orange-500";
  if (diffDays <= 3) return "text-yellow-500";
  return "text-muted-foreground";
}

export default function UpcomingLessonsCard({ items, isLoading }: Props) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-tile-blue-light flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm text-foreground">Upcoming Lessons</span>
        </div>
        <span className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-1.5">
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          items.map((item, i) => {
            const assignment = item.assignment;
            if (!assignment) return null;
            const url = assignment.html_url;
            const dueLabel = formatDue(assignment.due_at);
            const dueColor = getDueColor(assignment.due_at);

            return (
              <div
                key={assignment.id ?? i}
                className="px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer group"
                onClick={() => url && window.open(url, "_blank")}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground leading-snug flex-1 group-hover:text-primary transition-colors">
                    {assignment.name}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {item.context_name && (
                    <span className="text-xs text-muted-foreground truncate">{item.context_name}</span>
                  )}
                  <span className="flex items-center gap-0.5 text-xs shrink-0">
                    <Calendar className={`w-3 h-3 ${dueColor}`} />
                    <span className={dueColor}>{dueLabel}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
