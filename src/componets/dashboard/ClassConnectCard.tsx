import { Video, Clock, ExternalLink, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CanvasEvent } from "@/hooks/useCanvas";

interface Props {
  events: CanvasEvent[];
  isLoading: boolean;
}

function formatTime(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function isLiveNow(start?: string, end?: string) {
  if (!start) return false;
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : s + 60 * 60 * 1000;
  return now >= s && now <= e;
}

export default function ClassConnectCard({ events, isLoading }: Props) {
  const displayed = events.slice(0, 6);

  return (
    <div className="bg-card rounded-lg border border-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Video className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">Class Connect</span>
        </div>
        <span className="text-xs text-muted-foreground">{displayed.length} session{displayed.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>
          ))
        ) : displayed.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No upcoming live sessions</p>
          </div>
        ) : (
          displayed.map((event) => {
            const start = formatTime(event.start_at);
            const end = formatTime(event.end_at);
            const timeStr = start ? (end ? `${start} – ${end}` : start) : null;
            const joinUrl = event.web_conference?.join_url || event.html_url;
            const live = isLiveNow(event.start_at, event.end_at);

            return (
              <div
                key={event.id}
                className={`px-4 py-3 flex items-center justify-between gap-3 transition-colors ${live ? "bg-primary/5" : "hover:bg-accent/50"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {live && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                        <Radio className="w-3 h-3 animate-pulse-dot" />
                        LIVE
                      </span>
                    )}
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    {event.context_name && (
                      <span className="text-xs text-muted-foreground">{event.context_name}</span>
                    )}
                    {timeStr && (
                      <>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {timeStr}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {joinUrl && (
                  <Button
                    size="sm"
                    className={`h-7 px-3 text-xs shrink-0 shadow-blue ${live ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
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
