import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.ai.analyzer import RECOMMENDATIONS, ScalpAnalyzer
from app.infrastructure.database.db import get_db
from app.infrastructure.database.models import PhotoModel
from app.infrastructure.repositories.photo import PhotoRepository
from app.infrastructure.storage.local import LocalStorage
from app.presentation.middleware.auth import CurrentUser
from app.presentation.schemas.photo import (
    AnalyzeResponse,
    PhotoListItem,
    PhotoUploadResponse,
)


router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
VALID_ANGLES = {"front", "top", "right", "left", "custom"}


@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_scalp(file: UploadFile) -> AnalyzeResponse:
    """Analisis foto kulit kepala tanpa menyimpan ke database."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.",
        )
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Ukuran file maksimal 10MB.",
        )
    try:
        result = ScalpAnalyzer.analyze(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Gagal memproses gambar: {e!s}",
        ) from e
    return AnalyzeResponse(**result)


@router.post(
    "/upload", response_model=PhotoUploadResponse, status_code=status.HTTP_201_CREATED
)
async def upload_photo(
    file: UploadFile,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    angle: str = "front",
) -> PhotoUploadResponse:
    """Upload foto, analisis AI, dan simpan hasilnya ke database."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.",
        )
    if angle not in VALID_ANGLES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Angle tidak valid. Pilih: {', '.join(VALID_ANGLES)}",
        )

    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Ukuran file maksimal 10MB.",
        )

    # Analisis AI
    try:
        result = ScalpAnalyzer.analyze(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Gagal memproses gambar: {e!s}",
        ) from e

    # Simpan file ke storage lokal
    storage = LocalStorage()
    image_url = await storage.save(image_bytes, file.content_type)

    photo = PhotoModel(
        id=uuid.uuid4(),
        user_id=current_user.id,
        image_url=image_url,
        angle=angle,
        severity_stage=result["severity_stage"],
        severity_confidence=result["confidence"],
        compression_status="completed",
        original_size_bytes=len(image_bytes),
    )

    repo = PhotoRepository(db)
    photo = await repo.save(photo)

    return PhotoUploadResponse(
        id=photo.id,
        user_id=photo.user_id,
        image_url=photo.image_url,
        angle=photo.angle,
        severity_stage=photo.severity_stage,
        confidence=float(photo.severity_confidence)
        if photo.severity_confidence
        else None,
        recommendation=RECOMMENDATIONS.get(result["severity_stage"]),
        created_at=photo.created_at,
    )


@router.get("/", response_model=list[PhotoListItem])
async def list_photos(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PhotoListItem]:
    """Ambil semua foto milik user yang sedang login."""
    repo = PhotoRepository(db)
    photos = await repo.find_by_user(current_user.id)

    return [
        PhotoListItem(
            id=p.id,
            image_url=p.image_url,
            angle=p.angle,
            severity_stage=p.severity_stage,
            confidence=float(p.severity_confidence) if p.severity_confidence else None,
            created_at=p.created_at,
        )
        for p in photos
    ]


@router.get("/{photo_id}", response_model=PhotoUploadResponse)
async def get_photo(
    photo_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PhotoUploadResponse:
    """Ambil detail satu foto berdasarkan ID."""
    repo = PhotoRepository(db)
    photo = await repo.find_by_id(photo_id)

    if not photo or photo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Foto tidak ditemukan."
        )

    return PhotoUploadResponse(
        id=photo.id,
        user_id=photo.user_id,
        image_url=photo.image_url,
        angle=photo.angle,
        severity_stage=photo.severity_stage,
        confidence=float(photo.severity_confidence)
        if photo.severity_confidence
        else None,
        recommendation=RECOMMENDATIONS.get(photo.severity_stage)
        if photo.severity_stage
        else None,
        created_at=photo.created_at,
    )


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_photo(
    photo_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Hapus foto milik user."""
    repo = PhotoRepository(db)
    photo = await repo.find_by_id(photo_id)
    if not photo or photo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Foto tidak ditemukan."
        )
    await repo.delete(photo)
    await LocalStorage().delete(photo.image_url)


def _get_ext(content_type: str) -> str:
    return {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}.get(
        content_type, ".jpg"
    )
