import uuid
from datetime import UTC, date, datetime, time

from sqlalchemy import (
    ARRAY,
    BigInteger,
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.database.db import Base


def utcnow() -> datetime:
    return datetime.now(UTC)


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


class UserModel(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'",
            name="email_format",
        ),
        CheckConstraint(
            "height_cm IS NULL OR (height_cm >= 100 AND height_cm <= 250)",
            name="height_range",
        ),
        CheckConstraint(
            "weight_kg IS NULL OR (weight_kg >= 30 AND weight_kg <= 300)",
            name="weight_range",
        ),
        CheckConstraint("age IS NULL OR (age >= 13 AND age <= 120)", name="age_range"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    height_cm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    weight_kg: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gender: Mapped[str | None] = mapped_column(
        Enum("male", "female", "other", name="gender_enum"), nullable=True
    )
    activity_level: Mapped[str | None] = mapped_column(
        Enum(
            "sedentary",
            "light",
            "moderate",
            "active",
            "very_active",
            name="activity_level_enum",
        ),
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    photos: Mapped[list["PhotoModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    quota: Mapped["QuotaModel | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )
    habits: Mapped[list["HabitModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    treatments: Mapped[list["TreatmentModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    meals: Mapped[list["MealModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    water: Mapped[list["WaterModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    notifications: Mapped[list["NotificationModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    preferences: Mapped["PreferenceModel | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )
    devices: Mapped[list["DeviceModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    tokens: Mapped[list["TokenModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    verifications: Mapped[list["VerificationModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    resets: Mapped[list["ResetModel"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# Photos
# ---------------------------------------------------------------------------


class PhotoModel(Base):
    __tablename__ = "photos"
    __table_args__ = (
        CheckConstraint(
            "density_percentage >= 0 AND density_percentage <= 100",
            name="density_range",
        ),
        CheckConstraint(
            "confidence_score >= 0 AND confidence_score <= 1", name="confidence_range"
        ),
        CheckConstraint(
            "severity_confidence >= 0 AND severity_confidence <= 1",
            name="severity_confidence_range",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    original_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    angle: Mapped[str] = mapped_column(
        Enum("front", "top", "right", "left", "custom", name="photo_angle_enum"),
        nullable=False,
    )
    custom_spot_label: Mapped[str | None] = mapped_column(String(100), nullable=True)
    density_percentage: Mapped[float | None] = mapped_column(
        Numeric(5, 2), nullable=True
    )
    confidence_score: Mapped[float | None] = mapped_column(Numeric(3, 2), nullable=True)
    detected_regions: Mapped[int | None] = mapped_column(Integer, nullable=True)
    balding_area_size: Mapped[float | None] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    severity_stage: Mapped[str | None] = mapped_column(
        Enum(
            "stage_0",
            "stage_1",
            "stage_2",
            "stage_3",
            "stage_4",
            "stage_5",
            "stage_6",
            "stage_7",
            name="severity_stage_enum",
        ),
        nullable=True,
    )
    severity_confidence: Mapped[float | None] = mapped_column(
        Numeric(3, 2), nullable=True
    )
    compression_status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "processing",
            "completed",
            "failed",
            name="compression_status_enum",
        ),
        default="completed",
        nullable=False,
    )
    original_size_bytes: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    compressed_size_bytes: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    original_width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    original_height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    compressed_width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    compressed_height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    compression_ratio: Mapped[float | None] = mapped_column(
        Numeric(5, 2), nullable=True
    )
    original_format: Mapped[str | None] = mapped_column(String(10), nullable=True)
    captured_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="photos")


class QuotaModel(Base):
    __tablename__ = "quotas"
    __table_args__ = (UniqueConstraint("user_id", name="unique_user_quota"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    total_photos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    photos_this_month: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    storage_used_bytes: Mapped[int] = mapped_column(
        BigInteger, default=0, nullable=False
    )
    storage_limit_bytes: Mapped[int] = mapped_column(
        BigInteger, default=524288000, nullable=False
    )
    max_photos_per_angle: Mapped[int] = mapped_column(
        Integer, default=5, nullable=False
    )
    max_photos_total: Mapped[int] = mapped_column(Integer, default=25, nullable=False)
    last_upload_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="quota")


# ---------------------------------------------------------------------------
# Habits
# ---------------------------------------------------------------------------


class HabitModel(Base):
    __tablename__ = "habits"
    __table_args__ = (
        UniqueConstraint("user_id", "log_date", name="unique_user_date"),
        CheckConstraint(
            "stress_level >= 1 AND stress_level <= 10", name="stress_range"
        ),
        CheckConstraint("sleep_hours >= 0 AND sleep_hours <= 24", name="sleep_range"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    stress_level: Mapped[int] = mapped_column(Integer, nullable=False)
    sleep_hours: Mapped[float] = mapped_column(Numeric(3, 1), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="habits")


# ---------------------------------------------------------------------------
# Treatments
# ---------------------------------------------------------------------------


class TreatmentModel(Base):
    __tablename__ = "treatments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    dosage: Mapped[str | None] = mapped_column(String(50), nullable=True)
    frequency: Mapped[str] = mapped_column(
        Enum("daily", "weekly", "custom", name="treatment_frequency_enum"),
        default="daily",
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="treatments")
    schedules: Mapped[list["ScheduleModel"]] = relationship(
        back_populates="treatment", cascade="all, delete-orphan"
    )


class ScheduleModel(Base):
    __tablename__ = "schedules"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    treatment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("treatments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    scheduled_time: Mapped[time] = mapped_column(Time, nullable=False)
    days_of_week: Mapped[list[int]] = mapped_column(
        ARRAY(Integer), nullable=False, server_default="{0,1,2,3,4,5,6}"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    treatment: Mapped["TreatmentModel"] = relationship(back_populates="schedules")
    completions: Mapped[list["CompletionModel"]] = relationship(
        back_populates="schedule", cascade="all, delete-orphan"
    )


class CompletionModel(Base):
    __tablename__ = "completions"
    __table_args__ = (
        UniqueConstraint("schedule_id", "log_date", name="unique_schedule_date"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    schedule_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("schedules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    scheduled_time: Mapped[time] = mapped_column(Time, nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    schedule: Mapped["ScheduleModel"] = relationship(back_populates="completions")


# ---------------------------------------------------------------------------
# Nutrition
# ---------------------------------------------------------------------------


class NutrientModel(Base):
    __tablename__ = "nutrients"
    __table_args__ = (
        CheckConstraint(
            "category IN ('macro', 'micro', 'vitamin', 'mineral')",
            name="category_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    daily_value: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    food_nutrients: Mapped[list["NutritionModel"]] = relationship(
        back_populates="nutrient", cascade="all, delete-orphan"
    )


class FoodModel(Base):
    __tablename__ = "foods"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(
        Enum(
            "protein",
            "vegetable",
            "fruit",
            "grain",
            "dairy",
            "meat",
            "seafood",
            "legume",
            "nut",
            "beverage",
            "other",
            name="food_category_enum",
        ),
        nullable=False,
        index=True,
    )
    brand: Mapped[str | None] = mapped_column(String(100), nullable=True)
    default_serving: Mapped[float] = mapped_column(
        Numeric(10, 2), default=100, nullable=False
    )
    default_unit: Mapped[str] = mapped_column(String(20), default="g", nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    food_nutrients: Mapped[list["NutritionModel"]] = relationship(
        back_populates="food", cascade="all, delete-orphan"
    )
    items: Mapped[list["ItemModel"]] = relationship(back_populates="food")


class NutritionModel(Base):
    __tablename__ = "nutrition"
    __table_args__ = (
        UniqueConstraint("food_id", "nutrient_id", name="unique_food_nutrient"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    food_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("foods.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    nutrient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("nutrients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    amount: Mapped[float] = mapped_column(Numeric(10, 3), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    food: Mapped["FoodModel"] = relationship(back_populates="food_nutrients")
    nutrient: Mapped["NutrientModel"] = relationship(back_populates="food_nutrients")


# ---------------------------------------------------------------------------
# Meals
# ---------------------------------------------------------------------------


class MealModel(Base):
    __tablename__ = "meals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    log_time: Mapped[time] = mapped_column(Time, nullable=False)
    meal_type: Mapped[str] = mapped_column(
        Enum("breakfast", "lunch", "dinner", "snack", name="meal_type_enum"),
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="meals")
    items: Mapped[list["ItemModel"]] = relationship(
        back_populates="meal", cascade="all, delete-orphan"
    )


class ItemModel(Base):
    __tablename__ = "items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="quantity_positive"),
        CheckConstraint("serving_multiplier > 0", name="serving_positive"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    meal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("meals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    food_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("foods.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    quantity: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    serving_multiplier: Mapped[float] = mapped_column(
        Numeric(5, 2), default=1.0, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    meal: Mapped["MealModel"] = relationship(back_populates="items")
    food: Mapped["FoodModel"] = relationship(back_populates="items")


# ---------------------------------------------------------------------------
# Water
# ---------------------------------------------------------------------------


class WaterModel(Base):
    __tablename__ = "water"
    __table_args__ = (
        UniqueConstraint("user_id", "log_date", name="unique_user_water_date"),
        CheckConstraint("amount_ml >= 0", name="amount_positive"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    amount_ml: Mapped[float] = mapped_column(Numeric(10, 0), default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="water")


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------


class PreferenceModel(Base):
    __tablename__ = "preferences"
    __table_args__ = (
        UniqueConstraint("user_id", name="unique_user_notification_prefs"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    treatment_reminder: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    habit_reminder: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    photo_reminder: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    streak_warning: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    insight_alert: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    progress_update: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email_marketing: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    push_notification: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    quiet_hours_start: Mapped[time | None] = mapped_column(Time, nullable=True)
    quiet_hours_end: Mapped[time | None] = mapped_column(Time, nullable=True)
    reminder_time_morning: Mapped[time | None] = mapped_column(
        Time, server_default="09:00:00", nullable=True
    )
    reminder_time_evening: Mapped[time | None] = mapped_column(
        Time, server_default="20:00:00", nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="preferences")


class NotificationModel(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type: Mapped[str] = mapped_column(
        Enum(
            "treatment_reminder",
            "habit_reminder",
            "photo_reminder",
            "streak_warning",
            "insight_alert",
            "progress_update",
            "severity_change",
            "goal_milestone",
            "welcome",
            "verification",
            name="notification_type_enum",
        ),
        nullable=False,
        index=True,
    )
    channel: Mapped[str] = mapped_column(
        Enum("in_app", "email", "push", "sms", name="notification_channel_enum"),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "sent",
            "failed",
            "read",
            "dismissed",
            name="notification_status_enum",
        ),
        default="pending",
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    scheduled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    sent_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    read_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    dismissed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="notifications")


class DeviceModel(Base):
    __tablename__ = "devices"
    __table_args__ = (UniqueConstraint("user_id", "token", name="unique_user_token"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    platform: Mapped[str] = mapped_column(
        Enum("ios", "android", "web", name="device_platform_enum"), nullable=False
    )
    device_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    device_model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, index=True
    )
    last_used_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="devices")


class TemplateModel(Base):
    __tablename__ = "templates"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    html_content: Mapped[str] = mapped_column(Text, nullable=False)
    text_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    variables: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )


# ---------------------------------------------------------------------------
# Auth tokens
# ---------------------------------------------------------------------------


class TokenModel(Base):
    __tablename__ = "tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="tokens")


class VerificationModel(Base):
    __tablename__ = "verifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="verifications")


class ResetModel(Base):
    __tablename__ = "resets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )

    user: Mapped["UserModel"] = relationship(back_populates="resets")
