import { Link } from "wouter";
import { Activity, Thermometer, Zap, Gauge, Droplets, RotateCw } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Machine } from "@shared/schema";

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  return (
    <Link href={`/machines/${machine.id}`} className="block group">
      <div className="
        h-full bg-card rounded-xl p-5 border border-border/50
        hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5
        transition-all duration-300 relative overflow-hidden
      ">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {machine.name}
              </h3>
              <p className="text-sm text-muted-foreground">{machine.type}</p>
            </div>
            <StatusBadge status={machine.status} />
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1 mb-4">
            <span className="px-1.5 py-0.5 rounded bg-muted/30">{machine.department}</span>
            <span>•</span>
            <span>{machine.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SensorStat icon={Thermometer} label="Temp" value={`${machine.specifications.maxTemp}°C`} />
            <SensorStat icon={Activity} label="Vibration" value={`${machine.specifications.maxVibration}mm`} />
            <SensorStat icon={Zap} label="Power" value={`${machine.specifications.maxCurrent}A`} />
            {machine.specifications.maxPressure > 0 && (
              <SensorStat icon={Gauge} label="Pressure" value={`${machine.specifications.maxPressure}psi`} />
            )}
            <SensorStat icon={Droplets} label="Humidity" value={`${machine.specifications.maxHumidity}%`} />
            {machine.specifications.maxRpm > 0 && (
              <SensorStat icon={RotateCw} label="RPM" value={`${machine.specifications.maxRpm}`} />
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
            <span>Runtime: {machine.totalRuntimeHours.toFixed(0)}h</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SensorStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-background/50 border border-border/50">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mb-1" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-xs">{value}</span>
    </div>
  );
}
