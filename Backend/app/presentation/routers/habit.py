import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.db import get_db
from app.infrastructure.database.models import HabitModel
from app.infrastructure.repositories.habit import HabitRepository
from app.presentation.middleware.auth import CurrentUser
from app.presentation.schemas.habit import (
    HabitCreateRequest,
    HabitResponse,
    HabitUpdateRequest,
)


router = APIRouter()


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    body: HabitCreateRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> HabitResponse:
    """Buat log kebiasaan harian. Satu tanggal hanya boleh satu log."""
    async with db.begin():
        repo = HabitRepository(db)
        existing = await repo.find_by_date(current_user.id, body.log_date)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Log untuk tanggal {body.log_date} sudah ada.",
            )
        habit = HabitModel(
            user_id=current_user.id,
            log_date=body.log_date,
            stress_level=body.stress_level,
            sleep_hours=body.sleep_hours,
            notes=body.notes,
        )
        habit = await repo.save(habit)

    return _to_response(habit)


@router.get("/", response_model=list[HabitResponse])
async def list_habits(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[HabitResponse]:
    """Ambil semua log kebiasaan milik user."""
    async with db.begin():
        repo = HabitRepository(db)
        habits = await repo.find_by_user(current_user.id)
    return [_to_response(h) for h in habits]


@router.get("/{habit_id}", response_model=HabitResponse)
async def get_habit(
    habit_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> HabitResponse:
    async with db.begin():
        repo = HabitRepository(db)
        habit = await repo.find_by_id(habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Log tidak ditemukan."
        )
    return _to_response(habit)


@router.put("/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: uuid.UUID,
    body: HabitUpdateRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> HabitResponse:
    async with db.begin():
        repo = HabitRepository(db)
        habit = await repo.find_by_id(habit_id)
        if not habit or habit.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Log tidak ditemukan."
            )
        if body.stress_level is not None:
            habit.stress_level = body.stress_level
        if body.sleep_hours is not None:
            habit.sleep_hours = body.sleep_hours
        if body.notes is not None:
            habit.notes = body.notes
        habit = await repo.save(habit)
    return _to_response(habit)


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    async with db.begin():
        repo = HabitRepository(db)
        habit = await repo.find_by_id(habit_id)
        if not habit or habit.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Log tidak ditemukan."
            )
        await repo.delete(habit)


def _to_response(habit: HabitModel) -> HabitResponse:
    return HabitResponse(
        id=habit.id,
        user_id=habit.user_id,
        log_date=habit.log_date,
        stress_level=habit.stress_level,
        sleep_hours=float(habit.sleep_hours) if habit.sleep_hours is not None else None,
        notes=habit.notes,
        created_at=habit.created_at,
        updated_at=habit.updated_at,
    )
