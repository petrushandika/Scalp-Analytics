from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.database.models import FoodModel, MealModel, WaterModel


class FoodRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_by_id(self, food_id: UUID) -> FoodModel | None:
        result = await self._session.execute(
            select(FoodModel).where(FoodModel.id == food_id)
        )
        return result.scalar_one_or_none()

    async def search(self, query: str) -> list[FoodModel]:
        result = await self._session.execute(
            select(FoodModel).where(FoodModel.name.ilike(f"%{query}%")).limit(20)
        )
        return list(result.scalars().all())

    async def save(self, food: FoodModel) -> FoodModel:
        self._session.add(food)
        await self._session.flush()
        await self._session.refresh(food)
        return food


class MealRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, meal: MealModel) -> MealModel:
        self._session.add(meal)
        await self._session.flush()
        await self._session.refresh(meal)
        return meal

    async def find_by_id(self, meal_id: UUID) -> MealModel | None:
        result = await self._session.execute(
            select(MealModel)
            .where(MealModel.id == meal_id)
            .options(selectinload(MealModel.items))
        )
        return result.scalar_one_or_none()

    async def find_by_user_date(self, user_id: UUID, log_date: date) -> list[MealModel]:
        result = await self._session.execute(
            select(MealModel)
            .where(MealModel.user_id == user_id, MealModel.log_date == log_date)
            .options(selectinload(MealModel.items))
            .order_by(MealModel.log_time)
        )
        return list(result.scalars().all())

    async def find_by_user(self, user_id: UUID) -> list[MealModel]:
        result = await self._session.execute(
            select(MealModel)
            .where(MealModel.user_id == user_id)
            .order_by(MealModel.log_date.desc(), MealModel.log_time.desc())
        )
        return list(result.scalars().all())

    async def delete(self, meal: MealModel) -> None:
        await self._session.delete(meal)


class WaterRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_by_date(self, user_id: UUID, log_date: date) -> WaterModel | None:
        result = await self._session.execute(
            select(WaterModel).where(
                WaterModel.user_id == user_id,
                WaterModel.log_date == log_date,
            )
        )
        return result.scalar_one_or_none()

    async def find_by_user(self, user_id: UUID) -> list[WaterModel]:
        result = await self._session.execute(
            select(WaterModel)
            .where(WaterModel.user_id == user_id)
            .order_by(WaterModel.log_date.desc())
        )
        return list(result.scalars().all())

    async def save(self, water: WaterModel) -> WaterModel:
        self._session.add(water)
        await self._session.flush()
        await self._session.refresh(water)
        return water
