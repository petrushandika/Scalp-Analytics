"""
Global exception handlers untuk FastAPI.
Mengkonversi semua exception menjadi format response standar.
"""

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.presentation.schemas.base_schema import error_response


def register_exception_handlers(app: FastAPI) -> None:
    """Daftarkan semua exception handlers ke aplikasi FastAPI."""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        details = []
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
            details.append({"field": field, "message": error["msg"]})
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=error_response(
                code="VALIDATION_ERROR",
                message="Input tidak valid",
                details=details,
            ),
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
        message = str(exc)

        # Map business logic error codes ke HTTP status
        error_map: dict[str, tuple[int, str]] = {
            "DUPLICATE_EMAIL": (status.HTTP_409_CONFLICT, "Email sudah terdaftar"),
            "USER_NOT_FOUND": (status.HTTP_404_NOT_FOUND, "User tidak ditemukan"),
            "PHOTO_NOT_FOUND": (status.HTTP_404_NOT_FOUND, "Foto tidak ditemukan"),
            "UNAUTHORIZED": (status.HTTP_401_UNAUTHORIZED, "Akses tidak diizinkan"),
        }

        if message in error_map:
            http_status, display_message = error_map[message]
            return JSONResponse(
                status_code=http_status,
                content=error_response(code=message, message=display_message),
            )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=error_response(code="UNPROCESSABLE", message=message),
        )

    @app.exception_handler(PermissionError)
    async def permission_error_handler(
        request: Request, exc: PermissionError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content=error_response(code="FORBIDDEN", message="Tidak memiliki izin"),
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response(
                code="INTERNAL_ERROR",
                message="Terjadi kesalahan pada server",
            ),
        )
