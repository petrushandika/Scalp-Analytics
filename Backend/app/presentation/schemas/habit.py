from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field


class HabitCreateRequest(BaseModel):
    log_date: date
    stress_level: int | None = Field(None, ge=1, le=10)
    sleep_hours: float | None = Field(None, ge=0, le=24)
    activity: str | None = Field(None, max_length=100)
    activity_duration_min: int | None = Field(None, ge=1, le=600)
    notes: str | None = None


class HabitUpdateRequest(BaseModel):
    stress_level: int | None = Field(None, ge=1, le=10)
    sleep_hours: float | None = Field(None, ge=0, le=24)
    activity: str | None = Field(None, max_length=100)
    activity_duration_min: int | None = Field(None, ge=1, le=600)
    notes: str | None = None


class HabitResponse(BaseModel):
    id: UUID
    user_id: UUID
    log_date: date
    stress_level: int | None
    sleep_hours: float | None
    activity: str | None
    activity_duration_min: int | None
    notes: str | None
    created_at: datetime
    updated_at: datetime
