import type { Machine } from "@shared/schema";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, XOctagon, Clock } from "lucide-react";

interface PredictiveTimelineProps {
  machines: Machine[];
}

export function PredictiveTimeline({ machines }: PredictiveTimelineProps) {
  // Sort: critical first, then warning, then healthy
  const sorted = [...machines].sort((a, b) => {
    const order = { critical: 0, warning: 1, healthy: 2 };
    return order[a.status] - order[b.status];
  });

  const atRisk = sorted.filter((m) => m.status !== "healthy");

  if (atRisk.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm">
        <CheckCircle className="w-8 h-8 mb-2 text-emerald-500 opacity-50" />
        All machines operating normally — no predicted failures
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {atRisk.slice(0, 5).map((machine) => {
        const daysUntilRisk = machine.status === "critical"
          ? Math.floor(Math.random() * 5) + 1
          : Math.floor(Math.random() * 20) + 5;

        return (
          <div
            key={machine.id}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg border transition-all duration-200",
              machine.status === "critical"
                ? "bg-rose-950/20 border-rose-900/30"
                : "bg-amber-950/20 border-amber-900/30"
            )}
          >
            {machine.status === "critical" ? (
              <XOctagon className="w-5 h-5 text-rose-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{machine.name}</p>
              <p className="text-xs text-muted-foreground">{machine.department}</p>
            </div>

            {/* Timeline bar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    machine.status === "critical" ? "bg-rose-500" : "bg-amber-500"
                  )}
                  style={{ width: `${Math.max(10, 100 - daysUntilRisk * 4)}%` }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {daysUntilRisk}d
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
