# AI-based Medical Laboratory System

﻿# AI-MedLab project

A responsive React medical portal with a Node.js/Express API and a separate FastAPI model service. It reproduces the main flows in the supplied project reference: home, healthcare center, seven disease-screening modules, doctor directory/profile, services, and appointment checkout.

> **Medical-use notice:** The bundled models are demonstrations and are not presented as medically validated. Model outputs are raw screening results, not diagnoses or treatment recommendations. Use a qualified clinician for medical decisions.

## Architecture

- `frontend/`: React, Vite, React Router, Tailwind CSS.
- `backend/`: Express API and MongoDB models/authentication.
- `backend/ai_service/`: FastAPI service for five numeric models, two image models, and symptom screening. Express forwards model requests to it.
- `backend/aimodels/`: bundled model files required for inference.

## Requirements

- Node.js 20 or later and npm.
- Python with packages from `backend/requirements.txt` (TensorFlow support is platform/Python-version dependent).
- MongoDB reachable from the backend.

## Local setup

### 1. Install JavaScript dependencies

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` (do not commit it) with your own values:

```dotenv
MONGO_URL=mongodb://127.0.0.1:27017/aimedlab
JWT_SECRET_KEY=replace-with-a-long-random-secret
PORT=8000
AI_SERVICE_URL=http://127.0.0.1:8001
CLIENT_SITE_URL=http://localhost:5173
# Optional: set a test key for Stripe checkout; omit for no-charge demo mode.
STRIPE_SECRET_KEY=sk_test_replace_with_your_test_key
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

For development, replace the Stripe placeholder with your own test key. Do not use a production secret in local testing. If Stripe is not configured, checkout is clearly marked as a demo and records no paid booking.

### 3. Install Python dependencies

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If TensorFlow is unavailable for your Python version or platform, use a Python version supported by the TensorFlow release you install. Do not continue with the image service until `tf_keras` can load the bundled `.h5` models.

### 4. Run the three services

Open three terminals from the project directory:

```powershell
# Terminal 1 — FastAPI model service
cd backend
.venv\Scripts\Activate.ps1
python -m uvicorn ai_service.main:app --host 127.0.0.1 --port 8001
```

```powershell
# Terminal 2 — Express API (MongoDB must be reachable)
cd backend
npm start
```

```powershell
# Terminal 3 — React/Vite frontend
cd frontend
npm run dev
```

Open `http://localhost:5173`. FastAPI health is at `http://127.0.0.1:8001/health`; through Express, use `http://localhost:8000/api/v1/ai-health`. Swagger docs are available at `http://127.0.0.1:8001/docs` during development.

## Model API

Express preserves the frontend endpoints under `/api/v1`:

- `POST /diabetes`, `/heart`, `/kidney`, `/liver`, `/breast-cancer` with `{ "data": { ...model fields... } }`.
- `POST /predict-malaria` and `/predict-pneumonia` with an `image` multipart upload (PNG, JPEG, or WebP; maximum 10 MB).
- `POST /symptoms` with `{ "data": ["headache", "high fever"] }` or a comma-separated symptom string.

FastAPI also provides the corresponding endpoints under `/api/v1/predict/...`, `/api/v1/predict-image/...`, and `/api/v1/predict-symptoms`. Invalid fields/uploads are rejected; missing/unavailable models return errors rather than invented prediction values.

## Payment behavior

The payment review page summarizes the selected doctor and redirects to Stripe-hosted checkout when configured; card details are not collected or stored by this app. A successful Stripe return is confirmed server-side against Stripe before the booking is marked paid. Without a Stripe secret key, the app offers a visibly labeled demo path that does not charge money or mark the booking paid.

## Validation

```powershell
cd frontend
npm run lint
npm run build
cd ..\backend
.venv\Scripts\python.exe -m pytest ai_service\tests -q
```

Make sure MongoDB and the FastAPI service are running before exercising the full application. `GET /api/v1/ai-health` checks FastAPI connectivity and local model-file availability.

## Production deployment notes

<<<<<<< HEAD
This project is licensed under the [MIT License](https://github.com/abdul-wahab619/AI-MedLab/blob/main/LICENSE).
=======
Deploy the frontend, Express API, MongoDB, and FastAPI model service as separate services. Set `AI_SERVICE_URL` to the private FastAPI URL reachable from Express; do not expose the model service publicly unless protected by an appropriate network/API policy. Set `CLIENT_SITE_URL` and `CORS_ORIGIN` to the deployed frontend origin, configure `MONGO_URL`, a strong `JWT_SECRET_KEY`, and Stripe keys via the hosting provider's secret manager. Use HTTPS and run the same lint/build/model tests before release. Do not commit `.env` files or model service credentials.

Set the frontend build variable `VITE_API_URL` to the Express API base URL, including `/api/v1` (for example `https://api.example.com/api/v1`), before building the production frontend.

> > > > > > > 9b4d167 (Update AI MedLab working project)
