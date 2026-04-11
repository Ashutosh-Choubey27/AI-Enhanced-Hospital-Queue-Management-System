from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


Department = Literal[
    "General Medicine",
    "Cardiology",
    "Pulmonology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
]


class WaitTimeRequest(BaseModel):
    department: Department
    timestamp: datetime = Field(..., description="Local/UTC timestamp of the slot")
    queue_len: int = Field(..., ge=0, le=500)
    arrivals_30m: float = Field(..., ge=0, le=200)
    service_rate: float = Field(..., ge=1, le=200, description="Estimated service capacity patients/hour")
    emergency_share: float = Field(..., ge=0, le=1)


class WaitTimeResponse(BaseModel):
    wait_minutes: float
    band: Literal["low", "moderate", "high"]
    explanation: str
    top_factors: list[dict]


class CrowdRequest(BaseModel):
    department: Optional[Department] = None
    timestamp: datetime


class CrowdResponse(BaseModel):
    crowd_level: Literal["low", "medium", "high"]
    predicted_arrivals_per_hour: float
    explanation: str

