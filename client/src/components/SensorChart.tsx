import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { format } from "date-fns";
import type { SensorReading } from "@shared/schema";

interface SensorChartProps {
  data: SensorReading[];
  dataKey: "temperature" | "vibration" | "current" | "pressure" | "humidity" | "rpm";
  color: string;
  unit: string;
  height?: number;
  threshold?: number;
}

export function SensorChart({ data, dataKey, color, unit, height = 250, threshold }: SensorChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm bg-muted/10 rounded-lg" style={{ height }}>
        No sensor data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(val) => format(new Date(val), "mm:ss")} 
            stroke="rgba(255,255,255,0.2)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            unit={unit}
            width={50}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
            }}
            labelFormatter={(label) => format(new Date(label), "HH:mm:ss")}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          {threshold && (
            <ReferenceLine
              y={threshold}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              label={{ value: "MAX", fill: "#ef4444", fontSize: 10, position: "right" }}
            />
          )}
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
