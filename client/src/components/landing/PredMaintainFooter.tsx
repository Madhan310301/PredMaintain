import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, Cpu, Activity, Wrench, Layers, Terminal, ArrowUpRight } from "lucide-react";

export function PredMaintainFooter() {
  return (
    <footer className="relative bg-[#05070a] border-t border-border/50 text-foreground overflow-hidden pt-16 pb-12 select-none">
      {/* Background Technical Grid Accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Animated Technical Micro-Illustrations Ribbon */}
        <div className="mb-14 p-6 rounded-2xl bg-[#090d14] border border-border/50 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              IIoT Sensor Telemetry & Mechanical Actuator Instrumentation
            </span>
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
              ISO 13374 Condition Data Standard
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            
            {/* 1. Rotating Precision Gear */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-white/5 hover:border-cyan-500/40 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center text-cyan-400 mb-2">
                <svg className="w-8 h-8 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 2v2m0 16v2m-8-10H2m20 0h-2m-2.93-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m0-14.14l1.41 1.41m11.32 11.32l1.41 1.41" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" strokeWidth="2" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-foreground">Drive Gearbox</span>
              <span className="text-[9px] font-mono text-muted-foreground">Mesh Frequency</span>
            </div>

            {/* 2. Pulsing Piezoelectric Vibration Sensor */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-white/5 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center text-emerald-400 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="3" fill="currentColor" className="animate-pulse" />
                  <path d="M12 5a7 7 0 0 1 7 7" strokeDasharray="2 2" className="animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="3 3" className="animate-[pulse_2s_ease-in-out_infinite]" />
                  <path d="M12 19a7 7 0 0 1-7-7" strokeDasharray="2 2" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-foreground">Piezo Sensor</span>
              <span className="text-[9px] font-mono text-muted-foreground">0-10 kHz RMS</span>
            </div>

            {/* 3. Articulated Robotic Arm Joint */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-white/5 hover:border-purple-500/40 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center text-purple-400 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M4 20h16M7 20v-4l5-6 4 2 2-6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2" fill="currentColor" />
                  <circle cx="16" cy="12" r="1.5" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-foreground">Robot Pivot</span>
              <span className="text-[9px] font-mono text-muted-foreground">6-Axis Torque</span>
            </div>

            {/* 4. Oscilloscope Waveform */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-white/5 hover:border-cyan-500/40 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center text-cyan-400 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="2" y="4" width="20" height="16" rx="3" strokeWidth="1.5" />
                  <path d="M4 12h3l2-5 4 10 3-7 2 3h2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-foreground">Oscilloscope</span>
              <span className="text-[9px] font-mono text-muted-foreground">FFT Harmonics</span>
            </div>

            {/* 5. Calibrated Torque Wrench */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-white/5 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center text-amber-400 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-foreground">Precision Work</span>
              <span className="text-[9px] font-mono text-muted-foreground">Calibrated Nm</span>
            </div>

            {/* 6. Dynamic Conveyor Mechanism */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-white/5 hover:border-blue-500/40 transition-colors group">
              <div className="w-12 h-12 flex items-center justify-center text-blue-400 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="2" y="8" width="20" height="8" rx="4" />
                  <circle cx="6" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="18" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-foreground">Conveyor Drive</span>
              <span className="text-[9px] font-mono text-muted-foreground">Tension & Speed</span>
            </div>

          </div>
        </div>

        {/* Oversized Brand Typography */}
        <div className="border-b border-border/40 pb-10 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white/90 font-mono block leading-none">
                PREDMAINT
              </span>
              <p className="text-base sm:text-lg text-cyan-400 font-semibold tracking-tight mt-3">
                Intelligent Maintenance. Reliable Operations.
              </p>
              <p className="text-xs text-muted-foreground max-w-md mt-1">
                Edge-to-cloud industrial asset intelligence, statistical process control, and failure prognostics for modern manufacturing facilities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/dashboard">
                <button className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                  Access Operational Console <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-xs">
          <div>
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono mb-3">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Operational Console</Link></li>
              <li><Link href="/machines" className="hover:text-cyan-400 transition-colors">Asset Inventory</Link></li>
              <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Reliability Analytics</Link></li>
              <li><Link href="/maintenance" className="hover:text-cyan-400 transition-colors">Work Orders (CMMS)</Link></li>
              <li><Link href="/alerts" className="hover:text-cyan-400 transition-colors">Telemetry Exception Log</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono mb-3">Predictive Engine</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">SPC Z-Score Anomaly Bounds</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">OLS Linear Drift Modeling</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Composite Condition Index</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Prognostic RUL Estimator</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Model Explainability</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono mb-3">Asset Coverage</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="text-foreground">CNC Milling Centers</span></li>
              <li><span className="text-foreground">Hydraulic Stamping Presses</span></li>
              <li><span className="text-foreground">Robotic Articulated Arms</span></li>
              <li><span className="text-foreground">Screw Compressors</span></li>
              <li><span className="text-foreground">Centrifugal Slurry Pumps</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono mb-3">Compliance & Docs</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">ISO 13374 CBM Architecture</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">ISO 10816 Vibration Severity</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Multi-Tenant Tenant Isolation</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">API Specification & Contracts</span></li>
              <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Audit Logging & Verification</span></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono mb-3">Deployment</h4>
            <div className="p-3 rounded-lg bg-secondary/30 border border-white/5 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-emerald-400 font-bold">OPERATIONAL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span className="text-foreground">2.0.4-rc</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Facility:</span>
                <span className="text-cyan-400">Plant Alpha</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution & Copyright Bar */}
        <div className="pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground font-mono">
          <div>
            © {new Date().getFullYear()} PredMaintain Systems. All rights reserved. Industrial Condition Monitoring.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer">Privacy Notice</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
