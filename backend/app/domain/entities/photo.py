from dataclasses import dataclass
from datetime import UTC, datetime
from enum import Enum
from uuid import UUID, uuid4

from app.domain.value_objects.photo_angle import PhotoAngle


class SeverityStage(str, Enum):
    """Klasifikasi severity berdasarkan Norwood Scale."""

    STAGE_0 = "stage_0"  # >85% density, No Hair Loss
    STAGE_1_2 = "stage_1_2"  # 70-85%, Minimal
    STAGE_3_4 = "stage_3_4"  # 50-70%, Moderate
    STAGE_5_6 = "stage_5_6"  # 30-50%, Advanced
    STAGE_7 = "stage_7"  # <30%, Severe

    @classmethod
    def from_density(cls, density: float) -> "SeverityStage":
        """Klasifikasi severity berdasarkan persentase density."""
        if density > 85:
            return cls.STAGE_0
        elif density >= 70:
            return cls.STAGE_1_2
        elif density >= 50:
            return cls.STAGE_3_4
        elif density >= 30:
            return cls.STAGE_5_6
        else:
            return cls.STAGE_7

    def get_recommendation(self) -> str:
        recommendations = {
            SeverityStage.STAGE_0: "Preventive care",
            SeverityStage.STAGE_1_2: "Monitoring + preventif",
            SeverityStage.STAGE_3_4: "Treatment aktif (Minoxidil)",
            SeverityStage.STAGE_5_6: "Treatment intensif",
            SeverityStage.STAGE_7: "Konsultasi medis/transplant",
        }
        return recommendations[self]


@dataclass
class Photo:
    """
    Entity foto yang merepresentasikan foto analisis rambut pengguna.
    """

    id: UUID
    user_id: UUID
    image_url: str
    angle: PhotoAngle
    created_at: datetime
    thumbnail_url: str | None = None
    custom_spot_label: str | None = None
    density_percentage: float | None = None
    confidence_score: float | None = None
    detected_regions: int | None = None
    balding_area_size: float | None = None
    severity_stage: SeverityStage | None = None
    severity_confidence: float | None = None
    captured_at: datetime | None = None

    @classmethod
    def create(
        cls,
        user_id: UUID,
        image_url: str,
        angle: PhotoAngle,
        thumbnail_url: str | None = None,
        custom_spot_label: str | None = None,
        captured_at: datetime | None = None,
    ) -> "Photo":
        """Factory method untuk membuat foto baru."""
        return cls(
            id=uuid4(),
            user_id=user_id,
            image_url=image_url,
            angle=angle,
            created_at=datetime.now(UTC),
            thumbnail_url=thumbnail_url,
            custom_spot_label=custom_spot_label,
            captured_at=captured_at or datetime.now(UTC),
        )

    def set_analysis_result(
        self,
        density: float,
        confidence: float,
        detected_regions: int | None = None,
        balding_area_size: float | None = None,
        severity_confidence: float | None = None,
    ) -> None:
        """Set hasil analisis AI pada foto."""
        self.density_percentage = density
        self.confidence_score = confidence
        self.detected_regions = detected_regions
        self.balding_area_size = balding_area_size
        self.severity_stage = SeverityStage.from_density(density)
        self.severity_confidence = severity_confidence

    @property
    def is_analyzed(self) -> bool:
        """Cek apakah foto sudah dianalisis."""
        return self.density_percentage is not None
