import { cn } from "@/lib/utils";
import { Circle, AlertTriangle, XOctagon, Wrench } from "lucide-react";

type Status = "healthy" | "warning" | "critical" | "maintenance" | string;

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showLabel?: boolean;
}

export function StatusBadge({ status, className, showLabel = true }: StatusBadgeProps) {
  const config = {
    healthy: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: Circle,
      label: "Healthy",
    },
    warning: {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: AlertTriangle,
      label: "Warning",
    },
    critical: {
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: XOctagon,
      label: "Critical",
    },
    maintenance: {
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: Wrench,
      label: "Maintenance",
    },
  };

  const style = config[status as keyof typeof config] || config.healthy;
  const Icon = style.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
      style.bg,
      style.border,
      style.color,
      className
    )}>
      <Icon className="w-3 h-3 fill-current" />
      {showLabel && <span>{style.label}</span>}
    </div>
  );
}
