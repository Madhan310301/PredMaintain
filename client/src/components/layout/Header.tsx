import { useLocation } from "wouter";
import { useToggleSimulation, useSimulationStatus } from "@/hooks/use-machines";
import { useAlerts } from "@/hooks/use-alerts";
import { useFleetSummary } from "@/hooks/use-reports";
import { Play, Pause, Activity, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: simStatus } = useSimulationStatus();
  const { mutate: toggleSim, isPending: toggling } = useToggleSimulation();
  const { data: alerts } = useAlerts();
  const { data: fleet } = useFleetSummary();
  const [location] = useLocation();

  const isSimRunning = simStatus?.running ?? true;
  const activeAlertCount = alerts?.filter((a) => !a.acknowledged).length || 0;

  const handleToggleSim = () => {
    toggleSim(!isSimRunning);
  };

  const getTitle = () => {
    if (location === "/" || location === "/dashboard") return "Fleet Operations Command Center";
    if (location.startsWith("/machines/")) return "Asset Condition Telemetry";
    if (location.startsWith("/machines")) return "Asset Inventory";
    if (location.startsWith("/analytics")) return "Reliability & Trend Analytics";
    if (location.startsWith("/maintenance")) return "Maintenance & Work Orders (CMMS)";
    if (location.startsWith("/alerts")) return "Condition Alerts";
    if (location.startsWith("/reports")) return "Operations Fleet Report";
    if (location.startsWith("/models")) return "ML Model Validation & Diagnostics";
    return "Plant Reliability System";
  };

  return (
    <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {getTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Fleet Health Indicator */}
        {fleet && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border/60">
            <div className={cn("w-2 h-2 rounded-full",
              fleet.averageHealthScore >= 70 ? "bg-emerald-500" :
              fleet.averageHealthScore >= 40 ? "bg-amber-500" : "bg-rose-500"
            )} />
            <span className="text-xs font-medium text-muted-foreground">
              Fleet Index: <span className="font-mono text-foreground font-semibold">{fleet.averageHealthScore}%</span>
            </span>
          </div>
        )}

        {/* Live Channel Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border/60">
          <Activity className={cn("w-3.5 h-3.5", isSimRunning ? "text-emerald-500 animate-pulse" : "text-amber-500")} />
          <span className="text-xs font-medium text-muted-foreground">
            {isSimRunning ? "Stream: Active" : "Stream: Paused"}
          </span>
        </div>

        {/* Alerts Bell */}
        <Link href="/alerts">
          <Button variant="ghost" size="icon" className="relative rounded-lg h-9 w-9 border border-border/40">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-4 flex items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-bold">
                {activeAlertCount > 99 ? "99+" : activeAlertCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Live Telemetry Ingestion Toggle */}
        <Button 
          size="sm" 
          variant={isSimRunning ? "outline" : "default"}
          onClick={handleToggleSim}
          disabled={toggling}
          className="gap-2 text-xs font-medium h-9"
        >
          {isSimRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause Telemetry
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" /> Resume Telemetry
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
