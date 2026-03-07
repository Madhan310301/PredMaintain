import { motion } from "framer-motion";

interface HealthGaugeProps {
  score: number;  // 0-100
  size?: number;
  label?: string;
}

export function HealthGauge({ score, size = 180, label = "Health Score" }: HealthGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = radius * Math.PI; // half circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return "#10b981";   // emerald
    if (s >= 40) return "#f59e0b";   // amber
    return "#ef4444";                 // red
  };

  const getGlow = (s: number) => {
    if (s >= 70) return "0 0 20px rgba(16, 185, 129, 0.4)";
    if (s >= 40) return "0 0 20px rgba(245, 158, 11, 0.4)";
    return "0 0 20px rgba(239, 68, 68, 0.4)";
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center" style={{ width: size, height: size * 0.7 }}>
      <svg
        width={size}
        height={size * 0.6}
        viewBox={`0 0 ${size} ${size * 0.6}`}
        style={{ filter: `drop-shadow(${getGlow(score)})` }}
      >
        {/* Background arc */}
        <path
          d={describeArc(size / 2, size * 0.55, radius, 180, 360)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {/* Animated score arc */}
        <motion.path
          d={describeArc(size / 2, size * 0.55, radius, 180, 180 + (score / 100) * 180)}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size * 0.45}
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: size * 0.2, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
        >
          {score}
        </text>
        <text
          x={size / 2}
          y={size * 0.58}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: size * 0.065 }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
