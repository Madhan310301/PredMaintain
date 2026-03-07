import { useState } from "react";
import { useLocation } from "wouter";
import { useToggleSimulation } from "@/hooks/use-machines";
import { useAlerts } from "@/hooks/use-alerts";
import { useFleetSummary } from "@/hooks/use-reports";
import { Play, Pause, Activity, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [isSimRunning, setIsSimRunning] = useState(false);
  const { mutate: toggleSim } = useToggleSimulation();
  const { data: alerts } = useAlerts();
  const { data: fleet } = useFleetSummary();
  const [location] = useLocation();

  const activeAlertCount = alerts?.filter((a) => !a.acknowledged).length || 0;

  const handleToggleSim = () => {
    const newState = !isSimRunning;
    setIsSimRunning(newState);
    toggleSim(newState);
  };

  const getTitle = () => {
    if (location === "/") return "Dashboard";
    if (location.startsWith("/machines")) return "Machine Monitor";
    if (location.startsWith("/analytics")) return "Analytics";
    if (location.startsWith("/maintenance")) return "Maintenance";
    if (location.startsWith("/alerts")) return "Alerts";
    if (location.startsWith("/reports")) return "Reports";
    return "Predictive Maintenance";
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Fleet Health Indicator */}
        {fleet && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-white/5">
            <div className={cn("w-2 h-2 rounded-full",
              fleet.averageHealthScore >= 70 ? "bg-emerald-500" :
              fleet.averageHealthScore >= 40 ? "bg-amber-500" : "bg-rose-500"
            )} style={{ boxShadow: fleet.averageHealthScore >= 70 ? "0 0 6px rgba(16,185,129,0.6)" : "0 0 6px rgba(245,158,11,0.6)" }} />
            <span className="text-xs font-medium text-muted-foreground">Fleet: {fleet.averageHealthScore}%</span>
          </div>
        )}

        {/* System Online */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-white/5">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Online</span>
        </div>

        {/* Alerts Bell */}
        <Link href="/alerts">
          <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold">
                {activeAlertCount > 99 ? "99+" : activeAlertCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Simulation Toggle */}
        <Button 
          size="sm" 
          variant={isSimRunning ? "destructive" : "default"}
          onClick={handleToggleSim}
          className="gap-2 min-w-[130px]"
        >
          {isSimRunning ? (
            <>
              <Pause className="w-4 h-4" /> Stop Sim
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Sim
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
