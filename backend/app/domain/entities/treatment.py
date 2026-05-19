from dataclasses import dataclass
from datetime import UTC, date, datetime, time
from uuid import UUID, uuid4


@dataclass
class Treatment:
    """
    Entity untuk jadwal perawatan rambut pengguna.
    Misalnya: Minoxidil 1ml, Biotin 5000mcg, dll.
    """

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
        """Factory method untuk membuat treatment baru."""
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
        """Update data treatment."""
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
        """Nonaktifkan treatment."""
        self.is_active = False
        self.updated_at = datetime.now(UTC)


@dataclass
class TreatmentSchedule:
    """
    Entity untuk jadwal spesifik treatment.
    Menentukan jam dan hari kapan treatment harus dilakukan.
    """

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
    ) -> "TreatmentSchedule":
        """Factory method untuk membuat schedule baru."""
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
class TreatmentLog:
    """
    Entity untuk log penyelesaian treatment harian.
    """

    id: UUID
    schedule_id: UUID
    log_date: date
    scheduled_time: time
    completed: bool
    created_at: datetime
    completed_at: datetime | None = None
    notes: str | None = None

    @classmethod
    def create(
        cls,
        schedule_id: UUID,
        log_date: date,
        scheduled_time: time,
    ) -> "TreatmentLog":
        """Factory method untuk membuat log baru."""
        return cls(
            id=uuid4(),
            schedule_id=schedule_id,
            log_date=log_date,
            scheduled_time=scheduled_time,
            completed=False,
            created_at=datetime.now(UTC),
        )

    def mark_complete(self, notes: str | None = None) -> None:
        """Tandai treatment sebagai selesai."""
        self.completed = True
        self.completed_at = datetime.now(UTC)
        if notes:
            self.notes = notes
