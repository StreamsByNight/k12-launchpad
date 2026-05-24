import { Library, Gamepad2, ChevronRight } from "lucide-react";

const links = [
  {
    label: "K12 Library",
    description: "Books, eBooks & digital resources",
    icon: Library,
    color: "bg-primary",
    url: "https://k12.com/library",
  },
  {
    label: "K12 Zone",
    description: "Games, activities & enrichment",
    icon: Gamepad2,
    color: "bg-emerald-500",
    url: "https://zone.k12.com",
  },
];

export default function QuickLinksCard() {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card flex flex-col gap-3 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</p>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <button
            key={link.label}
            onClick={() => window.open(link.url, "_blank")}
            className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary-pale transition-all group text-left"
          >
            <div className={`w-9 h-9 rounded-md ${link.color} flex items-center justify-center shrink-0`}>
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
              <p className="text-xs text-muted-foreground truncate">{link.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
