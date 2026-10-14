from io import BytesIO

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from ai_service.main import TABULAR_MODELS, app

client = TestClient(app)

TABULAR_SAMPLE = {
    "diabetes": {
        "preg": 1, "plas": 120, "pres": 70, "skin": 20, "insu": 80,
        "mass": 25, "pedi": 0.5, "age": 30,
    },
    "heart": {
        "age": 50, "sex": 1, "cp": 1, "trestbps": 120, "chol": 200,
        "fbs": 0, "restecg": 0, "thalach": 150, "exang": 0, "oldpeak": 1,
        "slope": 1, "ca": 0, "thal": 2,
    },
    "kidney": {
        "Age": 50, "BP": 80, "AL": 0, "SU": 0, "RBC": 1, "PC": 1,
        "PCC": 0, "BA": 0, "BGR": 120, "BU": 30, "SC": 1.2, "POT": 4,
        "WC": 8000, "HTN": 0, "DM": 0, "CAD": 0, "PE": 0, "ANE": 0,
    },
    "liver": {
        "Age": 40, "Gender": 1, "Total_Bilirubin": 0.8, "Direct_Bilirubin": 0.2,
        "Alkaline_Phosphotase": 200, "Alamine_Aminotransferase": 25,
        "Aspartate_Aminotransferase": 30, "Total_Protiens": 7,
        "Albumin": 4, "Albumin_and_Globulin_Ratio": 1.2,
    },
    "breast-cancer": {
        name: 1 for name in TABULAR_MODELS["breast-cancer"][1]
    },
}


def test_health_lists_available_local_models():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["models"]["diabetes"]["available"] is True


def test_tabular_endpoint_rejects_missing_features():
    response = client.post("/api/v1/predict/diabetes", json={"data": {"age": 30}})

    assert response.status_code == 422
    assert "missing" in response.json()["detail"]


@pytest.mark.parametrize("model_name", TABULAR_MODELS)
def test_tabular_endpoint_returns_model_output(model_name):
    response = client.post(
        f"/api/v1/predict/{model_name}", json={"data": TABULAR_SAMPLE[model_name]}
    )

    assert response.status_code == 200
    assert response.json()["model"] == model_name
    assert isinstance(response.json()["prediction"], list)
    assert response.json()["prediction"]


def test_unknown_image_model_is_rejected():
    response = client.post(
        "/api/v1/predict-image/unknown",
        files={"image": ("test.png", b"invalid", "image/png")},
    )

    assert response.status_code == 404


def test_invalid_image_content_is_rejected():
    response = client.post(
        "/api/v1/predict-image/malaria",
        files={"image": ("test.gif", b"invalid", "image/gif")},
    )

    assert response.status_code == 415


@pytest.mark.parametrize("model_name", ["malaria", "pneumonia"])
def test_image_endpoint_returns_model_output(model_name):
    image_bytes = BytesIO()
    Image.new("RGB", (36, 36), color=(128, 128, 128)).save(image_bytes, format="PNG")
    image_bytes.seek(0)
    response = client.post(
        f"/api/v1/predict-image/{model_name}",
        files={"image": ("sample.png", image_bytes, "image/png")},
    )

    assert response.status_code == 200
    assert response.json()["model"] == model_name
    assert isinstance(response.json()["prediction"], list)


def test_symptom_endpoint_returns_model_output():
    response = client.post(
        "/api/v1/predict-symptoms", json={"data": ["headache", "fatigue"]}
    )

    assert response.status_code == 200
    assert response.json()["prediction"]["predicted_disease"]


def test_symptom_endpoint_rejects_unknown_symptom():
    response = client.post(
        "/api/v1/predict-symptoms", json={"data": ["not_a_supported_symptom"]}
    )

    assert response.status_code == 422
