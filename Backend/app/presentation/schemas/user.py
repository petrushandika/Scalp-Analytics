from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


GenderType = Literal["male", "female", "other"]
ActivityLevelType = Literal["sedentary", "light", "moderate", "active", "very_active"]


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: str | None
    height_cm: int | None
    weight_kg: float | None
    age: int | None
    gender: GenderType | None
    activity_level: ActivityLevelType | None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UpdateProfileRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=500)
    height_cm: int | None = Field(default=None, ge=100, le=250)
    weight_kg: float | None = Field(default=None, ge=30, le=300)
    age: int | None = Field(default=None, ge=13, le=120)
    gender: GenderType | None = None
    activity_level: ActivityLevelType | None = None
