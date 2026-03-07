# 🏭 PredMaintain — AI-Powered Predictive Maintenance Platform

**PredMaintain** is an intelligent, real-time machine health monitoring and predictive maintenance platform designed for modern factories. Built with a full-stack TypeScript architecture, it leverages machine learning algorithms to predict equipment failures before they happen — minimizing unplanned downtime, reducing maintenance costs, and extending machine lifespan.

## 🧠 What It Does

The platform continuously monitors **8 industrial machines** across 5 factory departments (CNC Machining, Assembly, Welding, Packaging, Utilities) using **6 sensor streams**: Temperature, Vibration, Pressure, Power Consumption, Humidity, and RPM. A custom-built **ML engine** processes this telemetry data in real-time to perform:

- **Anomaly Detection** using Z-score statistical analysis to flag abnormal sensor readings
- **Trend Analysis** via linear regression, identifying whether a machine is degrading, stable, or improving
- **Failure Probability Calculation** with multi-factor weighted risk scoring based on sensor health, machine criticality, and maintenance history
- **Remaining Useful Life (RUL) Estimation** to forecast when a machine is likely to fail
- **AI-Driven Recommendations** that generate actionable maintenance suggestions based on detected risks

## 📊 Key Features

The application provides **7 interactive pages**: a real-time Dashboard with a fleet health heatmap, live alerts feed, and predictive failure timeline; a Machine Detail view with animated health gauges, risk radar charts, and 6 live sensor charts with threshold lines; dedicated Analytics, Maintenance, Alerts, and Reports pages for comprehensive fleet-wide insights.

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, ShadCN/Radix UI  
**Backend:** Node.js, Express, Custom ML Engine  
**Data:** In-memory storage with smart simulation (degradation patterns, anomaly injection, cyclic variation)

## 🚀 Getting Started

```bash
npm install
npm run dev
# App runs at http://localhost:5000
```

## 📸 Screenshots

| Dashboard | Machine Detail |
|-----------|---------------|
| Fleet health heatmap, live alerts, predictive timeline | 6 sensor charts, AI diagnostic, health gauge, risk radar |

## 📄 License

This project is developed for educational and demonstration purposes.
