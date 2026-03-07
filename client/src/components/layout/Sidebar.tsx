import { Link, useLocation } from "wouter";
import { LayoutDashboard, Server, Wrench, BarChart2, Bell, FileText, Activity } from "lucide-react";
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
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/machines", icon: Server, label: "Machines" },
    { href: "/analytics", icon: BarChart2, label: "Analytics" },
    { href: "/maintenance", icon: Wrench, label: "Maintenance" },
    { href: "/alerts", icon: Bell, label: "Alerts", badge: activeAlertCount > 0 ? activeAlertCount : null },
    { href: "/reports", icon: FileText, label: "Reports" },
  ];

  return (
    <aside className={cn("w-64 bg-card border-r border-border/50 flex flex-col", className)}>
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">PredMaintain</span>
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
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <h4 className="text-xs font-bold text-indigo-400 mb-1">AI ENGINE v2.0</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Multi-factor anomaly detection, trend analysis, and predictive maintenance active.
          </p>
        </div>
      </div>
    </aside>
  );
}
