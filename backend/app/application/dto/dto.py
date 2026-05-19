"""
Data Transfer Objects for the application layer.
"""

from dataclasses import dataclass
from uuid import UUID

from app.domain.entities.user import ActivityLevel, Gender


@dataclass
class RegisterUserDTO:
    """DTO untuk registrasi user baru."""

    email: str
    password: str
    full_name: str


@dataclass
class LoginDTO:
    """DTO untuk login user."""

    email: str
    password: str


@dataclass
class TokenPairDTO:
    """DTO untuk pasangan access token dan refresh token."""

    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int = 1800  # seconds


@dataclass
class UpdateProfileDTO:
    """DTO untuk update profil user."""

    user_id: UUID
    full_name: str | None = None
    avatar_url: str | None = None
    height_cm: int | None = None
    weight_kg: float | None = None
    age: int | None = None
    gender: Gender | None = None
    activity_level: ActivityLevel | None = None
