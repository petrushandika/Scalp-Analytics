from dataclasses import dataclass
from datetime import UTC, datetime
from enum import Enum
from uuid import UUID, uuid4

from app.domain.values.angle import PhotoAngle


class Severity(str, Enum):
    """Hair loss severity based on Norwood Scale."""

    STAGE_0 = "stage_0"    # >85% density - No Hair Loss
    STAGE_1 = "stage_1"    # 70-85%        - Minimal
    STAGE_3 = "stage_3"    # 50-70%        - Moderate
    STAGE_5 = "stage_5"    # 30-50%        - Advanced
    STAGE_7 = "stage_7"    # <30%          - Severe

    @classmethod
    def from_density(cls, density: float) -> "Severity":
        if density > 85:
            return cls.STAGE_0
        elif density >= 70:
            return cls.STAGE_1
        elif density >= 50:
            return cls.STAGE_3
        elif density >= 30:
            return cls.STAGE_5
        else:
            return cls.STAGE_7

    def recommendation(self) -> str:
        recs = {
            Severity.STAGE_0: "Preventive care",
            Severity.STAGE_1: "Monitoring + early treatment",
            Severity.STAGE_3: "Active treatment (Minoxidil)",
            Severity.STAGE_5: "Intensive treatment",
            Severity.STAGE_7: "Medical consultation / transplant",
        }
        return recs[self]


@dataclass
class Photo:
    """Photo entity for hair density analysis."""

    id: UUID
    user_id: UUID
    image_url: str
    angle: PhotoAngle
    created_at: datetime
    thumbnail_url: str | None = None
    custom_label: str | None = None
    density: float | None = None
    confidence: float | None = None
    regions: int | None = None
    bald_area: float | None = None
    severity: Severity | None = None
    severity_confidence: float | None = None
    captured_at: datetime | None = None

    @classmethod
    def create(
        cls,
        user_id: UUID,
        image_url: str,
        angle: PhotoAngle,
        thumbnail_url: str | None = None,
        custom_label: str | None = None,
        captured_at: datetime | None = None,
    ) -> "Photo":
        return cls(
            id=uuid4(),
            user_id=user_id,
            image_url=image_url,
            angle=angle,
            created_at=datetime.now(UTC),
            thumbnail_url=thumbnail_url,
            custom_label=custom_label,
            captured_at=captured_at or datetime.now(UTC),
        )

    def set_analysis(
        self,
        density: float,
        confidence: float,
        regions: int | None = None,
        bald_area: float | None = None,
        severity_confidence: float | None = None,
    ) -> None:
        self.density = density
        self.confidence = confidence
        self.regions = regions
        self.bald_area = bald_area
        self.severity = Severity.from_density(density)
        self.severity_confidence = severity_confidence

    @property
    def analyzed(self) -> bool:
        return self.density is not None
