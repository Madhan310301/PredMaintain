import { Link } from "wouter";
import type { Machine } from "@shared/schema";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FleetHeatmapProps {
  machines: Machine[];
}

export function FleetHeatmap({ machines }: FleetHeatmapProps) {
  if (!machines.length) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No machines to display
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {machines.map((machine, idx) => (
        <motion.div
          key={machine.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
        >
          <Link href={`/machines/${machine.id}`}>
            <div
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                "hover:scale-105 hover:shadow-lg group relative overflow-hidden",
                machine.status === "healthy"
                  ? "bg-emerald-950/20 border-emerald-800/30 hover:border-emerald-600/50 hover:shadow-emerald-900/20"
                  : machine.status === "warning"
                  ? "bg-amber-950/20 border-amber-800/30 hover:border-amber-600/50 hover:shadow-amber-900/20"
                  : "bg-rose-950/20 border-rose-800/30 hover:border-rose-600/50 hover:shadow-rose-900/20"
              )}
            >
              {/* Subtle pulse for critical machines */}
              {machine.status === "critical" && (
                <div className="absolute inset-0 bg-rose-500/5 animate-pulse rounded-xl" />
              )}

              <div className="relative z-10">
                {/* Status dot */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      machine.status === "healthy" ? "bg-emerald-500" :
                      machine.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                    )}
                    style={{
                      boxShadow: machine.status === "healthy"
                        ? "0 0 8px rgba(16,185,129,0.6)"
                        : machine.status === "warning"
                        ? "0 0 8px rgba(245,158,11,0.6)"
                        : "0 0 8px rgba(239,68,68,0.6)",
                    }}
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {machine.status}
                  </span>
                </div>

                {/* Machine name */}
                <h4 className="text-sm font-semibold truncate group-hover:text-foreground transition-colors">
                  {machine.name}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{machine.department}</p>

                {/* Mini stats */}
                <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                  <span>{machine.totalRuntimeHours.toFixed(0)}h</span>
                  <span>{machine.type}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
