import { z } from "zod";

const machineInput = z.object({
  name: z.string(),
  type: z.string(),
  location: z.string(),
  department: z.string(),
  manufacturer: z.string(),
  modelNumber: z.string(),
  installDate: z.string(),
  lastMaintenanceDate: z.string(),
  maintenanceIntervalDays: z.number(),
  criticality: z.enum(["high", "medium", "low"]),
  status: z.enum(["healthy", "warning", "critical"]),
  totalRuntimeHours: z.number(),
  specifications: z.object({
    maxTemp: z.number(),
    maxVibration: z.number(),
    maxCurrent: z.number(),
    maxPressure: z.number(),
    maxHumidity: z.number(),
    maxRpm: z.number(),
  }),
});

const maintenanceInput = z.object({
  machineId: z.number(),
  machineName: z.string(),
  type: z.enum(["preventive", "corrective", "predictive"]),
  description: z.string(),
  technician: z.string(),
  cost: z.number(),
  durationHours: z.number(),
  partsReplaced: z.array(z.string()),
  date: z.string(),
});

const alertAcknowledge = z.object({
  acknowledged: z.boolean(),
});

export const api = {
  machines: {
    list: { path: "/api/machines" },
    get: { path: "/api/machines/:id" },
    create: { path: "/api/machines", input: machineInput },
    update: { path: "/api/machines/:id", input: machineInput.partial() },
    getReadings: { path: "/api/machines/:id/readings" },
    analyze: { path: "/api/machines/:id/analyze" },
    analysisHistory: { path: "/api/machines/:id/analysis-history" },
  },
  alerts: {
    list: { path: "/api/alerts" },
    acknowledge: { path: "/api/alerts/:id/acknowledge", input: alertAcknowledge },
  },
  maintenance: {
    list: { path: "/api/maintenance" },
    listByMachine: { path: "/api/machines/:id/maintenance" },
    create: { path: "/api/maintenance", input: maintenanceInput },
  },
  reports: {
    fleetSummary: { path: "/api/reports/fleet-summary" },
  },
  simulation: {
    toggle: { path: "/api/simulation/toggle" },
  },
};
