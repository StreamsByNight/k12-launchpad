import { Calendar, Clock, ExternalLink, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CanvasEvent } from "@/hooks/useCanvas";

interface Props {
  events: CanvasEvent[];
  isLoading: boolean;
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${dateLabel} · ${timeStr}`;
}

function isLiveNow(start?: string, end?: string) {
  if (!start) return false;
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : s + 60 * 60 * 1000;
  return now >= s && now <= e;
}

export default function LiveSessionsWidget({ events, isLoading }: Props) {
  // Show events that have a web conference join URL or look like live sessions
  const liveSessions = events.filter(
    (e) => e.web_conference?.join_url || e.type === "web_conference"
  );
  // Fallback: show all events if no conference-specific ones found
  const displayed = liveSessions.length > 0 ? liveSessions : events.slice(0, 5);

  return (
    <div className="bg-card rounded-lg border border-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-violet-500 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-foreground">Live Sessions</span>
        </div>
        <span className="text-xs text-muted-foreground">{displayed.length} upcoming</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>
          ))
        ) : displayed.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No upcoming live sessions</p>
          </div>
        ) : (
          displayed.map((event) => {
            const dateTime = formatDateTime(event.start_at);
            const joinUrl = event.web_conference?.join_url || event.html_url;
            const live = isLiveNow(event.start_at, event.end_at);

            return (
              <div
                key={event.id}
                className={`px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                  live ? "bg-violet-500/5" : "hover:bg-accent/40"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {live && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE
                      </span>
                    )}
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {event.context_name && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {event.context_name}
                      </span>
                    )}
                    {dateTime && (
                      <>
                        {event.context_name && <span className="text-xs text-muted-foreground/40">·</span>}
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {dateTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {joinUrl && (
                  <Button
                    size="sm"
                    className={`h-7 px-3 text-xs shrink-0 ${
                      live
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-violet-500 hover:bg-violet-600 text-white"
                    }`}
                    onClick={() => window.open(joinUrl, "_blank")}
                  >
                    {live ? "Join Now" : "Join"}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
