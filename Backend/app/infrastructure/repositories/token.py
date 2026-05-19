import hashlib
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.models import (
    EmailVerificationModel,
    PasswordResetModel,
    RefreshTokenModel,
)


class RefreshTokenRepository:
    """Repository untuk manajemen refresh tokens."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    async def save(
        self, user_id: UUID, token: str, expires_at: datetime
    ) -> RefreshTokenModel:
        """Simpan refresh token baru."""
        model = RefreshTokenModel(
            user_id=user_id,
            token_hash=self._hash_token(token),
            expires_at=expires_at,
            revoked=False,
        )
        self._session.add(model)
        await self._session.flush()
        return model

    async def find_valid(self, token: str) -> RefreshTokenModel | None:
        """Cari refresh token yang masih valid (tidak revoked dan belum expired)."""
        token_hash = self._hash_token(token)
        now = datetime.now(UTC)
        stmt = select(RefreshTokenModel).where(
            RefreshTokenModel.token_hash == token_hash,
            RefreshTokenModel.revoked.is_(False),
            RefreshTokenModel.expires_at > now,
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def revoke(self, token: str) -> None:
        """Revoke sebuah refresh token."""
        token_hash = self._hash_token(token)
        stmt = (
            update(RefreshTokenModel)
            .where(RefreshTokenModel.token_hash == token_hash)
            .values(revoked=True)
        )
        await self._session.execute(stmt)

    async def revoke_all_for_user(self, user_id: UUID) -> None:
        """Revoke semua refresh token milik user (untuk logout semua perangkat)."""
        stmt = (
            update(RefreshTokenModel)
            .where(
                RefreshTokenModel.user_id == user_id,
                RefreshTokenModel.revoked.is_(False),
            )
            .values(revoked=True)
        )
        await self._session.execute(stmt)


class EmailVerificationRepository:
    """Repository untuk manajemen email verification tokens."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    async def save(
        self, user_id: UUID, token: str, expires_at: datetime
    ) -> EmailVerificationModel:
        """Simpan email verification token baru."""
        model = EmailVerificationModel(
            user_id=user_id,
            token_hash=self._hash_token(token),
            expires_at=expires_at,
            verified=False,
        )
        self._session.add(model)
        await self._session.flush()
        return model

    async def find_valid(self, token: str) -> EmailVerificationModel | None:
        """Cari token verifikasi yang masih valid."""
        token_hash = self._hash_token(token)
        now = datetime.now(UTC)
        stmt = select(EmailVerificationModel).where(
            EmailVerificationModel.token_hash == token_hash,
            EmailVerificationModel.verified.is_(False),
            EmailVerificationModel.expires_at > now,
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def mark_verified(self, token: str) -> None:
        """Tandai token sebagai sudah diverifikasi."""
        token_hash = self._hash_token(token)
        stmt = (
            update(EmailVerificationModel)
            .where(EmailVerificationModel.token_hash == token_hash)
            .values(verified=True)
        )
        await self._session.execute(stmt)


class PasswordResetRepository:
    """Repository untuk manajemen password reset tokens."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    async def save(
        self, user_id: UUID, token: str, expires_at: datetime
    ) -> PasswordResetModel:
        """Simpan password reset token baru."""
        model = PasswordResetModel(
            user_id=user_id,
            token_hash=self._hash_token(token),
            expires_at=expires_at,
            used=False,
        )
        self._session.add(model)
        await self._session.flush()
        return model

    async def find_valid(self, token: str) -> PasswordResetModel | None:
        """Cari token reset password yang masih valid."""
        token_hash = self._hash_token(token)
        now = datetime.now(UTC)
        stmt = select(PasswordResetModel).where(
            PasswordResetModel.token_hash == token_hash,
            PasswordResetModel.used.is_(False),
            PasswordResetModel.expires_at > now,
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def mark_used(self, token: str) -> None:
        """Tandai token sebagai sudah digunakan."""
        token_hash = self._hash_token(token)
        stmt = (
            update(PasswordResetModel)
            .where(PasswordResetModel.token_hash == token_hash)
            .values(used=True)
        )
        await self._session.execute(stmt)
