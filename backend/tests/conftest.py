"""
Konfigurasi pytest dan shared fixtures untuk semua tests.
"""

from datetime import UTC, datetime
from unittest.mock import MagicMock
from uuid import uuid4

import pytest

from app.application.services.auth_service import AuthService
from app.application.services.jwt_service import JWTService
from app.domain.entities.user import User
from app.infrastructure.repositories.token_repository import RefreshTokenRepository
from app.infrastructure.repositories.user_repository import UserRepository


@pytest.fixture
def sample_user() -> User:
    """Fixture: user entity contoh."""
    return User(
        id=uuid4(),
        email="test@example.com",
        hashed_password="$2b$12$fakehash",
        full_name="Test User",
        is_active=True,
        is_verified=False,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )


@pytest.fixture
def mock_user_repo() -> MagicMock:
    """Fixture: mock UserRepository."""
    return MagicMock(spec=UserRepository)


@pytest.fixture
def mock_token_repo() -> MagicMock:
    """Fixture: mock RefreshTokenRepository."""
    return MagicMock(spec=RefreshTokenRepository)


@pytest.fixture
def jwt_service() -> JWTService:
    """Fixture: JWTService instance."""
    return JWTService()


@pytest.fixture
def auth_service(
    mock_user_repo: MagicMock,
    mock_token_repo: MagicMock,
    jwt_service: JWTService,
) -> AuthService:
    """Fixture: AuthService dengan mock dependencies."""
    return AuthService(mock_user_repo, mock_token_repo, jwt_service)
