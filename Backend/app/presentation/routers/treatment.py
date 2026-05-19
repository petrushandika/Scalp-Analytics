import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.db import get_db
from app.infrastructure.database.models import TreatmentModel
from app.infrastructure.repositories.treatment import TreatmentRepository
from app.presentation.middleware.auth import CurrentUser
from app.presentation.schemas.treatment import (
    TreatmentCreateRequest,
    TreatmentResponse,
    TreatmentUpdateRequest,
)


router = APIRouter()


@router.post("/", response_model=TreatmentResponse, status_code=status.HTTP_201_CREATED)
async def create_treatment(
    body: TreatmentCreateRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TreatmentResponse:
    """Buat jadwal perawatan baru."""
    repo = TreatmentRepository(db)
    treatment = TreatmentModel(
        user_id=current_user.id,
        name=body.name.strip(),
        frequency=body.frequency,
        dosage=body.dosage,
        description=body.description,
        is_active=True,
    )
    treatment = await repo.save(treatment)
    return _to_response(treatment)


@router.get("/", response_model=list[TreatmentResponse])
async def list_treatments(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    active_only: bool = False,
) -> list[TreatmentResponse]:
    """Ambil semua perawatan milik user."""
    repo = TreatmentRepository(db)
    treatments = await repo.find_by_user(current_user.id, active_only=active_only)
    return [_to_response(t) for t in treatments]


@router.get("/{treatment_id}", response_model=TreatmentResponse)
async def get_treatment(
    treatment_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TreatmentResponse:
    repo = TreatmentRepository(db)
    treatment = await repo.find_by_id(treatment_id)
    if not treatment or treatment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Perawatan tidak ditemukan."
        )
    return _to_response(treatment)


@router.put("/{treatment_id}", response_model=TreatmentResponse)
async def update_treatment(
    treatment_id: uuid.UUID,
    body: TreatmentUpdateRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TreatmentResponse:
    repo = TreatmentRepository(db)
    treatment = await repo.find_by_id(treatment_id)
    if not treatment or treatment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perawatan tidak ditemukan.",
        )
    if body.name is not None:
        treatment.name = body.name.strip()
    if body.frequency is not None:
        treatment.frequency = body.frequency
    if body.dosage is not None:
        treatment.dosage = body.dosage
    if body.description is not None:
        treatment.description = body.description
    treatment = await repo.save(treatment)
    return _to_response(treatment)


@router.patch("/{treatment_id}/deactivate", response_model=TreatmentResponse)
async def deactivate_treatment(
    treatment_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TreatmentResponse:
    """Nonaktifkan perawatan (soft delete)."""
    repo = TreatmentRepository(db)
    treatment = await repo.find_by_id(treatment_id)
    if not treatment or treatment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perawatan tidak ditemukan.",
        )
    treatment.is_active = False
    treatment = await repo.save(treatment)
    return _to_response(treatment)


@router.delete("/{treatment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_treatment(
    treatment_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    repo = TreatmentRepository(db)
    treatment = await repo.find_by_id(treatment_id)
    if not treatment or treatment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perawatan tidak ditemukan.",
        )
    await repo.delete(treatment)


def _to_response(treatment: TreatmentModel) -> TreatmentResponse:
    return TreatmentResponse(
        id=treatment.id,
        user_id=treatment.user_id,
        name=treatment.name,
        frequency=treatment.frequency,
        dosage=treatment.dosage,
        description=treatment.description,
        is_active=treatment.is_active,
        created_at=treatment.created_at,
        updated_at=treatment.updated_at,
    )
