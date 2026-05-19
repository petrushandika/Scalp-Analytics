from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.user import ActivityLevel, Gender, User
from app.infrastructure.database.models import UserModel


class UserRepository:
    """
    Repository untuk operasi CRUD pada entity User.
    Menggunakan SQLAlchemy async untuk komunikasi dengan PostgreSQL.
    """

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, user: User) -> User:
        """Simpan user baru ke database."""
        model = self._to_model(user)
        self._session.add(model)
        await self._session.flush()
        return self._to_entity(model)

    async def update(self, user: User) -> User:
        """Update data user yang sudah ada."""
        model = await self._get_model_by_id(user.id)
        if not model:
            raise ValueError(f"User {user.id} tidak ditemukan")

        model.full_name = user.full_name
        model.avatar_url = user.avatar_url
        model.height_cm = user.height_cm
        model.weight_kg = user.weight_kg
        model.age = user.age
        model.gender = user.gender.value if user.gender else None
        model.activity_level = (
            user.activity_level.value if user.activity_level else None
        )
        model.is_active = user.is_active
        model.is_verified = user.is_verified
        model.updated_at = user.updated_at

        await self._session.flush()
        return self._to_entity(model)

    async def find_by_id(self, user_id: UUID) -> User | None:
        """Cari user berdasarkan ID."""
        model = await self._get_model_by_id(user_id)
        return self._to_entity(model) if model else None

    async def find_by_email(self, email: str) -> User | None:
        """Cari user berdasarkan email."""
        stmt = select(UserModel).where(UserModel.email == email.lower())
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def email_exists(self, email: str) -> bool:
        """Cek apakah email sudah terdaftar."""
        stmt = select(UserModel.id).where(UserModel.email == email.lower())
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def _get_model_by_id(self, user_id: UUID) -> UserModel | None:
        stmt = select(UserModel).where(UserModel.id == user_id)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    def _to_model(self, user: User) -> UserModel:
        """Konversi domain entity ke SQLAlchemy model."""
        return UserModel(
            id=user.id,
            email=user.email,
            hashed_password=user.hashed_password,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            height_cm=user.height_cm,
            weight_kg=user.weight_kg,
            age=user.age,
            gender=user.gender.value if user.gender else None,
            activity_level=user.activity_level.value if user.activity_level else None,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    def _to_entity(self, model: UserModel) -> User:
        """Konversi SQLAlchemy model ke domain entity."""
        return User(
            id=model.id,
            email=model.email,
            hashed_password=model.hashed_password,
            full_name=model.full_name,
            avatar_url=model.avatar_url,
            height_cm=model.height_cm,
            weight_kg=float(model.weight_kg) if model.weight_kg else None,
            age=model.age,
            gender=Gender(model.gender) if model.gender else None,
            activity_level=ActivityLevel(model.activity_level)
            if model.activity_level
            else None,
            is_active=model.is_active,
            is_verified=model.is_verified,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
