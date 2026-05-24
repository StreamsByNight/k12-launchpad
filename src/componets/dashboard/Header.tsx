import { useState } from "react";
import { LogOut, User, Calendar, BookOpen, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearSession } from "@/hooks/useCanvas";
import type { CanvasUser } from "@/hooks/useCanvas";

type Tab = "schedule" | "classes" | "announcements";

interface Props {
  user: CanvasUser | null | undefined;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

function getFirstName(user: CanvasUser | null | undefined) {
  if (!user) return "Student";
  const name = user.display_name || user.short_name || user.name;
  return name.split(" ")[0];
}

function getInitials(user: CanvasUser | null | undefined) {
  if (!user) return "S";
  const name = user.display_name || user.name;
  return name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "schedule", label: "My Schedule", icon: Calendar },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "announcements", label: "Announcements", icon: Bell },
];

export default function Header({ user, activeTab, onTabChange, onLogout }: Props) {
  const [time] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  });
  const dayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  function handleLogout() {
    clearSession();
    onLogout();
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">K12 Launchpad</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-right">
            <div>
              <p className="text-xs font-semibold text-foreground">{time}</p>
              <p className="text-xs text-muted-foreground">{dayStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-foreground leading-none">{user?.name || "Student"}</p>
              {user?.primary_email && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[140px]">{user.primary_email}</p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{getFirstName(user)}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{dayStr}</p>
      </div>

      {/* Nav tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
