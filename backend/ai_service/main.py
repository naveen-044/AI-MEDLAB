import json
import logging
import os
import subprocess
import sys
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import sklearn.ensemble
import sklearn.tree
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-medlab")

BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BACKEND_DIR / "aimodels"
MAX_IMAGE_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp"}

sys.modules["sklearn.ensemble.forest"] = sklearn.ensemble
sys.modules["sklearn.tree.tree"] = sklearn.tree

TABULAR_MODELS = {
    "diabetes": ("diabetes.pkl", ("preg", "plas", "pres", "skin", "insu", "mass", "pedi", "age")),
    "heart": (
        "heart.pkl",
        ("age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"),
    ),
    "kidney": (
        "kidney.pkl",
        ("Age", "BP", "AL", "SU", "RBC", "PC", "PCC", "BA", "BGR", "BU", "SC", "POT", "WC", "HTN", "DM", "CAD", "PE", "ANE"),
    ),
    "liver": (
        "liver.pkl",
        ("Age", "Gender", "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase", "Alamine_Aminotransferase", "Aspartate_Aminotransferase", "Total_Protiens", "Albumin", "Albumin_and_Globulin_Ratio"),
    ),
    "breast-cancer": (
        "breast_cancer.pkl",
        (
            "mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness",
            "mean compactness", "mean concavity", "mean concave points", "mean symmetry",
            "mean fractal dimension", "radius error", "texture error", "perimeter error",
            "area error", "smoothness error", "compactness error", "concavity error",
            "concave points error", "symmetry error", "fractal dimension error",
            "worst radius", "worst texture", "worst perimeter", "worst area",
            "worst smoothness", "worst compactness", "worst concavity",
            "worst concave points", "worst symmetry", "worst fractal dimension",
        ),
    ),
}

IMAGE_MODELS = {
    "malaria": ("malaria.h5", "rgb"),
    "pneumonia": ("pneumonia.h5", "grayscale"),
}

app = FastAPI(
    title="AI-MedLab model service",
    description="Local model inference endpoints. Outputs are decision support, not a diagnosis.",
    version="1.0.0",
)


class TabularPredictionRequest(BaseModel):
    data: dict[str, float] = Field(description="Feature names and numeric values required by the selected model")


class SymptomPredictionRequest(BaseModel):
    data: list[str] | str = Field(description="A symptom list or comma-separated symptom string")


@lru_cache(maxsize=len(TABULAR_MODELS))
def load_tabular_model(model_name: str) -> Any:
    if model_name not in TABULAR_MODELS:
        raise KeyError(model_name)
    model_path = MODEL_DIR / TABULAR_MODELS[model_name][0]
    if not model_path.is_file():
        raise FileNotFoundError(f"Model file is not available: {model_name}")
    import pickle

    with model_path.open("rb") as model_file:
        return pickle.load(model_file)


@lru_cache(maxsize=len(IMAGE_MODELS))
def load_image_model(model_name: str) -> Any:
    if model_name not in IMAGE_MODELS:
        raise KeyError(model_name)
    model_path = MODEL_DIR / IMAGE_MODELS[model_name][0]
    if not model_path.is_file():
        raise FileNotFoundError(f"Model file is not available: {model_name}")
    try:
        from tf_keras.models import load_model

        return load_model(model_path)
    except Exception as exc:
        logger.exception("Could not load image model %s", model_name)
        raise RuntimeError(f"Image model is unavailable: {model_name}") from exc


def model_version(model_name: str, image_model: bool = False) -> str:
    model_filename = (
        IMAGE_MODELS[model_name][0] if image_model else TABULAR_MODELS[model_name][0]
    )
    model_path = MODEL_DIR / model_filename
    if not model_path.is_file():
        raise FileNotFoundError(f"Model file is not available: {model_name}")
    return f"{model_filename}:{model_path.stat().st_size}"


def normalize_symptoms(value: list[str] | str) -> list[str]:
    symptoms = value.split(",") if isinstance(value, str) else value
    normalized = [symptom.strip().lower().replace(" ", "_") for symptom in symptoms]
    normalized = [symptom for symptom in normalized if symptom]
    if not normalized:
        raise HTTPException(status_code=422, detail="Enter at least one symptom.")

    training_file = BACKEND_DIR / "HealthPredict" / "Training.csv"
    try:
        columns = list(pd.read_csv(training_file, nrows=0).columns)
        feature_names = {
            column.lower().replace(" ", "_") for column in columns[:-1]
        }
        feature_lookup = {}
        for column in columns[:-1]:
            feature_lookup.setdefault(column.lower().replace(" ", "_"), column)
    except Exception as exc:
        logger.exception("Could not read symptom model feature list")
        raise HTTPException(
            status_code=503, detail="The symptom screening model is unavailable."
        ) from exc

    unknown = sorted(set(normalized) - feature_names)
    if unknown:
        raise HTTPException(
            status_code=422,
            detail={"message": "One or more symptoms are not supported.", "unknown": unknown},
        )
    return [feature_lookup[symptom] for symptom in normalized]


@app.get("/health")
def health() -> dict[str, Any]:
    models = {}
    for name, (filename, _) in TABULAR_MODELS.items():
        path = MODEL_DIR / filename
        models[name] = {"available": path.is_file()}
    for name, (filename, _) in IMAGE_MODELS.items():
        path = MODEL_DIR / filename
        models[name] = {"available": path.is_file()}
    models["symptoms"] = {
        "available": (BACKEND_DIR / "aimodels" / "svc.pkl").is_file()
        and (BACKEND_DIR / "HealthPredict" / "Training.csv").is_file()
    }
    return {"status": "ok", "models": models}


@app.post("/api/v1/predict/{model_name}")
def predict_tabular(
    model_name: str, request: TabularPredictionRequest
) -> dict[str, Any]:
    model_config = TABULAR_MODELS.get(model_name)
    if model_config is None:
        raise HTTPException(status_code=404, detail="Unknown screening model.")

    feature_names = model_config[1]
    supplied_names = set(request.data)
    expected_names = set(feature_names)
    missing = sorted(expected_names - supplied_names)
    unexpected = sorted(supplied_names - expected_names)
    if missing or unexpected:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "The submitted fields do not match this model's input schema.",
                "missing": missing,
                "unexpected": unexpected,
            },
        )

    try:
        values = [request.data[name] for name in feature_names]
        if not np.isfinite(values).all():
            raise HTTPException(
                status_code=422, detail="All measurements must be finite numbers."
            )
        model = load_tabular_model(model_name)
        model_features = tuple(getattr(model, "feature_names_in_", feature_names))
        if set(model_features) != expected_names:
            logger.error("Feature schema mismatch for model %s", model_name)
            raise HTTPException(
                status_code=503,
                detail="This model's feature schema does not match the screening form.",
            )
        prediction = model.predict(pd.DataFrame([request.data], columns=model_features))
        output = np.asarray(prediction).tolist()
        return {
            "prediction": output,
            "model": model_name,
            "model_version": model_version(model_name),
        }
    except HTTPException:
        raise
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Tabular inference failed for model %s", model_name)
        raise HTTPException(
            status_code=500, detail="The screening model could not process this request."
        ) from exc


@app.post("/api/v1/predict-image/{model_name}")
async def predict_image(
    model_name: str, image: UploadFile = File(...)
) -> dict[str, Any]:
    if model_name not in IMAGE_MODELS:
        raise HTTPException(status_code=404, detail="Unknown image screening model.")
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415, detail="Upload a PNG, JPEG, or WebP image."
        )

    content = await image.read(MAX_IMAGE_BYTES + 1)
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Images must be 10 MB or smaller.")
    if not content:
        raise HTTPException(status_code=422, detail="The uploaded image is empty.")

    try:
        from PIL import Image, UnidentifiedImageError

        from io import BytesIO

        with Image.open(BytesIO(content)) as source_image:
            source_image.verify()
        with Image.open(BytesIO(content)) as source_image:
            color_mode = IMAGE_MODELS[model_name][1]
            image_mode = "RGB" if color_mode == "rgb" else "L"
            image_array = np.asarray(
                source_image.convert(image_mode).resize((36, 36)), dtype=np.float32
            )
        if image_array.ndim == 2:
            image_array = image_array.reshape((36, 36, 1))
        image_array = (image_array / 255.0)[np.newaxis, ...]

        model = load_image_model(model_name)
        prediction = np.asarray(model.predict(image_array, verbose=0)).tolist()
        return {
            "prediction": prediction,
            "model": model_name,
            "model_version": model_version(model_name, image_model=True),
        }
    except HTTPException:
        raise
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=415, detail="The uploaded file is not a valid image.") from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Image inference failed for model %s", model_name)
        raise HTTPException(
            status_code=500, detail="The image model could not process this image."
        ) from exc


@app.post("/api/v1/predict-symptoms")
def predict_symptoms(request: SymptomPredictionRequest) -> dict[str, Any]:
    symptoms = normalize_symptoms(request.data)
    script_path = BACKEND_DIR / "symptoms.py"
    model_path = MODEL_DIR / "svc.pkl"
    if not script_path.is_file() or not model_path.is_file():
        raise HTTPException(
            status_code=503, detail="The symptom screening model is unavailable."
        )

    try:
        result = subprocess.run(
            [
                sys.executable,
                str(script_path),
                "--loads",
                str(model_path),
                json.dumps({"data": symptoms}),
            ],
            capture_output=True,
            text=True,
            check=True,
            timeout=90,
            cwd=BACKEND_DIR,
        )
        prediction = json.loads(result.stdout)
        if not isinstance(prediction, dict) or not prediction.get("predicted_disease"):
            raise ValueError("The symptom model returned an invalid result.")
        return {
            "prediction": prediction,
            "model": "symptoms",
            "model_version": f"svc.pkl:{model_path.stat().st_size}",
        }
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(
            status_code=504, detail="The symptom screening request timed out."
        ) from exc
    except subprocess.CalledProcessError as exc:
        logger.error("Symptom inference failed with exit code %s", exc.returncode)
        raise HTTPException(
            status_code=503, detail="The symptom screening model could not process this request."
        ) from exc
    except (json.JSONDecodeError, ValueError) as exc:
        logger.exception("Symptom model returned invalid output")
        raise HTTPException(
            status_code=500, detail="The symptom screening model returned an invalid result."
        ) from exc
