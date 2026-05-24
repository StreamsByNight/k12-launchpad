import { Bell, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CanvasAnnouncement } from "@/hooks/useCanvas";

interface Props {
  announcements: CanvasAnnouncement[];
  isLoading: boolean;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

export default function AnnouncementsCard({ announcements, isLoading }: Props) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-tile-yellow flex items-center justify-center">
            <Bell className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <span className="font-semibold text-sm text-foreground">Announcements</span>
        </div>
        {announcements.length > 0 && (
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-medium">
            {announcements.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))
        ) : announcements.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No announcements</p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => ann.html_url && window.open(ann.html_url, "_blank")}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground leading-snug flex-1 group-hover:text-primary transition-colors line-clamp-1">
                  {ann.title}
                </p>
                <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {ann.message && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {stripHtml(ann.message)}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                {ann.context_name && (
                  <span className="text-xs text-primary font-medium">{ann.context_name}</span>
                )}
                <span className="text-xs text-muted-foreground">{timeAgo(ann.posted_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
