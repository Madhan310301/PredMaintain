import type {
  Machine,
  SensorReading,
  Alert,
  MaintenanceRecord,
  AnalysisReport,
} from "../shared/schema";

let machines: Machine[] = [];
let readings: SensorReading[] = [];
let alerts: Alert[] = [];
let maintenanceRecords: MaintenanceRecord[] = [];
let analysisHistory: AnalysisReport[] = [];

let machineIdCounter = 1;
let alertIdCounter = 1;
let maintenanceIdCounter = 1;

export const storage = {
  // ============ MACHINES ============
  async getMachines() {
    return machines;
  },
  async getMachine(id: number) {
    return machines.find((m) => m.id === id);
  },
  async createMachine(data: Omit<Machine, "id">) {
    const machine = { ...data, id: machineIdCounter++ };
    machines.push(machine);
    return machine;
  },
  async updateMachine(id: number, updates: Partial<Machine>) {
    const machine = machines.find((m) => m.id === id);
    if (!machine) return null;
    Object.assign(machine, updates);
    return machine;
  },

  // ============ READINGS ============
  async addReading(data: Omit<SensorReading, "timestamp">) {
    const reading: SensorReading = { ...data, timestamp: new Date().toISOString() };
    readings.push(reading);
    // Keep max 500 readings per machine to prevent memory issues
    const machineReadings = readings.filter((r) => r.machineId === data.machineId);
    if (machineReadings.length > 500) {
      readings = readings.filter((r) => r.machineId !== data.machineId)
        .concat(machineReadings.slice(-500));
    }
    return reading;
  },
  async getReadings(machineId: number, limit: number = 50) {
    return readings.filter((r) => r.machineId === machineId).slice(-limit);
  },

  // ============ ALERTS ============
  async getAlerts() {
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  async addAlert(data: Omit<Alert, "id">) {
    const alert: Alert = { ...data, id: alertIdCounter++ };
    alerts.push(alert);
    // Keep max 200 alerts
    if (alerts.length > 200) alerts = alerts.slice(-200);
    return alert;
  },
  async acknowledgeAlert(id: number) {
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.acknowledged = true;
    return alert;
  },

  // ============ MAINTENANCE ============
  async getMaintenanceRecords(machineId?: number) {
    const records = machineId
      ? maintenanceRecords.filter((m) => m.machineId === machineId)
      : maintenanceRecords;
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  async addMaintenanceRecord(data: Omit<MaintenanceRecord, "id">) {
    const record: MaintenanceRecord = { ...data, id: maintenanceIdCounter++ };
    maintenanceRecords.push(record);
    return record;
  },

  // ============ ANALYSIS HISTORY ============
  async getAnalysisHistory(machineId: number) {
    return analysisHistory
      .filter((a) => a.machineId === machineId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  async saveAnalysis(report: AnalysisReport) {
    analysisHistory.push(report);
    // Keep max 50 per machine
    const machineHistory = analysisHistory.filter((a) => a.machineId === report.machineId);
    if (machineHistory.length > 50) {
      analysisHistory = analysisHistory
        .filter((a) => a.machineId !== report.machineId)
        .concat(machineHistory.slice(-50));
    }
    return report;
  },
};

// ============ SEED DATA ============
export function seedData() {
  if (machines.length > 0) return;

  const seedMachines: Omit<Machine, "id">[] = [
    {
      name: "CNC Milling Station Alpha",
      type: "CNC Mill",
      location: "Building A, Bay 3",
      department: "CNC Machining",
      manufacturer: "Haas Automation",
      modelNumber: "VF-2SS",
      installDate: "2022-03-15",
      lastMaintenanceDate: "2025-12-01",
      maintenanceIntervalDays: 90,
      criticality: "high",
      status: "healthy",
      totalRuntimeHours: 12450,
      specifications: { maxTemp: 95, maxVibration: 4.5, maxCurrent: 30, maxPressure: 120, maxHumidity: 80, maxRpm: 12000 },
    },
    {
      name: "Hydraulic Press #2",
      type: "Press",
      location: "Building A, Bay 7",
      department: "Assembly",
      manufacturer: "Schuler Group",
      modelNumber: "MSD-800",
      installDate: "2021-08-22",
      lastMaintenanceDate: "2025-11-15",
      maintenanceIntervalDays: 60,
      criticality: "high",
      status: "warning",
      totalRuntimeHours: 18320,
      specifications: { maxTemp: 85, maxVibration: 3.0, maxCurrent: 45, maxPressure: 250, maxHumidity: 70, maxRpm: 0 },
    },
    {
      name: "Robotic Welding Arm R-7",
      type: "Robotic Arm",
      location: "Building B, Cell 2",
      department: "Welding",
      manufacturer: "FANUC",
      modelNumber: "ARC Mate 100iD",
      installDate: "2023-01-10",
      lastMaintenanceDate: "2026-01-20",
      maintenanceIntervalDays: 120,
      criticality: "high",
      status: "healthy",
      totalRuntimeHours: 8760,
      specifications: { maxTemp: 80, maxVibration: 2.5, maxCurrent: 35, maxPressure: 0, maxHumidity: 65, maxRpm: 8000 },
    },
    {
      name: "Conveyor Belt Line C",
      type: "Conveyor",
      location: "Building C, Main Line",
      department: "Packaging",
      manufacturer: "Siemens",
      modelNumber: "SIMATIC CB-200",
      installDate: "2020-06-01",
      lastMaintenanceDate: "2025-10-10",
      maintenanceIntervalDays: 45,
      criticality: "medium",
      status: "critical",
      totalRuntimeHours: 24100,
      specifications: { maxTemp: 60, maxVibration: 2.0, maxCurrent: 15, maxPressure: 0, maxHumidity: 85, maxRpm: 1800 },
    },
    {
      name: "Industrial Compressor K-12",
      type: "Compressor",
      location: "Building A, Utility Room",
      department: "Utilities",
      manufacturer: "Atlas Copco",
      modelNumber: "GA 75 VSD+",
      installDate: "2021-11-05",
      lastMaintenanceDate: "2025-12-20",
      maintenanceIntervalDays: 30,
      criticality: "medium",
      status: "healthy",
      totalRuntimeHours: 15680,
      specifications: { maxTemp: 105, maxVibration: 5.0, maxCurrent: 55, maxPressure: 180, maxHumidity: 90, maxRpm: 3600 },
    },
    {
      name: "Precision Lathe L-3",
      type: "Lathe",
      location: "Building A, Bay 1",
      department: "CNC Machining",
      manufacturer: "DMG Mori",
      modelNumber: "CLX 450",
      installDate: "2022-07-18",
      lastMaintenanceDate: "2026-01-05",
      maintenanceIntervalDays: 90,
      criticality: "medium",
      status: "healthy",
      totalRuntimeHours: 10200,
      specifications: { maxTemp: 90, maxVibration: 3.5, maxCurrent: 25, maxPressure: 100, maxHumidity: 75, maxRpm: 6000 },
    },
    {
      name: "Centrifugal Pump P-5",
      type: "Pump",
      location: "Building B, Basement",
      department: "Utilities",
      manufacturer: "Grundfos",
      modelNumber: "CR 95-3",
      installDate: "2019-04-20",
      lastMaintenanceDate: "2025-09-30",
      maintenanceIntervalDays: 60,
      criticality: "low",
      status: "warning",
      totalRuntimeHours: 28900,
      specifications: { maxTemp: 75, maxVibration: 6.0, maxCurrent: 20, maxPressure: 200, maxHumidity: 95, maxRpm: 3000 },
    },
    {
      name: "Arc Welder Station W-4",
      type: "Welder",
      location: "Building B, Bay 5",
      department: "Welding",
      manufacturer: "Lincoln Electric",
      modelNumber: "Power Wave S500",
      installDate: "2023-05-12",
      lastMaintenanceDate: "2026-02-10",
      maintenanceIntervalDays: 60,
      criticality: "medium",
      status: "healthy",
      totalRuntimeHours: 6540,
      specifications: { maxTemp: 110, maxVibration: 1.5, maxCurrent: 60, maxPressure: 50, maxHumidity: 70, maxRpm: 0 },
    },
  ];

  for (const m of seedMachines) {
    storage.createMachine(m);
  }

  // Seed maintenance records
  const technicians = ["John Rivera", "Maria Chen", "Arun Patel", "Sarah Kim", "Carlos Mendez"];
  const maintenanceDescriptions = [
    { desc: "Scheduled bearing replacement", type: "preventive" as const, parts: ["Bearing SKF 6205", "Seal kit"], cost: 450 },
    { desc: "Emergency motor repair", type: "corrective" as const, parts: ["Motor winding", "Capacitor"], cost: 2800 },
    { desc: "AI-predicted coolant system flush", type: "predictive" as const, parts: ["Coolant filter", "O-rings"], cost: 320 },
    { desc: "Lubrication system overhaul", type: "preventive" as const, parts: ["Lubricant 5L", "Grease fittings"], cost: 180 },
    { desc: "Vibration sensor calibration", type: "preventive" as const, parts: ["Calibration kit"], cost: 150 },
    { desc: "Hydraulic line replacement", type: "corrective" as const, parts: ["Hydraulic hose", "Fittings", "Fluid 10L"], cost: 1200 },
    { desc: "AI-detected belt tension adjustment", type: "predictive" as const, parts: ["Drive belt"], cost: 280 },
    { desc: "Electrical panel inspection", type: "preventive" as const, parts: ["Fuses", "Contact cleaners"], cost: 95 },
    { desc: "Gearbox oil change", type: "preventive" as const, parts: ["Gear oil 20L", "Drain plug gasket"], cost: 210 },
    { desc: "AI-predicted thermal paste renewal", type: "predictive" as const, parts: ["Thermal compound", "Cleaning solvent"], cost: 85 },
  ];

  const daysAgo = (d: number) => {
    const date = new Date();
    date.setDate(date.getDate() - d);
    return date.toISOString();
  };

  for (let i = 0; i < 15; i++) {
    const m = machines[i % machines.length];
    const md = maintenanceDescriptions[i % maintenanceDescriptions.length];
    storage.addMaintenanceRecord({
      machineId: m.id,
      machineName: m.name,
      type: md.type,
      description: md.desc,
      technician: technicians[i % technicians.length],
      cost: md.cost + Math.floor(Math.random() * 200),
      durationHours: 1 + Math.random() * 7,
      partsReplaced: md.parts,
      date: daysAgo(Math.floor(Math.random() * 90)),
    });
  }
}
