export type MachineStatus = "healthy" | "warning" | "critical";
export type MachineCriticality = "high" | "medium" | "low";
export type MaintenanceType = "preventive" | "corrective" | "predictive";
export type AlertSeverity = "info" | "warning" | "critical";
export type TrendDirection = "improving" | "stable" | "degrading";

export type Machine = {
  id: number;
  name: string;
  type: string;
  location: string;
  department: string;
  manufacturer: string;
  modelNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  maintenanceIntervalDays: number;
  criticality: MachineCriticality;
  status: MachineStatus;
  totalRuntimeHours: number;
  specifications: {
    maxTemp: number;
    maxVibration: number;
    maxCurrent: number;
    maxPressure: number;
    maxHumidity: number;
    maxRpm: number;
  };
};

export type SensorReading = {
  machineId: number;
  temperature: number;
  vibration: number;
  current: number;
  pressure: number;
  humidity: number;
  rpm: number;
  status: MachineStatus;
  timestamp: string;
};

export type Alert = {
  id: number;
  machineId: number;
  machineName: string;
  severity: AlertSeverity;
  message: string;
  sensor: string;
  value: number;
  threshold: number;
  acknowledged: boolean;
  timestamp: string;
};

export type MaintenanceRecord = {
  id: number;
  machineId: number;
  machineName: string;
  type: MaintenanceType;
  description: string;
  technician: string;
  cost: number;
  durationHours: number;
  partsReplaced: string[];
  date: string;
};

export type SensorRiskScore = {
  sensor: string;
  score: number;       // 0-100
  status: MachineStatus;
  trend: TrendDirection;
  anomalyDetected: boolean;
};

export type AnalysisReport = {
  machineId: number;
  machineName: string;
  overallHealthScore: number;     // 0-100
  status: MachineStatus;
  confidence: number;             // 0-1
  failureProbability: number;     // 0-1
  remainingUsefulLifeDays: number;
  trendDirection: TrendDirection;
  sensorRisks: SensorRiskScore[];
  anomalies: string[];
  recommendations: string[];
  predictedFailure: string | null;
  summary: string;
  timestamp: string;
};

export type FleetSummary = {
  totalMachines: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  averageHealthScore: number;
  totalAlerts: number;
  criticalAlerts: number;
  predictedFailuresThisWeek: number;
  totalMaintenanceCost: number;
  averageUptime: number;
  departmentHealth: { department: string; healthScore: number; machineCount: number }[];
};
