from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.models import HabitModel


class HabitRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, habit: HabitModel) -> HabitModel:
        self._session.add(habit)
        await self._session.flush()
        await self._session.refresh(habit)
        return habit

    async def find_by_id(self, habit_id: UUID) -> HabitModel | None:
        result = await self._session.execute(
            select(HabitModel).where(HabitModel.id == habit_id)
        )
        return result.scalar_one_or_none()

    async def find_by_user(self, user_id: UUID) -> list[HabitModel]:
        result = await self._session.execute(
            select(HabitModel)
            .where(HabitModel.user_id == user_id)
            .order_by(HabitModel.log_date.desc())
        )
        return list(result.scalars().all())

    async def find_by_date(self, user_id: UUID, log_date: date) -> HabitModel | None:
        result = await self._session.execute(
            select(HabitModel).where(
                HabitModel.user_id == user_id,
                HabitModel.log_date == log_date,
            )
        )
        return result.scalar_one_or_none()

    async def delete(self, habit: HabitModel) -> None:
        await self._session.delete(habit)
