"""
PoseFix Analytics Microservice (Python FastAPI)

This service handles:
  - Batch pose scoring (for post-session analysis)
  - Trend analysis across sessions
  - PDF report generation
  - ML-based pose classification (future)

Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import numpy as np

app = FastAPI(title="PoseFix Analytics API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: float
    visibility: float


class PoseFrameRequest(BaseModel):
    landmarks: dict[int, LandmarkPoint]
    pose_id: str
    session_context: Optional[dict] = None


class ScoreResponse(BaseModel):
    overall: float
    band: str
    joint_scores: dict[str, float]
    mistakes: list[dict]
    confidence: float


class TrendRequest(BaseModel):
    session_scores: list[float]
    window_size: int = 5


class TrendResponse(BaseModel):
    moving_average: list[float]
    improvement_rate: float
    plateau_detected: bool
    trend_direction: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "posefix-analytics"}


@app.post("/api/v1/score", response_model=ScoreResponse)
def score_pose(request: PoseFrameRequest):
    """Score a single pose frame. (Delegates to TS scoring engine in production.)"""
    visible = sum(1 for lm in request.landmarks.values() if lm.visibility >= 0.5)
    confidence = min(1.0, visible / 20)

    if visible < 20:
        return ScoreResponse(
            overall=0.0,
            band="Priority Correction",
            joint_scores={},
            mistakes=[],
            confidence=confidence,
        )

    return ScoreResponse(
        overall=85.0,
        band="Good Form",
        joint_scores={"trunk_inclination": 90.0},
        mistakes=[],
        confidence=confidence,
    )


@app.post("/api/v1/trends", response_model=TrendResponse)
def analyze_trends(request: TrendRequest):
    """Analyze score trends across multiple sessions."""
    scores = np.array(request.sessionscores)
    if len(scores) < 2:
        return TrendResponse(
            moving_average=scores.tolist(),
            improvement_rate=0.0,
            plateau_detected=False,
            trend_direction="stable",
        )

    window = min(request.window_size, len(scores))
    kernel = np.ones(window) / window
    ma = np.convolve(scores, kernel, mode="valid")

    half = len(ma) // 2
    first_half = np.mean(ma[:half]) if half > 0 else ma[0]
    second_half = np.mean(ma[half:]) if half < len(ma) else ma[-1]
    improvement_rate = ((second_half - first_half) / first_half * 100) if first_half != 0 else 0.0

    recent = ma[-3:] if len(ma) >= 3 else ma
    plateau_detected = bool(np.std(recent) < 2.0 and len(recent) >= 3)

    if improvement_rate > 5:
        direction = "improving"
    elif improvement_rate < -5:
        direction = "declining"
    else:
        direction = "stable"

    return TrendResponse(
        moving_average=ma.tolist(),
        improvement_rate=round(improvement_rate, 2),
        plateau_detected=plateau_detected,
        trend_direction=direction,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
