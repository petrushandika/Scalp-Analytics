"""
Unit tests untuk domain entities.
"""

from datetime import date
from uuid import uuid4

import pytest

from app.domain.entities.habit import HabitLog
from app.domain.entities.photo import Photo, Severity
from app.domain.entities.user import Gender, User
from app.domain.values.angle import PhotoAngle
from app.domain.values.email import Email


class TestUserEntity:
    def test_create_user(self) -> None:
        """User berhasil dibuat dengan factory method."""
        user = User.create(
            email="test@example.com",
            hashed_password="hashed",
            full_name="Test User",
        )
        assert user.email == "test@example.com"
        assert user.full_name == "Test User"
        assert user.is_active is True
        assert user.is_verified is False
        assert user.id is not None

    def test_create_user_normalizes_email(self) -> None:
        """Email dinormalisasi menjadi lowercase saat membuat user."""
        user = User.create(
            email="  TEST@EXAMPLE.COM  ",
            hashed_password="hashed",
            full_name="Test User",
        )
        assert user.email == "test@example.com"

    def test_update_profile(self) -> None:
        """Profil user berhasil diupdate."""
        user = User.create("test@example.com", "hashed", "Test User")
        user.update_profile(
            full_name="Updated Name",
            height_cm=175,
            weight_kg=70.5,
            age=25,
            gender=Gender.MALE,
        )
        assert user.full_name == "Updated Name"
        assert user.height_cm == 175
        assert user.weight_kg == 70.5
        assert user.age == 25
        assert user.gender == Gender.MALE

    def test_deactivate_user(self) -> None:
        """User berhasil dinonaktifkan."""
        user = User.create("test@example.com", "hashed", "Test User")
        assert user.is_active is True
        user.deactivate()
        assert user.is_active is False

    def test_verify_email(self) -> None:
        """Email berhasil diverifikasi."""
        user = User.create("test@example.com", "hashed", "Test User")
        assert user.is_verified is False
        user.verify_email()
        assert user.is_verified is True


class TestPhotoEntity:
    def test_create_photo(self) -> None:
        """Foto berhasil dibuat."""
        photo = Photo.create(
            user_id=uuid4(),
            image_url="https://example.com/photo.jpg",
            angle=PhotoAngle.FRONT,
        )
        assert photo.image_url == "https://example.com/photo.jpg"
        assert photo.angle == PhotoAngle.FRONT
        assert photo.analyzed is False

    def test_set_analysis_result(self) -> None:
        """Hasil analisis berhasil disimpan ke foto."""
        photo = Photo.create(
            user_id=uuid4(),
            image_url="https://example.com/photo.jpg",
            angle=PhotoAngle.TOP,
        )
        photo.set_analysis(density=75.0, confidence=0.92)
        assert photo.density == 75.0
        assert photo.confidence == 0.92
        assert photo.severity == Severity.STAGE_1
        assert photo.analyzed is True

    def test_severity_classification(self) -> None:
        """Severity diklasifikasikan dengan benar berdasarkan density."""
        assert Severity.from_density(90.0) == Severity.STAGE_0
        assert Severity.from_density(75.0) == Severity.STAGE_1
        assert Severity.from_density(60.0) == Severity.STAGE_3
        assert Severity.from_density(40.0) == Severity.STAGE_5
        assert Severity.from_density(20.0) == Severity.STAGE_7


class TestHabitLogEntity:
    def test_create_habit_log(self) -> None:
        """HabitLog berhasil dibuat."""
        log = HabitLog.create(
            user_id=uuid4(),
            log_date=date.today(),
            stress_level=5,
            sleep_hours=7.5,
        )
        assert log.stress_level == 5
        assert log.sleep_hours == 7.5

    def test_update_habit_log(self) -> None:
        """HabitLog berhasil diupdate."""
        log = HabitLog.create(user_id=uuid4(), log_date=date.today())
        log.update(stress_level=8, sleep_hours=6.0, notes="Hari yang melelahkan")
        assert log.stress_level == 8
        assert log.sleep_hours == 6.0
        assert log.notes == "Hari yang melelahkan"

    def test_update_invalid_stress_level(self) -> None:
        """Update stress level di luar range menghasilkan ValueError."""
        log = HabitLog.create(user_id=uuid4(), log_date=date.today())
        with pytest.raises(ValueError, match="Stress level"):
            log.update(stress_level=11)

    def test_update_invalid_sleep_hours(self) -> None:
        """Update sleep hours di luar range menghasilkan ValueError."""
        log = HabitLog.create(user_id=uuid4(), log_date=date.today())
        with pytest.raises(ValueError, match="Sleep hours"):
            log.update(sleep_hours=25.0)


class TestEmailValueObject:
    def test_valid_email(self) -> None:
        """Email valid berhasil dibuat."""
        email = Email.create("user@example.com")
        assert str(email) == "user@example.com"

    def test_email_normalized_to_lowercase(self) -> None:
        """Email dinormalisasi ke lowercase."""
        email = Email.create("User@EXAMPLE.COM")
        assert str(email) == "user@example.com"

    def test_invalid_email_format(self) -> None:
        """Email dengan format tidak valid menghasilkan ValueError."""
        with pytest.raises(ValueError, match="Format email tidak valid"):
            Email.create("not-an-email")

    def test_empty_email(self) -> None:
        """Email kosong menghasilkan ValueError."""
        with pytest.raises(ValueError, match="tidak boleh kosong"):
            Email.create("")
