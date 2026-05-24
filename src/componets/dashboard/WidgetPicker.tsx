import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { WIDGET_DEFS, type WidgetId } from "@/hooks/useWidgets";

interface Props {
  activeWidgets: WidgetId[];
  onToggle: (id: WidgetId) => void;
}

export default function WidgetPicker({ activeWidgets, onToggle }: Props) {
  const activeCount = activeWidgets.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground gap-1.5 hover:text-foreground"
        >
          <Settings2 className="w-3 h-3" />
          <span className="hidden sm:inline">Customize</span>
          {activeCount > 0 && (
            <span className="hidden sm:inline text-xs text-muted-foreground/60">
              · {activeCount} active
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-base">Customize Dashboard</SheetTitle>
          <SheetDescription className="text-sm">
            Toggle widgets on or off. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-2">
          {WIDGET_DEFS.map(({ id, label, desc, icon: Icon }) => {
            const active = activeWidgets.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggle(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  active
                    ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                    : "border-border bg-card hover:bg-accent/40"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
                </div>
                <Switch
                  checked={active}
                  onCheckedChange={() => onToggle(id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 pb-2">
          {activeCount} of {WIDGET_DEFS.length} widgets enabled
        </p>
      </SheetContent>
    </Sheet>
  );
}
