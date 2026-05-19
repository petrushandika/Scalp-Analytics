from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AnalyzeResponse(BaseModel):
    severity_stage: str
    confidence: float
    recommendation: str
    probabilities: dict[str, float]


class PhotoUploadResponse(BaseModel):
    id: UUID
    user_id: UUID
    image_url: str
    angle: str
    severity_stage: str | None
    confidence: float | None
    recommendation: str | None
    created_at: datetime


class PhotoListItem(BaseModel):
    id: UUID
    image_url: str
    angle: str
    severity_stage: str | None
    confidence: float | None
    created_at: datetime
