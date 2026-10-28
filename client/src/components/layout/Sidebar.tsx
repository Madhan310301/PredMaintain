import { Link, useLocation } from "wouter";
import { LayoutDashboard, Server, Wrench, BarChart2, Bell, FileText, Activity, Cpu, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/use-alerts";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { data: alerts } = useAlerts();
  const activeAlertCount = alerts?.filter((a) => !a.acknowledged).length || 0;

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Operations Console" },
    { href: "/machines", icon: Server, label: "Asset Inventory" },
    { href: "/analytics", icon: BarChart2, label: "Reliability Analytics" },
    { href: "/maintenance", icon: Wrench, label: "Work Orders (CMMS)" },
    { href: "/alerts", icon: Bell, label: "Condition Alerts", badge: activeAlertCount > 0 ? activeAlertCount : null },
    { href: "/reports", icon: FileText, label: "Fleet Reports" },
    { href: "/models", icon: Cpu, label: "Model Monitoring" },
  ];

  return (
    <aside className={cn("w-64 bg-card border-r border-border/50 flex flex-col", className)}>
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-foreground block leading-tight">PredMaintain</span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase block">Plant Telemetry & CBM</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold min-w-[20px] text-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <div className="pt-2 mt-2 border-t border-border/40">
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary/40 hover:text-cyan-400 transition-colors cursor-pointer">
              <ExternalLink className="w-4 h-4" />
              <span>Public Showcase</span>
            </div>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-foreground tracking-tight">Diagnostics Pipeline</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Real-time condition monitoring, SPC outlier flagging, and degradation modeling active across 8 plant assets.
          </p>
        </div>
      </div>
    </aside>
  );
}
