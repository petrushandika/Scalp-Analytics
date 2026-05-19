from dataclasses import dataclass
from datetime import UTC, datetime
from enum import Enum
from uuid import UUID, uuid4


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    ACTIVE = "active"
    VERY_ACTIVE = "very_active"


@dataclass
class User:
    """Core user entity with authentication and profile data."""

    id: UUID
    email: str
    hashed_password: str
    full_name: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    avatar_url: str | None = None
    height_cm: int | None = None
    weight_kg: float | None = None
    age: int | None = None
    gender: Gender | None = None
    activity_level: ActivityLevel | None = None

    @classmethod
    def create(cls, email: str, hashed_password: str, full_name: str) -> "User":
        now = datetime.now(UTC)
        return cls(
            id=uuid4(),
            email=email.strip().lower(),
            hashed_password=hashed_password,
            full_name=full_name.strip(),
            is_active=True,
            is_verified=False,
            created_at=now,
            updated_at=now,
        )

    def update_profile(
        self,
        full_name: str | None = None,
        avatar_url: str | None = None,
        height_cm: int | None = None,
        weight_kg: float | None = None,
        age: int | None = None,
        gender: Gender | None = None,
        activity_level: ActivityLevel | None = None,
    ) -> None:
        if full_name is not None:
            self.full_name = full_name.strip()
        if avatar_url is not None:
            self.avatar_url = avatar_url
        if height_cm is not None:
            self.height_cm = height_cm
        if weight_kg is not None:
            self.weight_kg = weight_kg
        if age is not None:
            self.age = age
        if gender is not None:
            self.gender = gender
        if activity_level is not None:
            self.activity_level = activity_level
        self.updated_at = datetime.now(UTC)

    def deactivate(self) -> None:
        self.is_active = False
        self.updated_at = datetime.now(UTC)

    def verify_email(self) -> None:
        self.is_verified = True
        self.updated_at = datetime.now(UTC)
