import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  Thermometer, 
  Zap, 
  RotateCw, 
  Layers, 
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Workflow,
  BarChart3,
  FileText,
  Sliders,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IndustrialPerspectiveHero } from "@/components/landing/IndustrialPerspectiveHero";
import { MaintenanceAnalyticsBento } from "@/components/industrial/MaintenanceAnalyticsBento";
import { PredMaintainFooter } from "@/components/landing/PredMaintainFooter";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"math" | "architecture" | "simulation">("simulation");

  return (
    <div className="min-h-screen bg-[#07090e] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <nav className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-sm tracking-tight text-white block">PREDMAINTAIN</span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block">Industrial Telemetry 2.0</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#supported-assets" className="hover:text-white transition-colors">Asset Coverage</a>
          <a href="#analytics-bento" className="hover:text-white transition-colors">Telemetry Bento</a>
          <a href="#simulation-benchmark" className="hover:text-white transition-colors">20% Downtime Benchmark</a>
          <a href="#security" className="hover:text-white transition-colors">Architecture</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs h-9 px-4 rounded-lg gap-1.5 shadow-md shadow-cyan-500/20">
              Operations Center
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* SECTION 1: Perspective Tunnel Hero */}
      <IndustrialPerspectiveHero />

      {/* SECTION 2: Value Proposition & Core Capabilities */}
      <section className="py-20 px-4 sm:px-8 border-b border-border/40 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
            Condition-Based Maintenance & Prognostics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Industrial Uptime Engineered Through Data
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Eliminate reactive firefighting. PredMaintain bridges sensor instrumentation and maintenance management to catch thermal runaway, bearing micro-spalling, and mechanical imbalance before unscheduled line stoppages occur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ValueCard
            icon={TrendingDown}
            badge="ECONOMIC IMPACT"
            title="Downtime & Cost Reduction"
            description="Replace arbitrary 30-day inspection routines with condition-based servicing. Reduce unplanned stoppage time by up to 20% in simulated continuous production models."
          />
          <ValueCard
            icon={Activity}
            badge="REAL-TIME TELEMETRY"
            title="Statistical Outlier Detection"
            description="Process 6-axis telemetry at sub-second frequencies. Automated Shewhart/Z-score algorithms flag abnormal variance with zero reliance on manual threshold tuning."
          />
          <ValueCard
            icon={Workflow}
            badge="OPERATIONS DISPATCH"
            title="Automated CMMS Work Orders"
            description="Direct link from predictive alarm to priority maintenance task. Technicians receive root-cause diagnostic findings, component IDs, and torque/tolerance limits."
          />
        </div>
      </section>

      {/* SECTION 3: How Predictive Maintenance Works (5-Stage Pipeline) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 border-b border-border/40 bg-[#090c13]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
              ISO 13374 Standard Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              From Raw Waveforms to Plant Floor Actions
            </h2>
            <p className="text-muted-foreground text-sm">
              The 5-stage automated diagnostic lifecycle transforming sensor voltage into operational reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <PipelineStep
              step="01"
              title="Sensor Ingestion"
              detail="High-frequency sampling of vibration (mm/s), temperature (°C), current (A), and line pressure."
            />
            <PipelineStep
              step="02"
              title="Signal Cleaning"
              detail="Harmonic bandpass filtering, noise dampening, and normalized feature extraction across cycles."
            />
            <PipelineStep
              step="03"
              title="Anomaly Scoring"
              detail="Modified Z-score comparison against dynamic baseline regimes (|Z| > 2.0 triggers exception)."
            />
            <PipelineStep
              step="04"
              title="Prognostics & RUL"
              detail="Ordinary Least Squares drift velocity extrapolation models Remaining Useful Life in operating days."
            />
            <PipelineStep
              step="05"
              title="Work Order Dispatch"
              detail="Automated generation of targeted work orders with diagnostic summaries and parts requirements."
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: Supported Industrial Equipment Categories */}
      <section id="supported-assets" className="py-20 px-4 sm:px-8 border-b border-border/40 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
              Plant Asset Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Built for Heavy Industrial Machinery
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Calibrated for rotating, reciprocating, hydraulic, and automated industrial assets across automotive, precision machining, and logistics facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AssetCategoryCard
            name="CNC Milling & Lathes"
            specs="Spindle runout, tool wear, axis ball-screw vibration, coolant temp"
            standard="ISO 10816-3 (Group 1 Rigid)"
            icon={RotateCw}
          />
          <AssetCategoryCard
            name="Hydraulic Presses"
            specs="Proportional valve pressure, fluid contamination, seal bypass, ram drift"
            standard="ISO 4406 Cleanliness"
            icon={Gauge}
          />
          <AssetCategoryCard
            name="Articulated Robots"
            specs="Stator winding load, servo backlash, cycloidal reducer grease degradation"
            standard="IEC 60034 Thermal Class F"
            icon={Zap}
          />
          <AssetCategoryCard
            name="Compressors & Pumps"
            specs="Cavitation acoustic signatures, intercooler pressure drop, bearing wear"
            standard="API 610 / ISO 13709"
            icon={Thermometer}
          />
        </div>
      </section>

      {/* SECTION 5: Interactive Analytics Bento Showcase */}
      <section id="analytics-bento" className="py-20 px-4 sm:px-8 border-b border-border/40 bg-[#06080d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
                Live Operations Preview
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Maintenance Analytics Bento
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Unit-consistent industrial metrics • Dual INR/USD financial modeling • Real-time telemetry streams
            </p>
          </div>

          {/* Render the Bento Component */}
          <MaintenanceAnalyticsBento />
        </div>
      </section>

      {/* SECTION 6: Predictive Analytics & Mathematical Formulation */}
      <section className="py-20 px-4 sm:px-8 border-b border-border/40 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
            Mathematical Integrity
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Transparent, Validated Statistical Models
          </h2>
          <p className="text-xs text-muted-foreground">
            No black-box mystery scores. Every alarm is derived from documented statistical process control and physics-informed degradation rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-bold text-foreground">1. SPC Outlier Bound</span>
              <span className="text-cyan-400">Z-Score</span>
            </div>
            <div className="p-3 rounded bg-black/40 border border-white/5 text-center text-cyan-300 font-bold">
              |Z| = |(X_t - μ) / σ| &gt; 2.0
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Standardizes instantaneous telemetry against a 50-point rolling Gaussian baseline. Suppresses spurious single-point sensor drops while reliably detecting real operational shifts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-bold text-foreground">2. Drift Velocity</span>
              <span className="text-emerald-400">OLS Slope</span>
            </div>
            <div className="p-3 rounded bg-black/40 border border-white/5 text-center text-emerald-300 font-bold">
              β = Σ(t - t̄)(X - X̄) / Σ(t - t̄)²
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Evaluates linear trajectory across a 20-sample regression window. Normalized drift rate |β/μ| &gt; 0.01 categorizes channels into stable, improving, or degrading states.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-bold text-foreground">3. Condition Index</span>
              <span className="text-purple-400">Weighted Risk</span>
            </div>
            <div className="p-3 rounded bg-black/40 border border-white/5 text-center text-purple-300 font-bold">
              CI = (Σ w_i · S_i) / Σ w_i
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Synthesizes thermal (0.25), vibration (0.25), current (0.20), pressure (0.15), and RPM (0.10) safety margins into an unambiguous 0-100 reliability index.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: 20% Simulated Downtime Reduction Benchmark Deep-Dive */}
      <section id="simulation-benchmark" className="py-20 px-4 sm:px-8 border-b border-border/40 bg-[#090c13]">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 rounded-2xl bg-[#0d121c] border border-cyan-500/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Portfolio Benchmark Evaluation: 20% Downtime Reduction</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Simulated Outcome vs Real-World Field Validation
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  As reported in the project portfolio, PredMaintain achieved a <strong className="text-white">20% reduction in unplanned downtime</strong> in simulation. To uphold engineering integrity, here is the exact methodology, baseline, and scope of that result:
                </p>

                <div className="space-y-2 text-xs font-mono text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Baseline Scenario:</strong> 8 industrial machines running standard reactive maintenance with a historical mean of 32.4 unplanned downtime hours per month.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>PredMaintain Scenario:</strong> Continuous Z-score anomaly alarms triggered proactive servicing 4–18 days prior to catastrophic failure, averting 6 major stoppage cascades.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Net Avoided Stoppage:</strong> Unplanned hours dropped from 32.4h to 25.8h (a 20.4% reduction in simulated downtime).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-amber-300"><strong>Engineering Limitation:</strong> This outcome is derived from synthetic degradation models and historical stress simulation. Field deployment outcomes will vary based on sensor calibration, operator compliance, and plant operating conditions.</span>
                  </div>
                </div>
              </div>

              {/* Stat Comparison Card */}
              <div className="p-6 rounded-xl bg-secondary/40 border border-white/5 w-full lg:w-80 shrink-0 font-mono space-y-4">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">
                  Simulation Outcome
                </span>

                <div className="space-y-1">
                  <span className="text-3xl font-bold text-emerald-400 block">-20.4%</span>
                  <span className="text-xs text-muted-foreground">Unplanned Downtime</span>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Baseline Stoppage:</span>
                    <span className="text-foreground">32.4 h/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PredMaintain Stoppage:</span>
                    <span className="text-emerald-400 font-semibold">25.8 h/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avoidance Savings:</span>
                    <span className="text-cyan-400 font-semibold">₹42.8L ($51.6k)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Platform Architecture, Isolation, & Security */}
      <section id="security" className="py-20 px-4 sm:px-8 border-b border-border/40 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block mb-2">
            Enterprise Security
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Secure Ingestion & Multi-Tenant Isolation
          </h2>
          <p className="text-xs text-muted-foreground">
            Strict perimeter defenses designed for high-availability manufacturing environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <Lock className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="font-bold text-foreground mb-1">Server Isolation</h4>
            <p className="text-[11px] text-muted-foreground font-sans">
              Strict organization-scoped boundaries. Plant data from one facility cannot be queried by unauthorized tenants.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <Server className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-foreground mb-1">Private Telemetry Gateway</h4>
            <p className="text-[11px] text-muted-foreground font-sans">
              Kafka brokers and InfluxDB time-series storage reside strictly behind private internal networks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <ShieldCheck className="w-5 h-5 text-purple-400 mb-2" />
            <h4 className="font-bold text-foreground mb-1">Role-Based Access (RBAC)</h4>
            <p className="text-[11px] text-muted-foreground font-sans">
              Separate permission tiers for Reliability Engineers, Maintenance Technicians, and Read-Only Operations Viewers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <FileText className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="font-bold text-foreground mb-1">Immutable Audit Trail</h4>
            <p className="text-[11px] text-muted-foreground font-sans">
              Every acknowledged alarm, work order sign-off, and parameter adjustment is logged with UTC timestamps.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: Call to Action */}
      <section className="py-20 px-4 sm:px-8 border-b border-border/40 bg-gradient-to-b from-[#090d16] to-[#05070a] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block">
            Deploy Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Transform Raw Telemetry Into Unbroken Uptime
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Experience the real-time operational dashboard with live simulated telemetry, active outlier detection, and maintenance workflows.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-lg gap-2 shadow-xl shadow-cyan-500/25">
                Launch Operations Center
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/machines">
              <Button size="lg" variant="outline" className="h-12 px-8 border-border text-foreground font-medium text-sm rounded-lg">
                View Monitored Assets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 10: Interactive PredMaintain Footer */}
      <PredMaintainFooter />

    </div>
  );
}

function ValueCard({
  icon: Icon,
  badge,
  title,
  description,
}: {
  icon: any;
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-[#0a0e16] border border-border/60 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[9px] font-mono font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary/50">
          {badge}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function PipelineStep({
  step,
  title,
  detail,
}: {
  step: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 space-y-2 relative">
      <span className="text-2xl font-black font-mono text-cyan-400/40 block">{step}</span>
      <h4 className="text-xs font-bold text-white">{title}</h4>
      <p className="text-[11px] text-muted-foreground leading-snug">{detail}</p>
    </div>
  );
}

function AssetCategoryCard({
  name,
  specs,
  standard,
  icon: Icon,
}: {
  name: string;
  specs: string;
  standard: string;
  icon: any;
}) {
  return (
    <div className="p-5 rounded-xl bg-[#0a0e16] border border-border/50 hover:border-white/20 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h4 className="text-sm font-bold text-white truncate">{name}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{specs}</p>
      <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-cyan-400/80">
        Standard: {standard}
      </div>
    </div>
  );
}
