# PredMaintain — Industrial Condition Monitoring & Telemetry Platform

PredMaintain is a full-stack industrial condition-based maintenance (CBM) and telemetry monitoring system built with TypeScript, Node.js/Express, React, and Vite. It ingests multi-channel sensor telemetry across plant machinery, detects statistical process outliers, estimates degradation trajectories, and calculates prognostic Remaining Useful Life (RUL).

---

## System Architecture

```
[ Industrial Asset Sensors ]
  ├── Thermocouples (°C)
  ├── Accelerometers (Vibration mm/s)
  ├── Current Transformers (Amperes)
  ├── Pressure Transducers (PSI)
  ├── Encoders / Tachometers (RPM)
  └── Humidity Sensors (%RH)
            │
            ▼
[ Telemetry Ingestion Layer ] ──> [ Circular Buffer Storage (RAM) ]
            │
            ▼
[ Diagnostic & Prognostic Pipeline (ISO 13374) ]
  ├── 1. Robust Z-score Anomaly Detection (|Z| > 2.0)
  ├── 2. Ordinary Least Squares (OLS) Linear Drift Estimation
  ├── 3. Weighted Multi-Parameter Condition Indexing
  ├── 4. Asset Criticality-Weighted Stoppage Probability
  └── 5. Prognostic Remaining Useful Life (RUL) Forecaster
            │
            ▼
[ REST API / SSE Dispatch ]
            │
            ▼
[ Operations UI (React + Tailwind + Recharts) ]
  ├── Plant Floor Condition Matrix
  ├── Telemetry Exception Feeds
  ├── Spectral / Time-Series Channel Plots
  └── Automated Maintenance Work Order Logs
```

---

## Diagnostic Methodology

### 1. Robust Anomaly Detection (Statistical Process Control)
For each sensor channel telemetry vector $X = \{x_1, x_2, \dots, x_n\}$, the engine computes the running arithmetic mean $\mu$ and sample standard deviation $\sigma$:

$$\mu = \frac{1}{n} \sum_{i=1}^{n} x_i, \quad \sigma = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2}$$

An outlier exception is flagged if the standardized score of recent observations satisfies:

$$|Z_t| = \left| \frac{x_t - \mu}{\sigma} \right| > 2.0$$

### 2. Sensor Drift & Trajectory Modeling
Sensor trends are estimated across a rolling 20-sample window using Ordinary Least Squares (OLS) regression:

$$\text{Slope } (\beta) = \frac{n \sum (t \cdot x_t) - \sum t \sum x_t}{n \sum t^2 - (\sum t)^2}$$

Normalized against the channel baseline mean, slopes with $\frac{\beta}{\mu} > 0.01$ indicate active degradation, whereas values with $\frac{\beta}{\mu} < -0.01$ indicate recovery or stabilization post-servicing.

### 3. Composite Condition Index (CI)
Asset health is modeled as a weighted aggregate across active sensor channels:

$$\text{CI} = \frac{\sum_{i=1}^{k} w_i \cdot S_i}{\sum_{i=1}^{k} w_i}$$

Where $w_i$ denotes channel importance weights (Temperature: 0.25, Vibration: 0.25, Current: 0.20, Pressure: 0.15, RPM: 0.10, Humidity: 0.05), and $S_i$ represents the normalized channel safety margin relative to manufacturer tolerance limits.

---

## Monitored Assets & Factory Coverage

The platform ships preconfigured for 8 industrial assets distributed across 5 plant departments:

| Asset Name | Asset Type | Department | Primary Criticality | Max Limits |
|---|---|---|---|---|
| **CNC Milling Station Alpha** | CNC Mill | CNC Machining | High | 95°C, 4.5mm/s, 30A, 12000 RPM |
| **Hydraulic Press #2** | Stamping Press | Assembly | High | 85°C, 3.0mm/s, 45A, 250 PSI |
| **Robotic Welding Arm R-7** | Articulated Arm | Welding | High | 80°C, 2.5mm/s, 35A, 8000 RPM |
| **Conveyor Belt Line C** | Drive Conveyor | Packaging | Medium | 60°C, 2.0mm/s, 15A, 1800 RPM |
| **Industrial Compressor K-12** | Screw Compressor | Utilities | Medium | 105°C, 5.0mm/s, 55A, 180 PSI |
| **Precision Lathe L-3** | Turning Center | CNC Machining | Medium | 90°C, 3.5mm/s, 25A, 6000 RPM |
| **Centrifugal Pump P-5** | Fluid Pump | Utilities | Low | 75°C, 6.0mm/s, 20A, 200 PSI |
| **Arc Welder Station W-4** | Power Supply | Welding | Medium | 110°C, 1.5mm/s, 60A |

---

## Tech Stack

* **Runtime:** Node.js (>= 20.x), TypeScript 5.6
* **Backend:** Express 5.0, tsx execution engine
* **Frontend:** React 18, Vite 7, Tailwind CSS 3.4
* **UI & Visualization:** Radix UI primitives, Recharts, Framer Motion, Lucide
* **State Management:** TanStack React Query v5

---

## Getting Started

### Prerequisites
* Node.js 20+
* npm 10+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd machine-health-watcher

# Install dependencies
npm install
```

### Running Locally

```bash
# Run the development server (Express API + Vite Dev Server on port 5000)
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

### Type Verification & Production Build

```bash
# Type check TypeScript codebase
npm run check

# Create production client bundle
npm run build
```

---

## API Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/machines` | GET | List all monitored machinery with specifications |
| `/api/machines/:id` | GET | Retrieve metadata and operational status for an asset |
| `/api/machines/:id/readings` | GET | Fetch rolling telemetry points (query `limit`, default: 50) |
| `/api/machines/:id/analyze` | POST | Trigger diagnostic analysis and evaluate condition |
| `/api/alerts` | GET | List real-time condition alerts and warnings |
| `/api/alerts/:id/acknowledge`| POST | Acknowledge a specific alert |
| `/api/maintenance` | GET / POST | Query or append maintenance records & work orders |
| `/api/reports/fleet-summary` | GET | Fleet availability, cost metrics, and department scores |
| `/api/simulation/status` | GET | Ingestion pipeline streaming status |
| `/api/simulation/toggle` | POST | Pause or resume telemetry streaming |

---

## License

MIT License. Designed for industrial condition monitoring and reliability engineering evaluations.
