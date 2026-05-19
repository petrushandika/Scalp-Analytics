from datetime import date

from pydantic import BaseModel


class ProgressPoint(BaseModel):
    date: date
    severity_stage: str | None
    confidence: float | None


class AnalyticsResponse(BaseModel):
    total_photos: int
    latest_severity_stage: str | None
    progress: list[ProgressPoint]
    total_habits_logged: int
    avg_stress_level: float | None
    avg_sleep_hours: float | None
    active_treatments: int
    treatment_names: list[str]
