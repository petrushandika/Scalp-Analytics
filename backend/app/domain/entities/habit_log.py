from dataclasses import dataclass
from datetime import UTC, date, datetime
from uuid import UUID, uuid4


@dataclass
class HabitLog:
    """
    Entity untuk pencatatan kebiasaan harian pengguna.
    Mencatat faktor-faktor yang berkorelasi dengan kesehatan rambut.
    """

    id: UUID
    user_id: UUID
    log_date: date
    created_at: datetime
    updated_at: datetime
    stress_level: int | None = None  # 1-10
    sleep_hours: float | None = None  # 0-24
    notes: str | None = None

    @classmethod
    def create(
        cls,
        user_id: UUID,
        log_date: date,
        stress_level: int | None = None,
        sleep_hours: float | None = None,
        notes: str | None = None,
    ) -> "HabitLog":
        """Factory method untuk membuat habit log baru."""
        now = datetime.now(UTC)
        return cls(
            id=uuid4(),
            user_id=user_id,
            log_date=log_date,
            created_at=now,
            updated_at=now,
            stress_level=stress_level,
            sleep_hours=sleep_hours,
            notes=notes,
        )

    def update(
        self,
        stress_level: int | None = None,
        sleep_hours: float | None = None,
        notes: str | None = None,
    ) -> None:
        """Update data habit log."""
        if stress_level is not None:
            if not (1 <= stress_level <= 10):
                raise ValueError("Stress level harus antara 1-10")
            self.stress_level = stress_level
        if sleep_hours is not None:
            if not (0 <= sleep_hours <= 24):
                raise ValueError("Sleep hours harus antara 0-24")
            self.sleep_hours = sleep_hours
        if notes is not None:
            self.notes = notes[:500] if len(notes) > 500 else notes
        self.updated_at = datetime.now(UTC)
