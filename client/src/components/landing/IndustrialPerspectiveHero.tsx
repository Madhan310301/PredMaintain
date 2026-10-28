import { useState, useRef, useEffect, useId } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  Thermometer, 
  Zap, 
  RotateCw, 
  Layers, 
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndustrialCardData {
  id: string;
  tag: string;
  name: string;
  subsystem: string;
  metric: string;
  unit: string;
  status: "nominal" | "warning" | "critical";
  conditionScore: number;
  icon: typeof Activity;
  transform: { x: number; y: number; z: number; rotateY: number; rotateX: number };
}

const INDUSTRIAL_NODES: IndustrialCardData[] = [
  {
    id: "cnc-01",
    tag: "CNC-012",
    name: "Milling Spindle Alpha",
    subsystem: "Thermal & Kinematic Runout",
    metric: "74.2",
    unit: "°C",
    status: "nominal",
    conditionScore: 94,
    icon: Thermometer,
    transform: { x: -320, y: -140, z: -80, rotateY: 18, rotateX: -6 },
  },
  {
    id: "press-02",
    tag: "HYD-PRESS-02",
    name: "Main Ram Servo",
    subsystem: "Hydraulic Cavitation & Line PSI",
    metric: "214.8",
    unit: "bar",
    status: "warning",
    conditionScore: 68,
    icon: Gauge,
    transform: { x: 330, y: -160, z: -100, rotateY: -20, rotateX: -4 },
  },
  {
    id: "motor-04",
    tag: "MOTOR-104",
    name: "Induction Drive Unit",
    subsystem: "Bearing RMS Velocity (ISO 10816)",
    metric: "4.85",
    unit: "mm/s",
    status: "critical",
    conditionScore: 32,
    icon: Activity,
    transform: { x: -360, y: 130, z: -40, rotateY: 14, rotateX: 8 },
  },
  {
    id: "comp-05",
    tag: "COMP-031",
    name: "Rotary Screw Stage II",
    subsystem: "Vibration Spectrum & Intercooler",
    metric: "92",
    unit: "% CI",
    status: "nominal",
    conditionScore: 91,
    icon: Cpu,
    transform: { x: 340, y: 140, z: -60, rotateY: -16, rotateX: 6 },
  },
  {
    id: "robot-03",
    tag: "ROBOT-R7",
    name: "Articulated Arm Joint 3",
    subsystem: "Stator Phase Load Harmonic",
    metric: "28.4",
    unit: "A",
    status: "nominal",
    conditionScore: 88,
    icon: Zap,
    transform: { x: -140, y: -240, z: -160, rotateY: 8, rotateX: -12 },
  },
  {
    id: "conv-06",
    tag: "CONV-C03",
    name: "Packaging Feeder",
    subsystem: "Encoder Synchronous Velocity",
    metric: "1,740",
    unit: "RPM",
    status: "warning",
    conditionScore: 64,
    icon: RotateCw,
    transform: { x: 150, y: -230, z: -180, rotateY: -10, rotateX: -10 },
  },
];

export function IndustrialPerspectiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Mouse parallax motion values (normalized -1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for buttery industrial feel without high-frequency stutter
  const springX = useSpring(mouseX, { stiffness: 45, damping: 18, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 18, mass: 0.8 });

  // Perspective transforms
  const rotateY = useTransform(springX, [-1, 1], [-12, 12]);
  const rotateX = useTransform(springY, [-1, 1], [10, -10]);

  // Non-trapping mouse handler (allows natural page scroll)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#07090e] border-b border-border/40 select-none py-16 px-4 md:px-8"
      style={{ perspective: "1200px" }}
      aria-label="Industrial Perspective Hero"
    >
      {/* Background Technical Grid & Ambient Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating 3D Industrial Asset Cards (Desktop/Tablet View) */}
      <motion.div 
        className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none"
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {INDUSTRIAL_NODES.map((node) => {
          const Icon = node.icon;
          const isSelected = activeCard === node.id;
          
          return (
            <motion.div
              key={node.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                transform: `translate3d(${node.transform.x}px, ${node.transform.y}px, ${node.transform.z}px) rotateY(${node.transform.rotateY}deg) rotateX(${node.transform.rotateX}deg)`,
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setActiveCard(node.id)}
              onMouseLeave={() => setActiveCard(null)}
              whileHover={{ scale: 1.08, zIndex: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href="/dashboard">
                <div className={`w-64 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-2xl ${
                  node.status === "nominal"
                    ? "bg-[#0b111a]/85 border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-emerald-950/40"
                    : node.status === "warning"
                    ? "bg-[#14120e]/85 border-amber-500/30 hover:border-amber-400/70 hover:shadow-amber-950/40"
                    : "bg-[#180e10]/85 border-rose-500/40 hover:border-rose-400/80 hover:shadow-rose-950/50"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase font-semibold">
                      {node.tag}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      node.status === "nominal" 
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : node.status === "warning"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        node.status === "nominal" ? "bg-emerald-400" :
                        node.status === "warning" ? "bg-amber-400" : "bg-rose-500"
                      }`} />
                      {node.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{node.name}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">{node.subsystem}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-end justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono">Live Reading</span>
                      <span className="text-sm font-mono font-bold text-foreground">
                        {node.metric} <span className="text-[10px] font-normal text-muted-foreground">{node.unit}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-mono">Condition</span>
                      <span className={`text-xs font-mono font-bold ${
                        node.conditionScore >= 75 ? "text-emerald-400" :
                        node.conditionScore >= 50 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {node.conditionScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Central Content */}
      <div className="relative z-30 max-w-3xl mx-auto text-center px-4">
        {/* Architecture Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border/80 text-xs font-mono text-muted-foreground mb-6 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-foreground font-semibold">PREDMAINTAIN 2.0</span>
          <span>•</span>
          <span>ISO 13374 Condition Analytics</span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
        >
          Predict Failure. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400">
            Protect Uptime.
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Turn real-time machine data into predictive intelligence, smarter maintenance decisions, and more reliable industrial operations.
        </motion.p>

        {/* Calls to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto h-12 px-7 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-lg gap-2 shadow-lg shadow-cyan-500/20 transition-all">
              Launch Operations Center
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-7 border-border/80 hover:bg-secondary/60 text-foreground font-medium text-sm rounded-lg gap-2">
              Explore Live Architecture
              <Layers className="w-4 h-4 text-muted-foreground" />
            </Button>
          </a>
        </motion.div>

        {/* Empirical Transparency Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-mono"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simulated 20% downtime reduction model • Deterministic plant telemetry streams</span>
        </motion.div>
      </div>

      {/* Mobile / Tablet Responsive Fallback Card Grid */}
      <div className="lg:hidden mt-12 w-full max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
        {INDUSTRIAL_NODES.slice(0, 4).map((node) => {
          const Icon = node.icon;
          return (
            <Link key={node.id} href="/dashboard">
              <div className="p-3.5 rounded-lg bg-card/80 border border-border/70 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-muted-foreground">{node.tag}</span>
                  <span className={`text-[10px] font-mono font-bold ${
                    node.status === "nominal" ? "text-emerald-400" :
                    node.status === "warning" ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {node.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 my-1">
                  <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs font-semibold text-foreground truncate">{node.name}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono mt-2 pt-2 border-t border-white/5">
                  <span className="text-muted-foreground">{node.metric} {node.unit}</span>
                  <span className="text-foreground font-semibold">CI: {node.conditionScore}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Scroll Down Anchor */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] text-muted-foreground font-mono opacity-60 hover:opacity-100 transition-opacity">
        <span>Scroll to Explore</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
}
