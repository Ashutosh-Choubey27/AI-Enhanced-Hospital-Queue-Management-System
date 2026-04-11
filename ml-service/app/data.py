from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

import numpy as np


@dataclass(frozen=True)
class SyntheticParams:
    seed: int = 42
    days: int = 90
    rows_per_day: int = 24 * 2  # 30-min buckets


DEPARTMENTS = [
    "General Medicine",
    "Cardiology",
    "Pulmonology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
]


def _hour_peak_factor(hour: int) -> float:
    # India-like OPD peaks: 10-12 and 17-19, lighter mid-afternoon
    if 10 <= hour <= 12:
        return 1.35
    if 17 <= hour <= 19:
        return 1.55
    if 8 <= hour <= 9:
        return 1.10
    if 13 <= hour <= 15:
        return 0.85
    return 1.0


def _dow_factor(dow: int) -> float:
    # 0=Mon..6=Sun; weekends lower OPD
    if dow >= 5:
        return 0.65
    if dow == 0:
        return 1.05
    return 1.0


def _dept_factor(dept: str) -> float:
    return {
        "General Medicine": 1.20,
        "Pediatrics": 1.10,
        "Orthopedics": 1.00,
        "Pulmonology": 0.95,
        "Cardiology": 0.85,
        "Dermatology": 0.80,
    }.get(dept, 1.0)


def generate_synthetic_dataset(params: SyntheticParams) -> Dict[str, np.ndarray]:
    """
    Generates patterned synthetic data for training.

    Features:
      - hour_sin, hour_cos, dow_sin, dow_cos
      - dept_onehot
      - queue_len, arrivals_30m, service_rate (patients/hour)
      - emergency_share (0..1)

    Targets:
      - wait_minutes
      - crowd_arrivals_per_hour
    """
    rng = np.random.default_rng(params.seed)

    start = datetime(2026, 1, 1, 0, 0, 0)
    n = params.days * params.rows_per_day * len(DEPARTMENTS)

    hours = np.zeros(n, dtype=np.int32)
    dows = np.zeros(n, dtype=np.int32)
    dept_idx = np.zeros(n, dtype=np.int32)
    queue_len = np.zeros(n, dtype=np.float32)
    arrivals_30m = np.zeros(n, dtype=np.float32)
    service_rate = np.zeros(n, dtype=np.float32)
    emergency_share = np.zeros(n, dtype=np.float32)

    wait_minutes = np.zeros(n, dtype=np.float32)
    crowd_arrivals_per_hour = np.zeros(n, dtype=np.float32)

    i = 0
    for day in range(params.days):
        for bucket in range(params.rows_per_day):
            dt = start + timedelta(days=day, minutes=30 * bucket)
            hour = dt.hour
            dow = dt.weekday()

            for di, dept in enumerate(DEPARTMENTS):
                base_arrivals_hr = 18.0 * _dept_factor(dept) * _hour_peak_factor(hour) * _dow_factor(dow)
                # Add some seasonal-ish drift + noise
                drift = 1.0 + 0.15 * np.sin((day / 14.0) * 2 * np.pi)
                arrivals_hr = base_arrivals_hr * drift + rng.normal(0, 1.8)
                arrivals_hr = max(0.0, arrivals_hr)

                # 30-min arrivals
                a30 = max(0.0, arrivals_hr / 2.0 + rng.normal(0, 0.9))

                # Service capacity varies; cardiology slower, general med faster
                cap = {
                    "General Medicine": 22.0,
                    "Pediatrics": 18.0,
                    "Orthopedics": 16.0,
                    "Pulmonology": 15.0,
                    "Cardiology": 12.0,
                    "Dermatology": 20.0,
                }[dept]
                cap = cap * (0.85 + 0.3 * rng.random())  # capacity randomness

                # Emergency share higher evenings for pulmonology/cardiology
                emer_base = 0.04 + (0.05 if dept in ("Cardiology", "Pulmonology") else 0.02)
                emer = emer_base * (1.0 + (0.3 if 18 <= hour <= 22 else 0.0)) + rng.normal(0, 0.01)
                emer = float(np.clip(emer, 0.0, 0.25))

                # Queue length correlates with arrivals-capacity but has inertia
                q = max(0.0, (arrivals_hr - cap) * 1.7 + rng.normal(10, 6))
                if 10 <= hour <= 12 or 17 <= hour <= 19:
                    q += rng.normal(6, 4)
                q = float(np.clip(q, 0.0, 220.0))

                # Wait time: roughly proportional to queue_len / service_rate
                base_wait = (q / max(6.0, cap)) * 60.0
                # Emergency priority adds delays for normal patients (captured as +)
                emer_delay = emer * 25.0
                wait = base_wait + emer_delay + rng.normal(0, 6.0)
                wait = float(np.clip(wait, 0.0, 240.0))

                hours[i] = hour
                dows[i] = dow
                dept_idx[i] = di
                queue_len[i] = q
                arrivals_30m[i] = a30
                service_rate[i] = cap
                emergency_share[i] = emer
                wait_minutes[i] = wait
                crowd_arrivals_per_hour[i] = float(max(0.0, arrivals_hr + rng.normal(0, 1.2)))
                i += 1

    return {
        "hours": hours,
        "dows": dows,
        "dept_idx": dept_idx,
        "queue_len": queue_len,
        "arrivals_30m": arrivals_30m,
        "service_rate": service_rate,
        "emergency_share": emergency_share,
        "wait_minutes": wait_minutes,
        "crowd_arrivals_per_hour": crowd_arrivals_per_hour,
    }


def build_feature_matrix(data: Dict[str, np.ndarray]) -> Tuple[np.ndarray, List[str]]:
    hours = data["hours"].astype(np.float32)
    dows = data["dows"].astype(np.float32)
    dept_idx = data["dept_idx"].astype(np.int32)

    hour_rad = (hours / 24.0) * 2 * np.pi
    dow_rad = (dows / 7.0) * 2 * np.pi

    hour_sin = np.sin(hour_rad)
    hour_cos = np.cos(hour_rad)
    dow_sin = np.sin(dow_rad)
    dow_cos = np.cos(dow_rad)

    dept_oh = np.eye(len(DEPARTMENTS), dtype=np.float32)[dept_idx]
    dept_cols = [f"dept_{d}" for d in DEPARTMENTS]

    cont = np.stack(
        [
            data["queue_len"].astype(np.float32),
            data["arrivals_30m"].astype(np.float32),
            data["service_rate"].astype(np.float32),
            data["emergency_share"].astype(np.float32),
            hour_sin.astype(np.float32),
            hour_cos.astype(np.float32),
            dow_sin.astype(np.float32),
            dow_cos.astype(np.float32),
        ],
        axis=1,
    )
    cont_cols = [
        "queue_len",
        "arrivals_30m",
        "service_rate",
        "emergency_share",
        "hour_sin",
        "hour_cos",
        "dow_sin",
        "dow_cos",
    ]

    X = np.concatenate([cont, dept_oh], axis=1)
    cols = cont_cols + dept_cols
    return X, cols

