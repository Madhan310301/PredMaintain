import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { SensorRiskScore } from "@shared/schema";

interface RiskRadarProps {
  sensorRisks: SensorRiskScore[];
  height?: number;
}

export function RiskRadar({ sensorRisks, height = 280 }: RiskRadarProps) {
  if (!sensorRisks.length) {
    return (
      <div className="flex items-center justify-center text-muted-foreground text-sm" style={{ height }}>
        Run AI Analysis to see risk breakdown
      </div>
    );
  }

  const data = sensorRisks.map((sr) => ({
    sensor: sr.sensor.replace("Power Consumption", "Power"),
    risk: 100 - sr.score, // invert: higher = more risk for visual clarity
    fullMark: 100,
  }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="sensor"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Risk Level"
            dataKey="risk"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
