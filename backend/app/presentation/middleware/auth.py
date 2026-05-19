"""
Auth middleware dan dependency injection untuk proteksi endpoint.
"""

from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.jwt import JWTService
from app.domain.entities.user import User
from app.infrastructure.database.db import get_db
from app.infrastructure.repositories.user import UserRepository


bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    FastAPI dependency untuk mendapatkan user yang sedang login.
    Verifikasi Bearer token dan kembalikan user entity.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"code": "UNAUTHORIZED", "message": "Token tidak valid atau expired"},
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        jwt_service = JWTService()
        user_id: UUID = jwt_service.verify_access_token(credentials.credentials)
    except ValueError:
        raise credentials_exception

    user_repo = UserRepository(db)
    user = await user_repo.find_by_id(user_id)

    if not user:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Akun tidak aktif"},
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
