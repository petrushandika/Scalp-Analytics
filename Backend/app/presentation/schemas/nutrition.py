from datetime import date, datetime, time
from uuid import UUID

from pydantic import BaseModel, Field


class FoodResponse(BaseModel):
    id: UUID
    name: str
    category: str
    brand: str | None
    default_serving: float
    default_unit: str
    is_verified: bool


class MealItemRequest(BaseModel):
    food_id: UUID
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., min_length=1, max_length=20)
    serving_multiplier: float = Field(default=1.0, gt=0)


class MealCreateRequest(BaseModel):
    log_date: date
    log_time: time
    meal_type: str = Field(..., pattern="^(breakfast|lunch|dinner|snack)$")
    notes: str | None = None
    items: list[MealItemRequest] = Field(default_factory=list)


class MealItemResponse(BaseModel):
    id: UUID
    food_id: UUID
    quantity: float
    unit: str
    serving_multiplier: float


class MealResponse(BaseModel):
    id: UUID
    user_id: UUID
    log_date: date
    log_time: time
    meal_type: str
    notes: str | None
    items: list[MealItemResponse]
    created_at: datetime


class WaterLogRequest(BaseModel):
    log_date: date
    amount_ml: float = Field(..., ge=0)


class WaterAddRequest(BaseModel):
    log_date: date
    amount_ml: float = Field(..., gt=0)


class WaterResponse(BaseModel):
    id: UUID
    user_id: UUID
    log_date: date
    amount_ml: float
    created_at: datetime
    updated_at: datetime
