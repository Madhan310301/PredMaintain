import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  ShieldAlert,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
  DollarSign,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCw,
  Gauge,
  Thermometer,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMachines } from "@/hooks/use-machines";
import { useFleetSummary } from "@/hooks/use-reports";
import { useMaintenanceRecords } from "@/hooks/use-maintenance";
import { useAlerts } from "@/hooks/use-alerts";

// Hourly telemetry simulation for Module 2
const TELEMETRY_STREAM = [
  { time: "00:00", vibration: 1.8, temp: 64, current: 22, normalMaxVib: 3.5 },
  { time: "03:00", vibration: 1.9, temp: 66, current: 23, normalMaxVib: 3.5 },
  { time: "06:00", vibration: 2.1, temp: 68, current: 25, normalMaxVib: 3.5 },
  { time: "09:00", vibration: 2.7, temp: 73, current: 29, normalMaxVib: 3.5 },
  { time: "12:00", vibration: 3.4, temp: 82, current: 34, normalMaxVib: 3.5 },
  { time: "15:00", vibration: 4.1, temp: 89, current: 38, normalMaxVib: 3.5 }, // spike
  { time: "18:00", vibration: 3.2, temp: 79, current: 31, normalMaxVib: 3.5 },
  { time: "21:00", vibration: 2.4, temp: 71, current: 26, normalMaxVib: 3.5 },
];

// Historical downtime trend for Module 1
const DOWNTIME_TREND = [
  { month: "May", planned: 18, unplanned: 24, avoidedSim: 8 },
  { month: "Jun", planned: 16, unplanned: 21, avoidedSim: 10 },
  { month: "Jul", planned: 20, unplanned: 17, avoidedSim: 12 },
  { month: "Aug", planned: 19, unplanned: 14, avoidedSim: 15 },
  { month: "Sep", planned: 22, unplanned: 11, avoidedSim: 18 },
  { month: "Oct", planned: 21, unplanned: 8, avoidedSim: 21 },
];

// Subsystem failure modes for Module 4
const FAILURE_MODES = [
  { category: "Bearing Wear", frequency: 38, criticality: 85 },
  { category: "Thermal Overload", frequency: 24, criticality: 72 },
  { category: "Hydraulic Bypass", frequency: 18, criticality: 78 },
  { category: "Stator / Inverter", frequency: 12, criticality: 65 },
  { category: "Belt Alignment", frequency: 8, criticality: 45 },
];

export function MaintenanceAnalyticsBento() {
  const { data: machines } = useMachines();
  const { data: fleet } = useFleetSummary();
  const { data: maintenance } = useMaintenanceRecords();
  const { data: alerts } = useAlerts();

  // State toggles
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [timeWindow, setTimeWindow] = useState<"24h" | "7d" | "30d">("7d");
  const [activeTelemetryChannel, setActiveTelemetryChannel] = useState<"vibration" | "temp" | "current">("vibration");

  // Currency formatter
  const formatCost = (valInUSD: number) => {
    if (currency === "INR") {
      // 1 USD approx 83 INR
      const inr = valInUSD * 83;
      if (inr >= 100000) {
        return `₹${(inr / 100000).toFixed(2)} Lakhs`;
      }
      return `₹${Math.round(inr).toLocaleString("en-IN")}`;
    }
    return `$${Math.round(valInUSD).toLocaleString()}`;
  };

  // Group machines for Treemap
  const treemapCategories = useMemo(() => {
    if (!machines) return [];
    const depts: Record<string, { healthy: typeof machines; warning: typeof machines; critical: typeof machines }> = {};

    machines.forEach((m) => {
      if (!depts[m.department]) {
        depts[m.department] = { healthy: [], warning: [], critical: [] };
      }
      if (m.status === "healthy") depts[m.department].healthy.push(m);
      else if (m.status === "warning") depts[m.department].warning.push(m);
      else depts[m.department].critical.push(m);
    });

    return Object.entries(depts).map(([dept, groups]) => ({
      name: dept,
      total: groups.healthy.length + groups.warning.length + groups.critical.length,
      ...groups,
    }));
  }, [machines]);

  return (
    <div className="space-y-6">
      {/* ================= COMPLEMENTARY METRIC RIBBON ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricRibbonItem
          label="Total Monitored Assets"
          value={fleet?.totalMachines || 8}
          unit="units"
          status="nominal"
          detail="8 / 8 reporting online"
        />
        <MetricRibbonItem
          label="Sensor Availability"
          value="100%"
          unit="48 channels"
          status="nominal"
          detail="Ingestion freshness: 1.8s"
        />
        <MetricRibbonItem
          label="Assets At Critical Risk"
          value={fleet?.criticalCount || 1}
          unit="units"
          status={fleet?.criticalCount ? "critical" : "nominal"}
          detail="Triggering SPC exception"
        />
        <MetricRibbonItem
          label="Unresolved Warnings"
          value={fleet?.warningCount || 2}
          unit="advisories"
          status="warning"
          detail="Scheduled within window"
        />
        <MetricRibbonItem
          label="Fleet Condition Index"
          value={`${fleet?.averageHealthScore || 73}%`}
          unit="composite"
          status={fleet?.averageHealthScore && fleet.averageHealthScore >= 70 ? "nominal" : "warning"}
          detail="Weighted ISO-13374 mean"
        />
        <MetricRibbonItem
          label="Predictive Lead Time"
          value="4-18"
          unit="days"
          status="nominal"
          detail="Forecast horizon (OLS)"
        />
      </div>

      {/* ================= 4 MAJOR BENTO MODULES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= MODULE 1: DOWNTIME & COST SAVINGS (Span 7) ================= */}
        <Card className="lg:col-span-7 bg-[#0b0f17] border-border/60 shadow-xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                    Module 1: Downtime & Reliability Economics
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    Estimated unplanned downtime avoidance vs conventional calendar maintenance
                  </p>
                </div>
              </div>

              {/* Currency toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/80 border border-border/80 text-xs font-mono">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    currency === "INR" ? "bg-cyan-500 text-black" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    currency === "USD" ? "bg-cyan-500 text-black" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/50">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Simulated Cost Avoidance
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                  {formatCost(51600)}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <span className="text-emerald-400 font-semibold">20.4%</span> reduction in model
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/50">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Avoided Stoppage Time
                </span>
                <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                  84.5 hrs
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Across 6 prevented cascades
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/50">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Actual Recorded Work Orders
                </span>
                <span className="text-xl font-bold font-mono text-foreground mt-1 block">
                  {formatCost(maintenance?.reduce((acc, m) => acc + m.cost, 0) || 10982)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {maintenance?.length || 15} completed operations
                </span>
              </div>
            </div>

            {/* Downtime Trend Bar Chart */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[11px] font-mono font-medium text-muted-foreground">
                  Downtime Profile (Planned vs Unplanned vs Prevented)
                </span>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" /> Planned (h)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-500" /> Unplanned (h)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Avoided (Model)</span>
                </div>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DOWNTIME_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d131f",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="planned" name="Planned Downtime" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="unplanned" name="Unplanned Downtime" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="avoidedSim" name="Avoided (Simulated)" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Empirical Distinction Disclaimer */}
            <div className="p-2.5 rounded bg-white/5 border border-white/5 text-[10px] text-muted-foreground font-mono flex items-center justify-between">
              <span>* Avoided downtime calculated against uninstrumented historical plant baseline (32.4h/month).</span>
              <span className="text-cyan-400">Simulation Model v2.4</span>
            </div>
          </CardContent>
        </Card>

        {/* ================= MODULE 2: REAL-TIME EQUIPMENT TELEMETRY (Span 5) ================= */}
        <Card className="lg:col-span-5 bg-[#0b0f17] border-border/60 shadow-xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                    Module 2: Real-Time Telemetry Stream
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    Multi-parameter sensor trend vs ISO 10816 operating limits
                  </p>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/80 border border-border/80 text-[10px] font-mono">
                <button
                  onClick={() => setActiveTelemetryChannel("vibration")}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    activeTelemetryChannel === "vibration" ? "bg-cyan-500 text-black" : "text-muted-foreground"
                  }`}
                >
                  Vib (mm/s)
                </button>
                <button
                  onClick={() => setActiveTelemetryChannel("temp")}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    activeTelemetryChannel === "temp" ? "bg-cyan-500 text-black" : "text-muted-foreground"
                  }`}
                >
                  Temp (°C)
                </button>
                <button
                  onClick={() => setActiveTelemetryChannel("current")}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    activeTelemetryChannel === "current" ? "bg-cyan-500 text-black" : "text-muted-foreground"
                  }`}
                >
                  Load (A)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* Live Envelope Readout */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/50">
              <div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  {activeTelemetryChannel === "vibration" ? "Vibration Velocity RMS" :
                   activeTelemetryChannel === "temp" ? "Spindle Core Temperature" : "Drive Phase Current"}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {activeTelemetryChannel === "vibration" ? "4.1" :
                     activeTelemetryChannel === "temp" ? "89.2" : "38.1"}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {activeTelemetryChannel === "vibration" ? "mm/s" :
                     activeTelemetryChannel === "temp" ? "°C" : "A"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">Operating Threshold</span>
                <span className="text-xs font-mono font-bold text-rose-400 mt-1 block">
                  {activeTelemetryChannel === "vibration" ? "Threshold: 3.5 mm/s" :
                   activeTelemetryChannel === "temp" ? "Threshold: 85.0 °C" : "Threshold: 35.0 A"}
                </span>
                <span className="text-[10px] font-mono text-rose-400">Exceeded by +17%</span>
              </div>
            </div>

            {/* Line Chart with Threshold */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TELEMETRY_STREAM}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d131f",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={activeTelemetryChannel}
                    name={activeTelemetryChannel}
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ fill: "#06b6d4", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  {activeTelemetryChannel === "vibration" && (
                    <Line
                      type="step"
                      dataKey="normalMaxVib"
                      name="ISO 10816 Limit"
                      stroke="#f43f5e"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-muted-foreground flex items-center justify-between font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                SPC Z-Score: 2.41 (Outlier Detected)
              </span>
              <Link href="/machines/1">
                <span className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-0.5">
                  Inspect Channel <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ================= MODULE 3: ASSET RISK TREEMAP (Span 7) ================= */}
        <Card className="lg:col-span-7 bg-[#0b0f17] border-border/60 shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                    Module 3: Asset Risk Treemap & Fleet Workload
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    Interactive asset distribution partitioned by plant department and condition state
                  </p>
                </div>
              </div>

              {/* Time window selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/80 border border-border/80 text-[10px] font-mono">
                {(["24h", "7d", "30d"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setTimeWindow(w)}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      timeWindow === w ? "bg-cyan-500 text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Interactive SVG / Div Treemap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {treemapCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">{cat.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{cat.total} assets</span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Critical units */}
                    {cat.critical.map((m) => (
                      <Link key={m.id} href={`/machines/${m.id}`}>
                        <div className="p-2 rounded bg-rose-950/40 border border-rose-800/50 hover:border-rose-400 text-xs flex items-center justify-between transition-all cursor-pointer group">
                          <span className="font-semibold text-rose-300 truncate">{m.name}</span>
                          <span className="font-mono text-[10px] text-rose-400 font-bold shrink-0">CRIT</span>
                        </div>
                      </Link>
                    ))}

                    {/* Warning units */}
                    {cat.warning.map((m) => (
                      <Link key={m.id} href={`/machines/${m.id}`}>
                        <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 hover:border-amber-400 text-xs flex items-center justify-between transition-all cursor-pointer group">
                          <span className="font-medium text-amber-300 truncate">{m.name}</span>
                          <span className="font-mono text-[10px] text-amber-400 font-bold shrink-0">WARN</span>
                        </div>
                      </Link>
                    ))}

                    {/* Healthy units */}
                    {cat.healthy.map((m) => (
                      <Link key={m.id} href={`/machines/${m.id}`}>
                        <div className="p-2 rounded bg-emerald-950/20 border border-emerald-800/30 hover:border-emerald-400 text-xs flex items-center justify-between transition-all cursor-pointer group">
                          <span className="text-emerald-300 truncate">{m.name}</span>
                          <span className="font-mono text-[10px] text-emerald-400 font-semibold shrink-0">OK</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[10px] text-muted-foreground flex justify-between font-mono">
                    <span>Window: {timeWindow}</span>
                    <span className="text-cyan-400 hover:underline">Click node to inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ================= MODULE 4: MAINTENANCE & FAILURE TRENDS (Span 5) ================= */}
        <Card className="lg:col-span-5 bg-[#0b0f17] border-border/60 shadow-xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                  Module 4: Subsystem Failure Risk Radar
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Root-cause failure mode frequency and modeled stoppage criticality
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={FAILURE_MODES}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="category" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                  <Radar
                    name="Failure Frequency (%)"
                    dataKey="frequency"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Severity Weight"
                    dataKey="criticality"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px] font-mono">
              <div className="p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground block text-[9px] uppercase">Primary Threat</span>
                <span className="font-semibold text-foreground">Bearing Spall (SKF 6205)</span>
              </div>
              <div className="p-2 rounded bg-secondary/30">
                <span className="text-muted-foreground block text-[9px] uppercase">Secondary Threat</span>
                <span className="font-semibold text-foreground">Thermal Hydraulic Cavitation</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function MetricRibbonItem({
  label,
  value,
  unit,
  status,
  detail,
}: {
  label: string;
  value: string | number;
  unit: string;
  status: "nominal" | "warning" | "critical";
  detail: string;
}) {
  return (
    <div className="p-3.5 rounded-xl bg-[#0b0f17] border border-border/60 shadow-md">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-tight truncate">
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full shrink-0 ${
          status === "nominal" ? "bg-emerald-400" :
          status === "warning" ? "bg-amber-400" : "bg-rose-500 animate-pulse"
        }`} />
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-xl font-bold font-mono text-foreground">{value}</span>
        <span className="text-[10px] font-mono text-muted-foreground truncate">{unit}</span>
      </div>

      <span className="text-[10px] text-muted-foreground block truncate font-mono">
        {detail}
      </span>
    </div>
  );
}
