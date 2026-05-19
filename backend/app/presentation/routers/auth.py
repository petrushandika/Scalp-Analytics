from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.requests import LoginDTO, RegisterUserDTO
from app.application.services.auth_service import AuthService
from app.application.services.jwt_service import JWTService
from app.infrastructure.database.connection import get_db
from app.infrastructure.repositories.token_repository import RefreshTokenRepository
from app.infrastructure.repositories.user_repository import UserRepository
from app.presentation.middleware.auth_middleware import CurrentUser
from app.presentation.schemas.auth_schema import (
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    UserResponse,
)
from app.presentation.schemas.base_schema import SuccessResponse, success_response


router = APIRouter()


def get_auth_service(db: AsyncSession) -> AuthService:
    user_repo = UserRepository(db)
    token_repo = RefreshTokenRepository(db)
    return AuthService(user_repo, token_repo, JWTService())


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=SuccessResponse[RegisterResponse],
    summary="Registrasi pengguna baru",
)
async def register(
    request: RegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    Daftarkan akun pengguna baru.

    - **email**: Alamat email valid dan unik
    - **password**: Min 8 karakter, 1 huruf kapital, 1 angka
    - **full_name**: Nama lengkap (2-100 karakter)
    """
    service = get_auth_service(db)
    user = await service.register(
        RegisterUserDTO(
            email=str(request.email),
            password=request.password,
            full_name=request.full_name,
        )
    )
    return success_response(
        RegisterResponse(
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                full_name=user.full_name,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at,
            ),
            message="Registrasi berhasil. Silakan verifikasi email Anda.",
        )
    )


@router.post(
    "/login",
    response_model=SuccessResponse[TokenResponse],
    summary="Login pengguna",
)
async def login(
    request: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    Autentikasi pengguna dengan email dan password.
    Mengembalikan access token dan refresh token.
    """
    service = get_auth_service(db)
    tokens = await service.login(
        LoginDTO(email=str(request.email), password=request.password)
    )
    return success_response(
        TokenResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            token_type=tokens.token_type,
            expires_in=tokens.expires_in,
        )
    )


@router.post(
    "/refresh",
    response_model=SuccessResponse[TokenResponse],
    summary="Refresh access token",
)
async def refresh_token(
    request: RefreshRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    Dapatkan access token baru menggunakan refresh token.
    Refresh token lama akan direvoke (token rotation).
    """
    service = get_auth_service(db)
    tokens = await service.refresh_tokens(request.refresh_token)
    return success_response(
        TokenResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            token_type=tokens.token_type,
            expires_in=tokens.expires_in,
        )
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Logout pengguna",
)
async def logout(
    request: LogoutRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: CurrentUser,
) -> None:
    """Logout dari sesi saat ini dengan merevoke refresh token."""
    service = get_auth_service(db)
    await service.logout(request.refresh_token)


@router.post(
    "/logout-all",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Logout dari semua perangkat",
)
async def logout_all(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: CurrentUser,
) -> None:
    """Logout dari semua perangkat dengan merevoke semua refresh token."""
    service = get_auth_service(db)
    await service.logout_all_devices(str(current_user.id))
