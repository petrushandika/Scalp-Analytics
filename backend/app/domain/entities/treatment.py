from dataclasses import dataclass
from datetime import UTC, date, datetime, time
from uuid import UUID, uuid4


@dataclass
class Treatment:
    """User treatment schedule (e.g. Minoxidil 1ml, Biotin 5000mcg)."""

    id: UUID
    user_id: UUID
    name: str
    frequency: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    dosage: str | None = None
    description: str | None = None

    @classmethod
    def create(
        cls,
        user_id: UUID,
        name: str,
        frequency: str,
        dosage: str | None = None,
        description: str | None = None,
    ) -> "Treatment":
        now = datetime.now(UTC)
        return cls(
            id=uuid4(),
            user_id=user_id,
            name=name.strip(),
            frequency=frequency,
            is_active=True,
            created_at=now,
            updated_at=now,
            dosage=dosage,
            description=description,
        )

    def update(
        self,
        name: str | None = None,
        frequency: str | None = None,
        dosage: str | None = None,
        description: str | None = None,
    ) -> None:
        if name is not None:
            self.name = name.strip()
        if frequency is not None:
            self.frequency = frequency
        if dosage is not None:
            self.dosage = dosage
        if description is not None:
            self.description = description
        self.updated_at = datetime.now(UTC)

    def deactivate(self) -> None:
        self.is_active = False
        self.updated_at = datetime.now(UTC)


@dataclass
class Schedule:
    """Specific time-based schedule for a treatment."""

    id: UUID
    treatment_id: UUID
    scheduled_time: time
    days_of_week: list[int]  # 0=Monday, 6=Sunday
    is_active: bool
    created_at: datetime
    updated_at: datetime

    @classmethod
    def create(
        cls,
        treatment_id: UUID,
        scheduled_time: time,
        days_of_week: list[int],
    ) -> "Schedule":
        now = datetime.now(UTC)
        return cls(
            id=uuid4(),
            treatment_id=treatment_id,
            scheduled_time=scheduled_time,
            days_of_week=days_of_week,
            is_active=True,
            created_at=now,
            updated_at=now,
        )


@dataclass
class Log:
    """Daily treatment completion log."""

    id: UUID
    schedule_id: UUID
    log_date: date
    scheduled_time: time
    completed: bool
    created_at: datetime
    completed_at: datetime | None = None
    notes: str | None = None

    @classmethod
    def create(cls, schedule_id: UUID, log_date: date, scheduled_time: time) -> "Log":
        return cls(
            id=uuid4(),
            schedule_id=schedule_id,
            log_date=log_date,
            scheduled_time=scheduled_time,
            completed=False,
            created_at=datetime.now(UTC),
        )

    def complete(self, notes: str | None = None) -> None:
        self.completed = True
        self.completed_at = datetime.now(UTC)
        if notes:
            self.notes = notes
