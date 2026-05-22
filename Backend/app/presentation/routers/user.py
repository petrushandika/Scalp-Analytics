from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.dto import UpdateProfileDTO
from app.application.services.user import UserService
from app.config import get_settings
from app.domain.entities.user import ActivityLevel, Gender
from app.infrastructure.database.db import get_db
from app.infrastructure.repositories.user import UserRepository
from app.presentation.middleware.auth import CurrentUser
from app.presentation.schemas.base import SuccessResponse, success_response
from app.presentation.schemas.user import (
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


@router.post(
    "/avatar",
    response_model=SuccessResponse[UserProfileResponse],
    summary="Upload avatar user",
)
async def upload_avatar(
    file: Annotated[UploadFile, File(...)],
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: CurrentUser,
) -> dict:
    """Upload foto avatar user. File disimpan di storage/avatars/."""
    _ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
    _EXT_MAP = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

    if file.content_type not in _ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.",
        )

    settings = get_settings()
    avatars_dir = Path(settings.storage_path) / "avatars"
    avatars_dir.mkdir(parents=True, exist_ok=True)

    ext = _EXT_MAP.get(file.content_type or "", ".jpg")
    filename = f"{current_user.id}{ext}"
    dest = avatars_dir / filename

    data = await file.read()
    dest.write_bytes(data)

    avatar_url = f"storage/avatars/{filename}"

    service = get_user_service(db)
    updated_user = await service.update_profile(
        UpdateProfileDTO(
            user_id=current_user.id,
            avatar_url=avatar_url,
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
