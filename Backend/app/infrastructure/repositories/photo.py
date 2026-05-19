from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.models import PhotoModel


class PhotoRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, photo: PhotoModel) -> PhotoModel:
        self._session.add(photo)
        await self._session.flush()
        await self._session.refresh(photo)
        return photo

    async def find_by_id(self, photo_id: UUID) -> PhotoModel | None:
        result = await self._session.execute(
            select(PhotoModel).where(PhotoModel.id == photo_id)
        )
        return result.scalar_one_or_none()

    async def find_by_user(self, user_id: UUID) -> list[PhotoModel]:
        result = await self._session.execute(
            select(PhotoModel)
            .where(PhotoModel.user_id == user_id)
            .order_by(PhotoModel.created_at.desc())
        )
        return list(result.scalars().all())

    async def delete(self, photo: PhotoModel) -> None:
        await self._session.delete(photo)
