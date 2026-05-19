"""
Unit tests untuk JWTService.
"""

from datetime import UTC
from uuid import uuid4

import pytest

from app.application.services.jwt import JWTService


@pytest.fixture
def jwt_service() -> JWTService:
    return JWTService()


class TestJWTService:
    def test_create_access_token(self, jwt_service: JWTService) -> None:
        """Access token berhasil dibuat."""
        user_id = uuid4()
        token = jwt_service.create_access_token(user_id)
        assert token
        assert len(token) > 20

    def test_verify_access_token(self, jwt_service: JWTService) -> None:
        """Access token berhasil diverifikasi dan mengembalikan user_id yang benar."""
        user_id = uuid4()
        token = jwt_service.create_access_token(user_id)
        verified_id = jwt_service.verify_access_token(token)
        assert verified_id == user_id

    def test_verify_invalid_token(self, jwt_service: JWTService) -> None:
        """Token tidak valid menghasilkan ValueError."""
        with pytest.raises(ValueError, match="Token tidak valid"):
            jwt_service.verify_access_token("invalid.token.here")

    def test_create_refresh_token(self, jwt_service: JWTService) -> None:
        """Refresh token berhasil dibuat sebagai random string."""
        token1 = jwt_service.create_refresh_token()
        token2 = jwt_service.create_refresh_token()
        assert token1
        assert token2
        assert token1 != token2  # Setiap token harus unik

    def test_get_refresh_token_expiry(self, jwt_service: JWTService) -> None:
        """Expiry refresh token berada di masa depan."""
        from datetime import datetime

        expiry = jwt_service.get_refresh_token_expiry()
        assert expiry > datetime.now(UTC)
