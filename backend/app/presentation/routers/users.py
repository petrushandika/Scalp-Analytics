from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.requests import UpdateProfileDTO
from app.application.services.user_service import UserService
from app.domain.entities.user import ActivityLevel, Gender
from app.infrastructure.database.connection import get_db
from app.infrastructure.repositories.user_repository import UserRepository
from app.presentation.middleware.auth_middleware import CurrentUser
from app.presentation.schemas.base_schema import SuccessResponse, success_response
from app.presentation.schemas.user_schema import (
    UpdateProfileRequest,
    UserProfileResponse,
)


router = APIRouter()


def get_user_service(db: AsyncSession) -> UserService:
    return UserService(UserRepository(db))


@router.get(
    "/me",
    response_model=SuccessResponse[UserProfileResponse],
    summary="Ambil profil user saat ini",
)
async def get_my_profile(current_user: CurrentUser) -> dict:
    """Ambil profil lengkap user yang sedang login."""
    return success_response(
        UserProfileResponse(
            id=str(current_user.id),
            email=current_user.email,
            full_name=current_user.full_name,
            avatar_url=current_user.avatar_url,
            height_cm=current_user.height_cm,
            weight_kg=current_user.weight_kg,
            age=current_user.age,
            gender=current_user.gender.value if current_user.gender else None,
            activity_level=(
                current_user.activity_level.value
                if current_user.activity_level
                else None
            ),
            is_active=current_user.is_active,
            is_verified=current_user.is_verified,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at,
        )
    )


@router.put(
    "/me",
    response_model=SuccessResponse[UserProfileResponse],
    summary="Update profil user",
)
async def update_my_profile(
    request: UpdateProfileRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: CurrentUser,
) -> dict:
    """Update profil pengguna yang sedang login."""
    service = get_user_service(db)
    updated_user = await service.update_profile(
        UpdateProfileDTO(
            user_id=current_user.id,
            full_name=request.full_name,
            avatar_url=request.avatar_url,
            height_cm=request.height_cm,
            weight_kg=request.weight_kg,
            age=request.age,
            gender=Gender(request.gender) if request.gender else None,
            activity_level=ActivityLevel(request.activity_level)
            if request.activity_level
            else None,
        )
    )
    return success_response(
        UserProfileResponse(
            id=str(updated_user.id),
            email=updated_user.email,
            full_name=updated_user.full_name,
            avatar_url=updated_user.avatar_url,
            height_cm=updated_user.height_cm,
            weight_kg=updated_user.weight_kg,
            age=updated_user.age,
            gender=updated_user.gender.value if updated_user.gender else None,
            activity_level=(
                updated_user.activity_level.value
                if updated_user.activity_level
                else None
            ),
            is_active=updated_user.is_active,
            is_verified=updated_user.is_verified,
            created_at=updated_user.created_at,
            updated_at=updated_user.updated_at,
        )
    )


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus akun user",
)
async def delete_my_account(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: CurrentUser,
) -> None:
    """Nonaktifkan akun pengguna yang sedang login (soft delete)."""
    service = get_user_service(db)
    await service.delete_account(current_user.id)
