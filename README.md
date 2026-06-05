<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=PredMaintain&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Predict.%20Prevent.%20Protect.%20Industrial%20Machinery%20Intelligence.&descAlignY=58&descSize=17&animation=fadeIn" width="100%"/>

<br/>

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-Latest-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![Flask](https://img.shields.io/badge/Flask%2FFastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-Streaming-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-00e676?style=for-the-badge)
![Domain](https://img.shields.io/badge/Domain-Industrial%20IoT-7c4dff?style=for-the-badge)

<br/>

> **From raw sensor telemetry to precision maintenance intelligence — in under 200ms.**
> PredMaintain is an end-to-end ML-powered predictive maintenance system that monitors industrial machinery health, classifies faults, detects anomalies, and forecasts Remaining Useful Life (RUL) in real time.

<br/>

[![Explore Repo](https://img.shields.io/badge/⚡%20Explore%20Repo-7c4dff?style=for-the-badge&logoColor=white)](https://github.com/Madhan310301/PredMaintain)
[![View Report](https://img.shields.io/badge/📄%20Tech%20Report-1a1a2e?style=for-the-badge)](https://github.com/Madhan310301/PredMaintain/blob/main/report.pdf)
[![Star on GitHub](https://img.shields.io/github/stars/Madhan310301/PredMaintain?style=for-the-badge&logo=github&color=ffbd2e)](https://github.com/Madhan310301/PredMaintain/stargazers)

</div>

---

## ⚡ System at a Glance

<div align="center">

| 🎯 Fault Classification | 📉 RUL Prediction MAE | 🔍 Anomaly Precision | ⏱️ Inference Latency |
|:-:|:-:|:-:|:-:|
| **93 – 97%** | **< 10 hrs** | **> 91%** | **< 200 ms** |

| 🏭 Machines Monitored | ⚙️ Fault Types Supported | 📡 Sampling Rate | 🔄 Dashboard Refresh |
|:-:|:-:|:-:|:-:|
| **Up to 500** | **6 Categories** | **25,600 Hz (vibration)** | **5-second live feed** |

</div>

---

## 🧠 The Problem We Solve

Industrial machinery represents enormous capital. Traditional maintenance is broken in two ways:

```
❌  REACTIVE  →  Machine breaks → Emergency repair → Massive downtime + cost
❌  SCHEDULED →  Replace parts by calendar → Wasteful, doesn't reflect actual health
✅  PREDICTIVE →  Monitor in real time → Act before failure → Targeted, cost-effective
```

PredMaintain uses a **multi-model ML ensemble** to spot degradation patterns invisible to human operators — giving maintenance teams time to act with surgical precision.

---

## ✨ Core Capabilities

### 🔴 Real-Time Health Monitoring
Continuously ingests multi-sensor data streams (vibration, temperature, pressure, current, acoustic emission) without operational interruption. Health status is surfaced in real time through a live Grafana dashboard.

### 🟠 Fault Classification
A supervised classification ensemble (Random Forest + SVM) categorises machine state across four operational levels:

```
[ NORMAL ] ──▶ [ DEGRADED ] ──▶ [ WARNING ] ──▶ [ CRITICAL FAULT ]
```

### 🟡 Anomaly Detection
Unsupervised models — Isolation Forest and a deep Autoencoder — detect early-stage deviations from normal operating envelopes **before labelled fault patterns emerge**.

### 🟢 Remaining Useful Life (RUL) Prediction
LSTM networks and XGBoost regression forecast exactly how many operational hours remain before intervention is required — enabling precisely-timed, cost-minimised maintenance scheduling.

### 🔵 Explainable Root Cause Analysis
SHAP (SHapley Additive exPlanations) generates per-prediction feature contribution scores, letting maintenance engineers pinpoint **which sensor or condition is driving the fault** — not just that a fault exists.

### 🟣 Unified Machine Health Index (MHI)
All model outputs are fused into a single normalised score: **0 (critical fault) → 100 (optimal health)** — using a weighted ensemble strategy calibrated against historical failure outcomes.

---

## 🤖 ML Model Architecture

| Algorithm | Role in System | Why It's Used |
|---|---|---|
| **Random Forest** | Multi-class fault classification (Normal / Degraded / Warning / Fault) | Robust on tabular sensor data; provides feature importance for explainability |
| **SVM** | Binary healthy vs. faulty detection via optimal hyperplane | Effective in high-dimensional feature spaces; strong generalisation on small labelled sets |
| **LSTM** | Time-series RUL prediction & temporal fault pattern recognition | Captures long-range dependencies in multivariate degradation sequences |
| **Isolation Forest** | Unsupervised anomaly detection on unlabelled data | Computationally efficient at isolating rare anomalies in high-dimensional streams |
| **Autoencoder (DNN)** | Reconstruction-error-based anomaly detection | Requires only normal-class training data; ideal when fault labels are scarce |
| **XGBoost Regression** | Quantitative health score & RUL estimation in hours | Low prediction error on structured heterogeneous sensor datasets |
| **PCA** | Dimensionality reduction & noise suppression before model input | Removes correlated sensor redundancy; reduces overfitting risk |
| **KNN** | Baseline classifier & historical case similarity matching | Interpretable benchmark to validate complex model outputs |

---

## 🔄 System Workflow

```
╔══════════════════════════════════════════════════════════════════════╗
║                     PREDMAINTAIN PIPELINE                           ║
╠══════════════╦═══════════════════════════════════════════════════════╣
║   STAGE 1    ║  📡 Sensor Acquisition & Streaming                   ║
║              ║  Vibration · Temperature · Pressure · Current · Acoustic
║              ║  → Apache Kafka → InfluxDB                           ║
╠══════════════╬═══════════════════════════════════════════════════════╣
║   STAGE 2    ║  ⚙️  Signal Processing & Feature Engineering          ║
║              ║  FFT · Bandpass Filter · tsfresh · PCA               ║
║              ║  → Engineered Feature Matrix                         ║
╠══════════════╬═══════════════════════════════════════════════════════╣
║   STAGE 3    ║  🧠 ML Model Ensemble Inference                      ║
║              ║  RF + SVM (Classification) · IF + AE (Anomaly)      ║
║              ║  XGBoost + LSTM (RUL) · SHAP (Explainability)       ║
╠══════════════╬═══════════════════════════════════════════════════════╣
║   STAGE 4    ║  📊 Health Score Aggregation & Alert Dispatch        ║
║              ║  Weighted Ensemble → Machine Health Index (0–100)   ║
║              ║  → Celery + Redis → Email / SMS / In-Platform Alert  ║
╠══════════════╬═══════════════════════════════════════════════════════╣
║   STAGE 5    ║  📺 Dashboard Visualisation & Report Generation       ║
║              ║  Grafana Live Dashboard · Streamlit Reports          ║
║              ║  SHAP Waterfall Plots · PDF Health Reports on Demand ║
╚══════════════╩═══════════════════════════════════════════════════════╝
```

---

## 🛠️ Technology Stack

<div align="center">

### 🐍 Core Language
![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=flat-square&logo=python&logoColor=white)

### 🤖 ML & Deep Learning
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow_2.x-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Keras](https://img.shields.io/badge/Keras-D00000?style=flat-square&logo=keras&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-0073B7?style=flat-square&logo=xgboost&logoColor=white)
![SHAP](https://img.shields.io/badge/SHAP-Explainability-8A2BE2?style=flat-square)

### 📡 Signal Processing & Feature Engineering
![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?style=flat-square&logo=scipy&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![tsfresh](https://img.shields.io/badge/tsfresh-Time%20Series-green?style=flat-square)

### 🌊 Streaming & Storage
![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)
![InfluxDB](https://img.shields.io/badge/InfluxDB-22ADF6?style=flat-square&logo=influxdb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

### ⚙️ Backend & API
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-37814A?style=flat-square&logo=celery&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)

### 📊 Monitoring & Visualisation
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=flat-square&logo=grafana&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white)

### ☁️ DevOps & Deployment
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_IoT_Core-FF9900?style=flat-square&logo=amazonaws&logoColor=white)

</div>

---

## 📂 Project Structure

```
PredMaintain/
│
├── data/
│   ├── raw/                    # Raw sensor CSV / SCADA exports
│   ├── processed/              # Windowed, filtered feature matrices
│   └── datasets/               # NASA CMAPSS · CWRU Bearing Fault
│
├── notebooks/
│   ├── 01_eda.ipynb            # Exploratory data analysis
│   ├── 02_feature_engineering.ipynb
│   ├── 03_model_training.ipynb
│   └── 04_evaluation.ipynb
│
├── src/
│   ├── ingestion/
│   │   ├── kafka_consumer.py   # Real-time Kafka stream consumer
│   │   └── batch_loader.py     # CSV / SCADA batch ingestion
│   │
│   ├── processing/
│   │   ├── signal_processing.py   # FFT, bandpass, envelope analysis
│   │   ├── feature_extraction.py  # tsfresh + custom features
│   │   └── pca_reducer.py         # Dimensionality reduction
│   │
│   ├── models/
│   │   ├── classifier.py          # Random Forest · SVM · KNN
│   │   ├── anomaly_detector.py    # Isolation Forest · Autoencoder
│   │   ├── rul_predictor.py       # XGBoost · LSTM
│   │   └── health_index.py        # MHI weighted ensemble fusion
│   │
│   ├── explainability/
│   │   └── shap_analysis.py       # SHAP waterfall & summary plots
│   │
│   ├── api/
│   │   ├── app.py                 # Flask / FastAPI entry point
│   │   └── routes/                # Inference · health · alert endpoints
│   │
│   └── alerts/
│       └── dispatcher.py          # Celery + Redis alert task queue
│
├── dashboard/
│   ├── grafana/                # Dashboard JSON configs
│   └── streamlit_app.py        # Interactive health report UI
│
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Python >= 3.11
Docker & Docker Compose
Apache Kafka (or use Docker Compose setup)
InfluxDB & PostgreSQL instances
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Madhan310301/PredMaintain.git
cd PredMaintain

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# 3. Install all dependencies
pip install -r requirements.txt
```

### Environment Setup

```bash
# Create a .env file in the root directory
DATABASE_URL=postgresql://user:password@localhost:5432/predmaintain
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-influxdb-token
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
REDIS_URL=redis://localhost:6379
```

### Running with Docker (Recommended)

```bash
# Spin up all services: Kafka, InfluxDB, PostgreSQL, Redis, Grafana
docker-compose up -d

# Start the API server
python src/api/app.py

# Start the Streamlit dashboard
streamlit run dashboard/streamlit_app.py
```

### Running Manually

```bash
# Terminal 1 — Start the API backend
python src/api/app.py

# Terminal 2 — Start Celery alert worker
celery -A src.alerts.dispatcher worker --loglevel=info

# Terminal 3 — Launch Streamlit UI
streamlit run dashboard/streamlit_app.py
```

---

## 📊 Datasets Used

| Dataset | Source | Used For |
|---|---|---|
| **NASA CMAPSS Turbofan** | NASA Prognostics Data Repository | RUL prediction model training & validation |
| **CWRU Bearing Fault** | Case Western Reserve University | Fault classification model training |
| **Industrial IoT Sensors** | Custom sensor deployment | Real-time health monitoring |

---

## 🔮 Future Roadmap

```
✅  v1.0  Multi-model ensemble · Real-time Grafana dashboard · SHAP explainability
🔄  v1.1  Digital twin simulation for synthetic fault data augmentation
🔄  v1.2  Federated learning for multi-site model training (privacy-preserving)
🔄  v1.3  Edge AI deployment on embedded IoT hardware (TFLite / ONNX)
🔄  v2.0  Foundation model-based anomaly detection (pre-trained time-series transformers)
```

--

<div align="center">

**Built with 🔧 by [Madhan Kumar T](https://github.com/Madhan310301)**
*B.Tech Computer Science Engineering · BIHER, Chennai*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=fadeIn" width="100%"/>

</div>
