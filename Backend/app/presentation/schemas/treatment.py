from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TreatmentCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., pattern="^(daily|weekly|custom)$")
    dosage: str | None = None
    description: str | None = None


class TreatmentUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    frequency: str | None = Field(None, pattern="^(daily|weekly|custom)$")
    dosage: str | None = None
    description: str | None = None


class TreatmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    frequency: str
    dosage: str | None
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
