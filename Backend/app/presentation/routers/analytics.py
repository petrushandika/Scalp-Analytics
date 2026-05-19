from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.db import get_db
from app.infrastructure.repositories.habit import HabitRepository
from app.infrastructure.repositories.photo import PhotoRepository
from app.infrastructure.repositories.treatment import TreatmentRepository
from app.presentation.middleware.auth import CurrentUser
from app.presentation.schemas.analytics import AnalyticsResponse, ProgressPoint


router = APIRouter()


@router.get("/", response_model=AnalyticsResponse)
async def get_analytics(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AnalyticsResponse:
    """Dashboard analytics: progress kerontokan, habit summary, treatment aktif."""
    async with db.begin():
        photos = await PhotoRepository(db).find_by_user(current_user.id)
        habits = await HabitRepository(db).find_by_user(current_user.id)
        treatments = await TreatmentRepository(db).find_by_user(
            current_user.id, active_only=True
        )

    # Progress kerontokan dari waktu ke waktu
    progress = [
        ProgressPoint(
            date=p.created_at.date(),
            severity_stage=p.severity_stage,
            confidence=float(p.severity_confidence) if p.severity_confidence else None,
        )
        for p in photos
        if p.severity_stage
    ]

    # Rata-rata habit
    avg_stress = None
    avg_sleep = None
    if habits:
        stress_values = [h.stress_level for h in habits if h.stress_level is not None]
        sleep_values = [
            float(h.sleep_hours) for h in habits if h.sleep_hours is not None
        ]
        avg_stress = (
            round(sum(stress_values) / len(stress_values), 1) if stress_values else None
        )
        avg_sleep = (
            round(sum(sleep_values) / len(sleep_values), 1) if sleep_values else None
        )

    # Stage terbaru
    latest_stage = photos[0].severity_stage if photos else None

    return AnalyticsResponse(
        total_photos=len(photos),
        latest_severity_stage=latest_stage,
        progress=progress,
        total_habits_logged=len(habits),
        avg_stress_level=avg_stress,
        avg_sleep_hours=avg_sleep,
        active_treatments=len(treatments),
        treatment_names=[t.name for t in treatments],
    )
