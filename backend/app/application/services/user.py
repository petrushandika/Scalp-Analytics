"""
Service untuk manajemen profil pengguna.
"""

from uuid import UUID

from app.application.dto.dto import UpdateProfileDTO
from app.domain.entities.user import User
from app.infrastructure.repositories.user import UserRepository


class UserService:
    """Application service untuk operasi terkait user."""

    def __init__(self, user_repo: UserRepository) -> None:
        self._user_repo = user_repo

    async def get_profile(self, user_id: UUID) -> User:
        """Ambil profil user berdasarkan ID."""
        user = await self._user_repo.find_by_id(user_id)
        if not user:
            raise ValueError("USER_NOT_FOUND")
        return user

    async def update_profile(self, dto: UpdateProfileDTO) -> User:
        """Update profil user."""
        user = await self._user_repo.find_by_id(dto.user_id)
        if not user:
            raise ValueError("USER_NOT_FOUND")

        user.update_profile(
            full_name=dto.full_name,
            avatar_url=dto.avatar_url,
            height_cm=dto.height_cm,
            weight_kg=dto.weight_kg,
            age=dto.age,
            gender=dto.gender,
            activity_level=dto.activity_level,
        )
        return await self._user_repo.update(user)

    async def delete_account(self, user_id: UUID) -> None:
        """Nonaktifkan akun user (soft delete)."""
        user = await self._user_repo.find_by_id(user_id)
        if not user:
            raise ValueError("USER_NOT_FOUND")
        user.deactivate()
        await self._user_repo.update(user)
