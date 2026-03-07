import { useAlerts } from "@/hooks/use-alerts";
import { AlertTriangle, AlertOctagon, Info, Clock } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@shared/schema";

interface AlertsFeedProps {
  maxItems?: number;
  className?: string;
}

export function AlertsFeed({ maxItems = 10, className }: AlertsFeedProps) {
  const { data: alerts, isLoading } = useAlerts();

  const recentAlerts = alerts?.filter((a) => !a.acknowledged).slice(0, maxItems) || [];

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted/10 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (recentAlerts.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-muted-foreground text-sm", className)}>
        <Info className="w-8 h-8 mb-2 opacity-50" />
        No active alerts
      </div>
    );
  }

  return (
    <ScrollArea className={cn("pr-3", className)}>
      <div className="space-y-2">
        {recentAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:translate-x-1",
              alert.severity === "critical"
                ? "bg-rose-950/20 border-rose-900/30"
                : alert.severity === "warning"
                ? "bg-amber-950/20 border-amber-900/30"
                : "bg-blue-950/20 border-blue-900/30"
            )}
          >
            <SeverityIcon severity={alert.severity} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.machineName}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {format(new Date(alert.timestamp), "HH:mm")}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === "critical") return <AlertOctagon className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />;
  if (severity === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />;
  return <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />;
}
