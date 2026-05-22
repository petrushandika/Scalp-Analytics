from dataclasses import dataclass
from datetime import UTC, date, datetime
from uuid import UUID, uuid4


@dataclass
class HabitLog:
    """
    Daily habit log for a user.
    Tracks sleep, stress, and general notes.
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
        now = datetime.now(UTC)
        instance = cls(
            id=uuid4(),
            user_id=user_id,
            log_date=log_date,
            created_at=now,
            updated_at=now,
        )
        if stress_level is not None or sleep_hours is not None or notes is not None:
            instance.update(
                stress_level=stress_level,
                sleep_hours=sleep_hours,
                notes=notes,
            )
        return instance

    def update(
        self,
        stress_level: int | None = None,
        sleep_hours: float | None = None,
        notes: str | None = None,
    ) -> None:
        if stress_level is not None:
            if not 1 <= stress_level <= 10:
                raise ValueError("Stress level harus antara 1 dan 10")
            self.stress_level = stress_level
        if sleep_hours is not None:
            if not 0 <= sleep_hours <= 24:
                raise ValueError("Sleep hours harus antara 0 dan 24")
            self.sleep_hours = sleep_hours
        if notes is not None:
            self.notes = notes
        self.updated_at = datetime.now(UTC)
