from fastapi import APIRouter, HTTPException, UploadFile, status

from app.infrastructure.ai.analyzer import ScalpAnalyzer
from app.presentation.schemas.photo import AnalyzeResponse


router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_scalp(file: UploadFile) -> AnalyzeResponse:
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
