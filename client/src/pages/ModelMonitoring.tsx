import { useState } from "react";
import { Link } from "wouter";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Cpu,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
  Info,
  RotateCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FEATURE_IMPORTANCE = [
  { feature: "Vibration RMS (High Freq)", importance: 0.28, domain: "Mechanical / Bearings" },
  { feature: "Spindle Core Temp", importance: 0.24, domain: "Thermal / Friction" },
  { feature: "Load Current Harmonics", importance: 0.18, domain: "Stator / Inverter" },
  { feature: "Hydraulic Line Pressure", importance: 0.14, domain: "Fluid Dynamics" },
  { feature: "RPM Velocity Stability", importance: 0.11, domain: "Kinematic Drive" },
  { feature: "Enclosure Humidity", importance: 0.05, domain: "Environmental" },
];

const DRIFT_TRACKING = [
  { batch: "Wk 1", precision: 0.94, recall: 0.91, fpr: 0.04 },
  { batch: "Wk 2", precision: 0.95, recall: 0.90, fpr: 0.03 },
  { batch: "Wk 3", precision: 0.92, recall: 0.93, fpr: 0.05 },
  { batch: "Wk 4", precision: 0.96, recall: 0.92, fpr: 0.02 },
  { batch: "Wk 5", precision: 0.95, recall: 0.94, fpr: 0.03 },
  { batch: "Wk 6", precision: 0.94, recall: 0.93, fpr: 0.04 },
];

export default function ModelMonitoring() {
  const [selectedAsset, setSelectedAsset] = useState<string>("CNC Milling Station Alpha");

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              ML Model Validation & Explainability
            </h1>
            <p className="text-muted-foreground text-sm">
              Model lineage, feature attribution weights, SPC drift telemetry, and classification metrics
            </p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-secondary/50 border border-border/50 text-xs font-mono">
          <span className="text-muted-foreground">Active Architecture:</span>{" "}
          <span className="text-cyan-400 font-bold">Hybrid XGBoost + SPC Z-Score (v2.4)</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ModelMetricCard label="Model Precision" value="94.8%" status="nominal" note="PR-AUC: 0.92" />
        <ModelMetricCard label="Failure Recall" value="92.4%" status="nominal" note="Catches 9.2/10 failures" />
        <ModelMetricCard label="False Alert Rate" value="3.2%" status="nominal" note="Suppressed via hysteresis" />
        <ModelMetricCard label="Warning Lead Time" value="4.8 days" status="nominal" note="Mean notice before shutdown" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Feature Importance (SHAP-inspired weights) */}
        <Card className="lg:col-span-7 bg-card/50 border-border/60">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Feature Importance & SHAP Attribution Weights
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Global Importance Index</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 0.35]} />
                  <YAxis type="category" dataKey="feature" stroke="rgba(255,255,255,0.4)" fontSize={10} width={130} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d131f",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="importance" name="Contribution Weight" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 text-[11px] text-muted-foreground leading-relaxed font-mono">
              <strong className="text-foreground">Interpretability Note:</strong> High-frequency vibration RMS and spindle temperature drive over 52% of failure predictions. Feature weights reflect correlation with bearing raceway degradation and do not constitute independent physical proof of causation.
            </div>
          </CardContent>
        </Card>

        {/* Model Drift Tracking Over Time */}
        <Card className="lg:col-span-5 bg-card/50 border-border/60 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Drift & Precision Stability Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DRIFT_TRACKING}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="batch" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0.85, 1.0]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d131f",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Line type="monotone" dataKey="precision" name="Precision" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="recall" name="Recall" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "6px" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero statistical concept drift detected across last 6 evaluation cycles.</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Model Lineage & Deployment Governance */}
      <Card className="bg-card/50 border-border/60">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Model Lineage, Artifact Provenance & Industrial Safety Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase block font-bold">Training Lineage</span>
            <div className="text-foreground">Dataset: C-MAPSS + Plant Telemetry A</div>
            <div className="text-muted-foreground">Train/Val Split: 80 / 20 Time-aware</div>
            <div className="text-muted-foreground">Validation PR-AUC: 0.924</div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase block font-bold">Artifact Registry</span>
            <div className="text-foreground">Artifact ID: xgb-cbm-prod-v2.4</div>
            <div className="text-muted-foreground">Checksum: sha256:7f81a4b9e2...</div>
            <div className="text-muted-foreground">Runtime: Node.js TSX Micro-service</div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase block font-bold">Safety Directive</span>
            <div className="text-rose-400 font-semibold">Advisory Decision Support Only</div>
            <div className="text-muted-foreground text-[10px] leading-snug">
              Predictions never autonomously trigger physical emergency stop (E-stop) circuits. All interventions require certified technician review.
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function ModelMetricCard({
  label,
  value,
  status,
  note,
}: {
  label: string;
  value: string;
  status: "nominal" | "warning";
  note: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card/60 border border-border/60 shadow-sm">
      <span className="text-[10px] font-mono uppercase text-muted-foreground block">{label}</span>
      <span className="text-2xl font-bold font-mono text-foreground my-1 block">{value}</span>
      <span className="text-[11px] text-muted-foreground font-mono">{note}</span>
    </div>
  );
}
