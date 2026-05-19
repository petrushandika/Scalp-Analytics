from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.models import TreatmentModel


class TreatmentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, treatment: TreatmentModel) -> TreatmentModel:
        self._session.add(treatment)
        await self._session.flush()
        await self._session.refresh(treatment)
        return treatment

    async def find_by_id(self, treatment_id: UUID) -> TreatmentModel | None:
        result = await self._session.execute(
            select(TreatmentModel).where(TreatmentModel.id == treatment_id)
        )
        return result.scalar_one_or_none()

    async def find_by_user(
        self, user_id: UUID, active_only: bool = False
    ) -> list[TreatmentModel]:
        stmt = select(TreatmentModel).where(TreatmentModel.user_id == user_id)
        if active_only:
            stmt = stmt.where(TreatmentModel.is_active.is_(True))
        stmt = stmt.order_by(TreatmentModel.created_at.desc())
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def delete(self, treatment: TreatmentModel) -> None:
        await self._session.delete(treatment)
