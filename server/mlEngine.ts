import type { Machine, SensorReading, SensorRiskScore, AnalysisReport, TrendDirection, MachineStatus } from "../shared/schema";

// =====================================================
// ML ENGINE — Predictive Maintenance Analysis
// =====================================================
// 1. Multi-Factor Weighted Risk Scoring
// 2. Trend Analysis (linear regression)
// 3. Anomaly Detection (Z-score based)
// 4. Failure Probability (compound risk)
// 5. Remaining Useful Life estimation
// 6. Recommendations Engine
// =====================================================

interface SensorConfig {
  key: keyof Pick<SensorReading, "temperature" | "vibration" | "current" | "pressure" | "humidity" | "rpm">;
  label: string;
  weight: number;       // importance weight 0-1
  maxSpec: keyof Machine["specifications"];
}

const SENSOR_CONFIGS: SensorConfig[] = [
  { key: "temperature",  label: "Temperature",       weight: 0.25, maxSpec: "maxTemp" },
  { key: "vibration",    label: "Vibration",          weight: 0.25, maxSpec: "maxVibration" },
  { key: "current",      label: "Power Consumption",  weight: 0.20, maxSpec: "maxCurrent" },
  { key: "pressure",     label: "Pressure",           weight: 0.15, maxSpec: "maxPressure" },
  { key: "humidity",     label: "Humidity",            weight: 0.05, maxSpec: "maxHumidity" },
  { key: "rpm",          label: "RPM",                 weight: 0.10, maxSpec: "maxRpm" },
];

// ===================== CORE ANALYSIS =====================

export function analyzeMachine(machine: Machine, readings: SensorReading[]): AnalysisReport {
  if (readings.length < 3) {
    return createDefaultReport(machine, "Insufficient data for analysis — need at least 3 readings.");
  }

  const sensorRisks = computeSensorRisks(machine, readings);
  const overallHealthScore = computeOverallHealth(sensorRisks, machine);
  const failureProbability = computeFailureProbability(sensorRisks, machine);
  const rul = estimateRemainingUsefulLife(sensorRisks, machine);
  const overallTrend = computeOverallTrend(sensorRisks);
  const anomalies = collectAnomalies(sensorRisks, machine);
  const status = scoreToStatus(overallHealthScore);
  const recommendations = generateRecommendations(sensorRisks, machine, overallHealthScore, failureProbability);
  const predictedFailure = failureProbability > 0.6
    ? `${Math.round(failureProbability * 100)}% chance of failure within ${Math.max(1, rul)} days`
    : null;

  const summary = generateSummary(machine, overallHealthScore, status, failureProbability, anomalies.length);

  return {
    machineId: machine.id,
    machineName: machine.name,
    overallHealthScore: Math.round(overallHealthScore),
    status,
    confidence: computeConfidence(readings.length),
    failureProbability: Math.round(failureProbability * 1000) / 1000,
    remainingUsefulLifeDays: Math.max(1, Math.round(rul)),
    trendDirection: overallTrend,
    sensorRisks,
    anomalies,
    recommendations,
    predictedFailure,
    summary,
    timestamp: new Date().toISOString(),
  };
}

// ===================== SENSOR RISK SCORING =====================

function computeSensorRisks(machine: Machine, readings: SensorReading[]): SensorRiskScore[] {
  return SENSOR_CONFIGS
    .filter((cfg) => machine.specifications[cfg.maxSpec] > 0) // skip sensors with 0 max (not applicable)
    .map((cfg) => {
      const values = readings.map((r) => r[cfg.key] as number);
      const maxSpec = machine.specifications[cfg.maxSpec];

      // Current value ratio to max spec
      const latest = values[values.length - 1] || 0;
      const ratio = latest / maxSpec;

      // Trend analysis
      const trend = linearRegressionTrend(values);

      // Anomaly detection (z-score)
      const anomalyDetected = detectAnomaly(values);

      // Risk score: weighted combination of ratio, trend, and anomaly
      let score = (1 - ratio) * 100; // base: how close to max (100 = far from max = healthy)
      if (trend === "degrading") score -= 15;
      if (trend === "improving") score += 5;
      if (anomalyDetected) score -= 20;

      score = Math.max(0, Math.min(100, score));

      return {
        sensor: cfg.label,
        score: Math.round(score),
        status: scoreToStatus(score),
        trend,
        anomalyDetected,
      };
    });
}

// ===================== TREND ANALYSIS (Linear Regression) =====================

function linearRegressionTrend(values: number[]): TrendDirection {
  if (values.length < 5) return "stable";

  const recent = values.slice(-20);
  const n = recent.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += recent[i];
    sumXY += i * recent[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const mean = sumY / n;
  const normalizedSlope = mean > 0 ? slope / mean : 0;

  if (normalizedSlope > 0.01) return "degrading";   // values increasing → sensors getting worse
  if (normalizedSlope < -0.01) return "improving";   // values decreasing → sensors getting better
  return "stable";
}

// ===================== ANOMALY DETECTION (Z-Score) =====================

function detectAnomaly(values: number[]): boolean {
  if (values.length < 10) return false;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return false;

  // Check last 3 readings for anomalies
  const recent = values.slice(-3);
  return recent.some((v) => Math.abs(v - mean) / stdDev > 2.0);
}

// ===================== FAILURE PROBABILITY =====================

function computeFailureProbability(sensorRisks: SensorRiskScore[], machine: Machine): number {
  const weightedRisk = sensorRisks.reduce((total, sr, idx) => {
    const config = SENSOR_CONFIGS.find((c) => c.label === sr.sensor);
    const weight = config?.weight || 0.1;
    const riskFactor = (100 - sr.score) / 100; // invert: low health score = high risk
    return total + riskFactor * weight;
  }, 0);

  // Adjust for machine criticality
  const critMultiplier = machine.criticality === "high" ? 1.3 : machine.criticality === "medium" ? 1.0 : 0.7;

  // Adjust for degrading trends
  const degradingCount = sensorRisks.filter((s) => s.trend === "degrading").length;
  const trendMultiplier = 1 + degradingCount * 0.1;

  // Adjust for anomalies
  const anomalyCount = sensorRisks.filter((s) => s.anomalyDetected).length;
  const anomalyMultiplier = 1 + anomalyCount * 0.15;

  const failureProb = weightedRisk * critMultiplier * trendMultiplier * anomalyMultiplier;
  return Math.max(0, Math.min(1, failureProb));
}

// ===================== REMAINING USEFUL LIFE =====================

function estimateRemainingUsefulLife(sensorRisks: SensorRiskScore[], machine: Machine): number {
  const avgHealth = sensorRisks.reduce((a, s) => a + s.score, 0) / sensorRisks.length;
  const degradingCount = sensorRisks.filter((s) => s.trend === "degrading").length;

  // Base RUL from health score (higher health = more days)
  let rul = (avgHealth / 100) * machine.maintenanceIntervalDays * 1.5;

  // Reduce for each degrading sensor
  rul -= degradingCount * 5;

  // Reduce for anomalies
  const anomalyCount = sensorRisks.filter((s) => s.anomalyDetected).length;
  rul -= anomalyCount * 10;

  // Minimum 1 day
  return Math.max(1, Math.round(rul));
}

// ===================== OVERALL HEALTH =====================

function computeOverallHealth(sensorRisks: SensorRiskScore[], machine: Machine): number {
  if (sensorRisks.length === 0) return 100;

  let totalWeight = 0;
  let weightedScore = 0;

  sensorRisks.forEach((sr) => {
    const config = SENSOR_CONFIGS.find((c) => c.label === sr.sensor);
    const weight = config?.weight || 0.1;
    weightedScore += sr.score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedScore / totalWeight : 50;
}

function computeOverallTrend(sensorRisks: SensorRiskScore[]): TrendDirection {
  const degrading = sensorRisks.filter((s) => s.trend === "degrading").length;
  const improving = sensorRisks.filter((s) => s.trend === "improving").length;

  if (degrading > improving + 1) return "degrading";
  if (improving > degrading + 1) return "improving";
  return "stable";
}

function computeConfidence(readingCount: number): number {
  // More data = higher confidence, capped at 0.97
  if (readingCount >= 50) return 0.97;
  if (readingCount >= 30) return 0.92;
  if (readingCount >= 15) return 0.85;
  if (readingCount >= 10) return 0.75;
  return 0.60;
}

// ===================== HELPERS =====================

function scoreToStatus(score: number): MachineStatus {
  if (score >= 70) return "healthy";
  if (score >= 40) return "warning";
  return "critical";
}

function collectAnomalies(sensorRisks: SensorRiskScore[], machine: Machine): string[] {
  const anomalies: string[] = [];

  sensorRisks.forEach((sr) => {
    if (sr.anomalyDetected) {
      anomalies.push(`Anomalous ${sr.sensor} readings detected — deviates significantly from normal operating range`);
    }
    if (sr.score < 30) {
      anomalies.push(`${sr.sensor} operating at critical levels (health: ${sr.score}%)`);
    }
    if (sr.trend === "degrading" && sr.score < 60) {
      anomalies.push(`${sr.sensor} showing degradation trend — continued decline expected`);
    }
  });

  return anomalies;
}

function generateSummary(
  machine: Machine,
  healthScore: number,
  status: MachineStatus,
  failureProb: number,
  anomalyCount: number
): string {
  if (status === "healthy" && anomalyCount === 0) {
    return `${machine.name} is operating within normal parameters. All sensors reporting healthy values with ${Math.round(healthScore)}% overall health score. No immediate action required.`;
  }
  if (status === "warning") {
    return `${machine.name} requires attention. Overall health at ${Math.round(healthScore)}% with ${anomalyCount} anomal${anomalyCount === 1 ? "y" : "ies"} detected. Failure probability: ${Math.round(failureProb * 100)}%. Schedule maintenance within the predicted window.`;
  }
  return `${machine.name} is in CRITICAL condition. Health score has dropped to ${Math.round(healthScore)}% with ${anomalyCount} active anomal${anomalyCount === 1 ? "y" : "ies"}. Failure probability: ${Math.round(failureProb * 100)}%. Immediate intervention recommended.`;
}

function generateRecommendations(
  sensorRisks: SensorRiskScore[],
  machine: Machine,
  healthScore: number,
  failureProb: number
): string[] {
  const recs: string[] = [];

  // Sensor-specific recommendations
  sensorRisks.forEach((sr) => {
    if (sr.sensor === "Temperature" && sr.score < 60) {
      recs.push("Check cooling system efficiency and clean heat exchangers");
    }
    if (sr.sensor === "Vibration" && sr.score < 60) {
      recs.push("Inspect bearings and alignment — excessive vibration indicates mechanical wear");
    }
    if (sr.sensor === "Power Consumption" && sr.score < 60) {
      recs.push("Review electrical connections and motor efficiency — elevated power draw detected");
    }
    if (sr.sensor === "Pressure" && sr.score < 60) {
      recs.push("Inspect hydraulic/pneumatic lines for leaks or blockages");
    }
    if (sr.sensor === "Humidity" && sr.score < 60) {
      recs.push("Check environmental controls — elevated humidity may cause corrosion");
    }
    if (sr.sensor === "RPM" && sr.score < 60) {
      recs.push("Inspect drive system — RPM deviations suggest belt or gear issues");
    }
    if (sr.anomalyDetected) {
      recs.push(`Investigate ${sr.sensor} anomaly — check sensor calibration and physical connections`);
    }
  });

  // General recommendations
  if (failureProb > 0.5) {
    recs.push("Schedule preventive maintenance immediately — high failure probability detected");
  }
  if (healthScore < 50) {
    recs.push("Consider taking machine offline for comprehensive inspection");
  }

  const degradingCount = sensorRisks.filter((s) => s.trend === "degrading").length;
  if (degradingCount >= 3) {
    recs.push("Multiple sensors showing degradation — systemic issue likely, perform full system diagnostic");
  }

  // Always add a positive recommendation if everything is fine
  if (recs.length === 0) {
    recs.push("Continue current maintenance schedule — all parameters within normal range");
    recs.push("Next scheduled inspection recommended as per maintenance interval");
  }

  return recs;
}

function createDefaultReport(machine: Machine, summary: string): AnalysisReport {
  return {
    machineId: machine.id,
    machineName: machine.name,
    overallHealthScore: 50,
    status: "warning",
    confidence: 0.3,
    failureProbability: 0,
    remainingUsefulLifeDays: machine.maintenanceIntervalDays,
    trendDirection: "stable",
    sensorRisks: [],
    anomalies: [],
    recommendations: ["Collect more sensor data before running analysis"],
    predictedFailure: null,
    summary,
    timestamp: new Date().toISOString(),
  };
}
