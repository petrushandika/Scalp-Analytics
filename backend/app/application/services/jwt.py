"""
Service untuk manajemen JWT tokens.
Menangani pembuatan dan verifikasi access token dan refresh token.
"""

import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError

from app.config import get_settings


class JWTService:
    """Service untuk operasi JWT token."""

    def __init__(self) -> None:
        self._settings = get_settings()

    def create_access_token(self, user_id: UUID) -> str:
        """
        Buat access token JWT dengan expiry pendek (30 menit default).
        """
        settings = self._settings
        now = datetime.now(UTC)
        expire = now + timedelta(minutes=settings.jwt_access_token_expire_minutes)

        payload = {
            "sub": str(user_id),
            "type": "access",
            "iat": now,
            "exp": expire,
        }
        return jwt.encode(
            payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )

    def create_refresh_token(self) -> str:
        """
        Buat refresh token sebagai random secure string.
        Token disimpan sebagai hash di database.
        """
        return secrets.token_urlsafe(64)

    def get_refresh_token_expiry(self) -> datetime:
        """Kembalikan waktu expiry untuk refresh token."""
        return datetime.now(UTC) + timedelta(
            days=self._settings.jwt_refresh_token_expire_days
        )

    def verify_access_token(self, token: str) -> UUID:
        """
        Verifikasi access token dan kembalikan user_id.
        Raise exception jika token tidak valid atau expired.
        """
        settings = self._settings
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
        except ExpiredSignatureError:
            raise ValueError("Token sudah expired")
        except JWTError:
            raise ValueError("Token tidak valid")

        token_type = payload.get("type")
        if token_type != "access":
            raise ValueError("Bukan access token")

        user_id_str: str | None = payload.get("sub")
        if not user_id_str:
            raise ValueError("Token tidak memiliki subject")

        return UUID(user_id_str)
