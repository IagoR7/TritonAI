# 🦈 **Sharknado — Repository Documentation**

> **Stack:** FastAPI (backend) · React + Vite + Mapbox GL (frontend) · ML Notebooks (Random Forest and near real-time predictions) · PostgreSQL (planned persistence).
> **Monorepo** with three root folders: `Fastapi/`, `MachileLearning/`, and `vite-project/`.

---

## 📘 Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [How to Run](#how-to-run)
4. [Frontend (vite-project)](#frontend-vite-project)
5. [Backend (FastAPI)](#backend-fastapi)
6. [Machine Learning (MachileLearning)](#machine-learning-machilelearning)
7. [Data Flow & Integration](#data-flow--integration)
8. [Environment Variables](#environment-variables)
9. [API (Contract)](#api-contract)
10. [Best Practices & Security](#best-practices--security)
11. [Roadmap](#roadmap)
12. [Credits & License](#credits--license)

---

## 🌊 Overview

**Goal:** Map shark foraging hotspots based on oceanographic variables (e.g., chlorophyll, fronts, eddies) and make this data accessible via **API** and **web map**.

* **Frontend:** SPA (React + Vite + Mapbox GL) that displays hotspots and applies filters.
* **Backend:** FastAPI service with database, ORM models, schemas (Pydantic), and routes. The `/hotspots` route serves the predicted points.
* **ML:** Random Forest notebooks, the model artifact `modelo_tubarao_v1.pkl`, and near real-time data ingestion routines (e.g., ERDDAP/GIBS).

> The repository may include mock data (e.g., `mockHotspots.json`) and helper scripts for local development and data ingestion.

---

## 🗂 Repository Structure

```
Sharknado/
├─ Fastapi/                 # API and data integration (NASA GIBS, DB)
│  ├─ core/                 # database connection/client (PostgreSQL/SQLAlchemy)
│  ├─ models/               # ORM models
│  ├─ schemas/              # Pydantic schemas (input/output)
│  ├─ routers/              # endpoints (e.g., /hotspots, /health)
│  └─ gibs.py               # FastAPI entry point (app)
│
├─ MachileLearning/         # notebooks, data, and model artifacts
│  ├─ RandomForestSharknados.ipynb
│  ├─ PrevisõesTempoReal.ipynb
│  ├─ dataset_enriquecido.csv
│  └─ modelo_tubarao_v1.pkl
│
└─ vite-project/            # React + Vite + Mapbox GL SPA
   ├─ src/
   │  ├─ components/        # Map.jsx, Sidebar.jsx, etc.
   │  ├─ data/mockHotspots.json
   │  └─ main.jsx, App.jsx
   ├─ index.html
   └─ package.json
```

> File names may vary slightly; adjust based on your actual repository structure.

---

## ⚙️ How to Run

### Requirements

* **Node.js 18+** (frontend)
* **Python 3.10+** (backend/ML)
* **PostgreSQL 14+** (database)
* **Mapbox account** (token required)

### 1) Frontend (Vite)

```bash
cd vite-project
npm install
# create .env.local with:
# VITE_MAPBOX_TOKEN=your_token
# VITE_API_BASE=http://localhost:8000
npm run dev  # open http://localhost:5173
```

### 2) Backend (FastAPI)

```bash
cd Fastapi
python -m venv .venv && source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
# or manually:
# pip install fastapi uvicorn pydantic sqlalchemy psycopg2-binary python-dotenv requests

# create .env with:
# DATABASE_URL=postgresql+psycopg2://user:password@host:5432/sharknado
# ALLOWED_ORIGINS=http://localhost:5173
# MODEL_PATH=../MachileLearning/modelo_tubarao_v1.pkl
# GIBS_BASE=https://gibs.earthdata.nasa.gov/wmts
# ERDDAP_BASE=https://<erddap-server>

uvicorn gibs:app --reload
# Swagger/OpenAPI: http://localhost:8000/docs
```

### 3) ML Notebooks

Open the notebooks in `MachileLearning/`:

* **RandomForestSharknados.ipynb** — model training and export (`modelo_tubarao_v1.pkl`) from `dataset_enriquecido.csv`.
* **PrevisõesTempoReal.ipynb** — fetches real-time data (e.g., ERDDAP) and runs predictions for hotspot points.

**Integration:** predictions are saved into PostgreSQL and served via `GET /hotspots`.

---

## 💻 Frontend (vite-project)

### Components

* **Map.jsx** — initializes Mapbox GL, loads hotspot data (mock or API), and renders layers.
* **Sidebar.jsx** — simple filters (date, region).
* **.env.local** — stores `VITE_MAPBOX_TOKEN` and `VITE_API_BASE`.

### Tips

* Use **clustering** for dense point visualization.
* Add **legends** (color scale by score) and **tooltips** with metadata (e.g., `source`, `timestamp`).

---

## 🧠 Backend (FastAPI)

### Suggested Structure

* `core/database.py` — SQLAlchemy session/engine setup with `DATABASE_URL`.
* `models/hotspot.py` — defines `hotspots` table (`id`, `lat`, `lon`, `score`, `timestamp`, `source`).
* `schemas/hotspot.py` — Pydantic models (`HotspotIn`, `HotspotOut`).
* `routers/hotspots.py` — defines `GET /hotspots` and optional `POST /hotspots`.
* `gibs.py` — FastAPI app setup, CORS config, and router registration.

### SQL Example

```sql
CREATE TABLE IF NOT EXISTS hotspots (
  id TEXT PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT,
  extra JSONB
);
CREATE INDEX IF NOT EXISTS idx_hotspots_time ON hotspots (timestamp);
CREATE INDEX IF NOT EXISTS idx_hotspots_geom ON hotspots (lat, lon);
```

---

## 🤖 Machine Learning (MachileLearning)

* **Baseline:** Random Forest (interpretable, fast, robust) trained on environmental features (chlorophyll, SST, eddy metrics, etc.).
* **Artifacts:** `modelo_tubarao_v1.pkl`, `dataset_enriquecido.csv`.
* **Production:** convert notebook to CLI script (e.g., `python ml/predict.py --date 2025-10-05`) and schedule with cron.

**Best Practices**

* Time-blocked and spatial cross-validation.
* Metrics: AUC/PR-AUC, Brier Score, calibration.
* SHAP values for variable influence interpretation.

---

## 🔄 Data Flow & Integration

1. **Acquisition:** Satellite data from NASA (PACE/MODIS for chlorophyll, SWOT for altimetry, SST).
2. **Model:** Generates probability `score` per region.
3. **Storage:** Writes to PostgreSQL (`hotspots` table).
4. **API:** `GET /hotspots` provides JSON with filters (region/time).
5. **Frontend:** Renders map layers using API data.

---

## 🔐 Environment Variables

### Frontend (`vite-project/.env.local`)

```ini
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_API_BASE=http://localhost:8000
```

### Backend (`Fastapi/.env`)

```ini
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/sharknado
ALLOWED_ORIGINS=http://localhost:5173
MODEL_PATH=../MachileLearning/modelo_tubarao_v1.pkl
GIBS_BASE=https://gibs.earthdata.nasa.gov/wmts
ERDDAP_BASE=https://<erddap-server>
LOG_LEVEL=INFO
```

---

## 🧭 API (Contract)

### `GET /hotspots`

Returns a paginated and filterable list of hotspot predictions.

**Query Parameters**

* `bbox` (minLon,minLat,maxLon,maxLat) or `lat`, `lon`, `radius_km`
* `since` (ISO-8601 timestamp)
* `limit` (default 100)

**Response Example**

```json
{
  "items": [
    {
      "id": "hs_2025_0001",
      "lat": -22.97,
      "lon": -43.18,
      "score": 0.82,
      "timestamp": "2025-10-04T12:00:00Z",
      "source": "modelo_tubarao_v1",
      "layers": {
        "chl_a": 0.45,
        "sst": 21.6,
        "eddy": "anticyclonic"
      }
    }
  ],
  "total": 1
}
```

### `POST /hotspots` (optional)

Accepts ML predictions for ingestion into the database.

### `GET /health`

Simple service check route.

---

## 🧩 Best Practices & Security

* **Secrets:** never hardcode — use `.env` and example templates.
* **CORS:** restrict origins (e.g., `http://localhost:5173` in dev).
* **Conservation Safety:** obfuscate or delay coordinates of sensitive species.
* **Reproducibility:** pin versions in `requirements.txt` and `package.json`.

---

## 🚀 Roadmap

* [ ] Backend: publish routers/schemas/models; add Dockerfile and docker-compose.
* [ ] ML: convert notebook to CLI; schedule periodic jobs; store results in PostgreSQL.
* [ ] Frontend: replace `mockHotspots.json` with live API data; add clustering and legend.
* [ ] Data: integrate PACE/MODIS (chlorophyll/PFTs) and SWOT (eddies) APIs.
* [ ] Docs: add `Fastapi/README.md`, `.env.example`, and `vite-project/.env.local.example`.

---

## 🧾 Credits & License

* Contributors: update with repository members’ names.
* **License:** Add `LICENSE` file (MIT or Apache-2.0 recommended).

---

## 📚 Technical References

* NASA Missions: **PACE** (phytoplankton), **MODIS-Aqua** (chlorophyll), **SWOT** (altimetry/eddies).
* Research on shark foraging and ocean fronts (2018–2019 studies).

---

### 🪶 Usage

* Place this `README.md` in the **repository root**.
* Update filenames and routes to match your implementation.
* Optionally, create `Fastapi/README.md` and `vite-project/README.md` for detailed submodule docs.

---