from __future__ import annotations

from datetime import datetime
from typing import Dict, Optional

import numpy as np
from fastapi import FastAPI

from .data import DEPARTMENTS, SyntheticParams, build_feature_matrix, generate_synthetic_dataset
from .model import LinearModel, train_model
from .schemas import CrowdRequest, CrowdResponse, WaitTimeRequest, WaitTimeResponse

app = FastAPI(title="Hospital Queue ML Service", version="0.1.0")

WAIT_MODEL: Optional[LinearModel] = None
CROWD_MODEL: Optional[LinearModel] = None
FEATURES: Optional[list[str]] = None


def _dept_one_hot(dept: str) -> np.ndarray:
    oh = np.zeros((len(DEPARTMENTS),), dtype=np.float32)
    oh[DEPARTMENTS.index(dept)] = 1.0
    return oh


def _time_features(ts: datetime) -> np.ndarray:
    hour = ts.hour
    dow = ts.weekday()
    hour_rad = (hour / 24.0) * 2 * np.pi
    dow_rad = (dow / 7.0) * 2 * np.pi
    return np.array(
        [
            np.sin(hour_rad),
            np.cos(hour_rad),
            np.sin(dow_rad),
            np.cos(dow_rad),
        ],
        dtype=np.float32,
    )


def _wait_band(wait_mins: float) -> str:
    if wait_mins < 20:
        return "low"
    if wait_mins < 45:
        return "moderate"
    return "high"


def _crowd_level(arrivals_hr: float) -> str:
    if arrivals_hr < 12:
        return "low"
    if arrivals_hr < 22:
        return "medium"
    return "high"


@app.on_event("startup")
def startup_train():
    global WAIT_MODEL, CROWD_MODEL, FEATURES
    data = generate_synthetic_dataset(SyntheticParams())
    X, cols = build_feature_matrix(data)
    FEATURES = cols

    WAIT_MODEL = train_model(X, data["wait_minutes"], cols)
    CROWD_MODEL = train_model(X, data["crowd_arrivals_per_hour"], cols)


@app.get("/health")
def health():
    return {"ok": True, "models_loaded": WAIT_MODEL is not None and CROWD_MODEL is not None}


@app.post("/predict/wait-time", response_model=WaitTimeResponse)
def predict_wait_time(req: WaitTimeRequest):
    assert WAIT_MODEL is not None
    assert FEATURES is not None

    t = _time_features(req.timestamp)
    # Order must match build_feature_matrix(): queue_len, arrivals_30m, service_rate, emergency_share, hour_sin, hour_cos, dow_sin, dow_cos, dept_onehot...
    x = np.concatenate(
        [
            np.array(
                [
                    float(req.queue_len),
                    float(req.arrivals_30m),
                    float(req.service_rate),
                    float(req.emergency_share),
                    float(t[0]),
                    float(t[1]),
                    float(t[2]),
                    float(t[3]),
                ],
                dtype=np.float32,
            ),
            _dept_one_hot(req.department),
        ]
    )

    pred = max(0.0, WAIT_MODEL.predict(x))
    band = _wait_band(pred)

    top = WAIT_MODEL.explain(x, top_k=6)
    q = req.queue_len
    expl = (
        f"Predicted wait is {pred:.1f} minutes ({band}). "
        f"Main drivers include current queue length ({q}), expected arrivals in the next 30 minutes ({req.arrivals_30m:.1f}), "
        f"service capacity ({req.service_rate:.1f}/hr), and emergency share ({req.emergency_share:.2f})."
    )

    return WaitTimeResponse(
        wait_minutes=float(round(pred, 2)),
        band=band,  # type: ignore[arg-type]
        explanation=expl,
        top_factors=top,
    )


@app.post("/predict/crowd", response_model=CrowdResponse)
def predict_crowd(req: CrowdRequest):
    assert CROWD_MODEL is not None

    # If department not provided, use general medicine as baseline.
    dept = req.department or "General Medicine"
    t = _time_features(req.timestamp)

    # For crowd-only, we feed reasonable defaults for queue_len etc.
    # (model still learns time + department patterns from synthetic data)
    x = np.concatenate(
        [
            np.array(
                [
                    25.0,  # queue_len baseline
                    8.0,  # arrivals_30m baseline
                    18.0,  # service_rate baseline
                    0.06,  # emergency_share baseline
                    float(t[0]),
                    float(t[1]),
                    float(t[2]),
                    float(t[3]),
                ],
                dtype=np.float32,
            ),
            _dept_one_hot(dept),
        ]
    )

    arrivals_hr = max(0.0, CROWD_MODEL.predict(x))
    level = _crowd_level(arrivals_hr)

    hour = req.timestamp.hour
    dow = req.timestamp.weekday()
    expl = (
        f"Crowd level is {level} with ~{arrivals_hr:.1f} arrivals/hour. "
        f"This is driven by time-of-day patterns (hour={hour}) and day-of-week (dow={dow}) learned from synthetic OPD peaks."
    )

    return CrowdResponse(
        crowd_level=level,  # type: ignore[arg-type]
        predicted_arrivals_per_hour=float(round(arrivals_hr, 2)),
        explanation=expl,
    )

