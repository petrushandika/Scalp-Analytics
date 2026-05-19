"""
Unit tests untuk AuthService.
"""

from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest

from app.application.dto.requests import LoginDTO, RegisterUserDTO
from app.application.services.auth_service import AuthService
from app.application.services.jwt_service import JWTService
from app.domain.entities.user import User


@pytest.fixture
def active_user() -> User:
    import bcrypt

    hashed = bcrypt.hashpw(b"SecurePass1", bcrypt.gensalt()).decode()
    return User(
        id=uuid4(),
        email="user@example.com",
        hashed_password=hashed,
        full_name="Test User",
        is_active=True,
        is_verified=True,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )


@pytest.mark.asyncio
class TestRegister:
    async def test_register_success(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        """Registrasi berhasil dengan data valid."""
        mock_user_repo.email_exists = AsyncMock(return_value=False)
        mock_user_repo.save = AsyncMock(side_effect=lambda u: u)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        user = await service.register(
            RegisterUserDTO(
                email="new@example.com",
                password="SecurePass1",
                full_name="New User",
            )
        )

        assert user.email == "new@example.com"
        assert user.full_name == "New User"
        assert user.is_active is True
        assert user.is_verified is False
        mock_user_repo.save.assert_called_once()

    async def test_register_duplicate_email(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        """Registrasi gagal jika email sudah terdaftar."""
        mock_user_repo.email_exists = AsyncMock(return_value=True)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        with pytest.raises(ValueError, match="DUPLICATE_EMAIL"):
            await service.register(
                RegisterUserDTO(
                    email="existing@example.com",
                    password="SecurePass1",
                    full_name="User",
                )
            )

    async def test_register_weak_password(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        """Registrasi gagal jika password terlalu lemah."""
        mock_user_repo.email_exists = AsyncMock(return_value=False)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        with pytest.raises(ValueError, match="Password"):
            await service.register(
                RegisterUserDTO(
                    email="user@example.com",
                    password="weakpass",  # Tidak ada huruf kapital dan angka
                    full_name="User",
                )
            )


@pytest.mark.asyncio
class TestLogin:
    async def test_login_success(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
        active_user: User,
    ) -> None:
        """Login berhasil dengan kredensial valid."""
        mock_user_repo.find_by_email = AsyncMock(return_value=active_user)
        mock_token_repo.save = AsyncMock()
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        tokens = await service.login(
            LoginDTO(email="user@example.com", password="SecurePass1")
        )

        assert tokens.access_token
        assert tokens.refresh_token
        assert tokens.token_type == "Bearer"
        assert tokens.expires_in > 0

    async def test_login_wrong_password(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
        active_user: User,
    ) -> None:
        """Login gagal jika password salah."""
        mock_user_repo.find_by_email = AsyncMock(return_value=active_user)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        with pytest.raises(ValueError, match="Email atau password salah"):
            await service.login(
                LoginDTO(email="user@example.com", password="WrongPass1")
            )

    async def test_login_user_not_found(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        """Login gagal jika email tidak terdaftar."""
        mock_user_repo.find_by_email = AsyncMock(return_value=None)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        with pytest.raises(ValueError, match="Email atau password salah"):
            await service.login(
                LoginDTO(email="notfound@example.com", password="SecurePass1")
            )

    async def test_login_inactive_user(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
        active_user: User,
    ) -> None:
        """Login gagal jika akun tidak aktif."""
        active_user.is_active = False
        mock_user_repo.find_by_email = AsyncMock(return_value=active_user)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        with pytest.raises(ValueError, match="Akun tidak aktif"):
            await service.login(
                LoginDTO(email="user@example.com", password="SecurePass1")
            )


@pytest.mark.asyncio
class TestRefreshTokens:
    async def test_refresh_success(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
        active_user: User,
    ) -> None:
        """Refresh token berhasil dengan token valid."""
        token_model = MagicMock()
        token_model.user_id = active_user.id
        mock_token_repo.find_valid = AsyncMock(return_value=token_model)
        mock_token_repo.revoke = AsyncMock()
        mock_token_repo.save = AsyncMock()
        mock_user_repo.find_by_id = AsyncMock(return_value=active_user)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        tokens = await service.refresh_tokens("valid_refresh_token")

        assert tokens.access_token
        assert tokens.refresh_token
        mock_token_repo.revoke.assert_called_once_with("valid_refresh_token")

    async def test_refresh_invalid_token(
        self,
        mock_user_repo: MagicMock,
        mock_token_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        """Refresh token gagal jika token tidak valid."""
        mock_token_repo.find_valid = AsyncMock(return_value=None)
        service = AuthService(mock_user_repo, mock_token_repo, jwt_service)

        with pytest.raises(ValueError, match="Refresh token tidak valid"):
            await service.refresh_tokens("invalid_token")
