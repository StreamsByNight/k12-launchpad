import { LayoutDashboard, BookOpen, Calendar, Bell, Library, LogOut, GraduationCap, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearSession } from "@/hooks/useCanvas";
import { useTheme } from "@/hooks/useTheme";
import type { CanvasUser } from "@/hooks/useCanvas";

type Tab = "schedule" | "classes" | "announcements";

interface Props {
  user: CanvasUser | null | undefined;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { label: string; icon: React.ElementType; tab?: Tab }[] = [
  { label: "My Schedule", icon: LayoutDashboard, tab: "schedule" },
  { label: "Classes", icon: BookOpen, tab: "classes" },
  { label: "Announcements", icon: Bell, tab: "announcements" },
  { label: "Calendar", icon: Calendar },
  { label: "Resources", icon: Library },
];

function getInitials(user: CanvasUser | null | undefined) {
  if (!user) return "S";
  const name = user.display_name || user.name;
  return name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
}

export default function Sidebar({ user, activeTab, onTabChange, onLogout }: Props) {
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    clearSession();
    onLogout();
  }

  return (
    <aside className="flex flex-col h-full bg-sidebar w-16 lg:w-56 shrink-0 border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 lg:px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="hidden lg:block text-sm font-bold text-sidebar-primary-foreground tracking-tight leading-tight">
          K12 Launchpad
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, tab }) => {
          const isActive = tab && activeTab === tab;
          return (
            <button
              key={label}
              onClick={() => tab ? onTabChange(tab) : undefined}
              className={`w-full flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
              title={label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:block truncate">{label}</span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-2 lg:px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-all"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 shrink-0 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 shrink-0" />
          )}
          <span className="hidden lg:block text-sm font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* User + logout */}
        <div className="flex items-center gap-2.5">
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-foreground">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-primary-foreground truncate">
              {user?.name || "Student"}
            </p>
            {user?.primary_email && (
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.primary_email}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 p-1 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
