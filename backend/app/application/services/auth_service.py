"""
Service untuk autentikasi pengguna.
Mengorkestrasi proses register, login, refresh token, dan logout.
"""

import re

import bcrypt

from app.application.dto.requests import LoginDTO, RegisterUserDTO, TokenPairDTO
from app.application.services.jwt_service import JWTService
from app.domain.entities.user import User
from app.infrastructure.repositories.token_repository import RefreshTokenRepository
from app.infrastructure.repositories.user_repository import UserRepository


PASSWORD_PATTERN = re.compile(r"^(?=.*[A-Z])(?=.*\d).{8,}$")


class AuthService:
    """
    Application service untuk autentikasi.
    Bertanggung jawab atas: register, login, refresh, logout.
    """

    def __init__(
        self,
        user_repo: UserRepository,
        token_repo: RefreshTokenRepository,
        jwt_service: JWTService | None = None,
    ) -> None:
        self._user_repo = user_repo
        self._token_repo = token_repo
        self._jwt = jwt_service or JWTService()

    async def register(self, dto: RegisterUserDTO) -> User:
        """
        Registrasi user baru.
        - Validasi format password
        - Cek duplikasi email
        - Hash password
        - Buat user baru
        """
        if not PASSWORD_PATTERN.match(dto.password):
            raise ValueError(
                "Password minimal 8 karakter, mengandung 1 huruf kapital dan 1 angka"
            )

        if await self._user_repo.email_exists(dto.email):
            raise ValueError("DUPLICATE_EMAIL")

        hashed_password = bcrypt.hashpw(
            dto.password.encode(), bcrypt.gensalt()
        ).decode()
        user = User.create(
            email=dto.email,
            hashed_password=hashed_password,
            full_name=dto.full_name,
        )
        return await self._user_repo.save(user)

    async def login(self, dto: LoginDTO) -> TokenPairDTO:
        """
        Login user dengan email dan password.
        Kembalikan pasangan access token dan refresh token.
        """
        user = await self._user_repo.find_by_email(dto.email)
        if not user:
            raise ValueError("Email atau password salah")

        if not bcrypt.checkpw(dto.password.encode(), user.hashed_password.encode()):
            raise ValueError("Email atau password salah")

        if not user.is_active:
            raise ValueError("Akun tidak aktif")

        access_token = self._jwt.create_access_token(user.id)
        refresh_token = self._jwt.create_refresh_token()
        expires_at = self._jwt.get_refresh_token_expiry()

        await self._token_repo.save(user.id, refresh_token, expires_at)

        return TokenPairDTO(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=self._jwt._settings.jwt_access_token_expire_minutes * 60,
        )

    async def refresh_tokens(self, refresh_token: str) -> TokenPairDTO:
        """
        Refresh access token menggunakan refresh token yang valid.
        Implements token rotation: token lama direvoke, token baru dibuat.
        """
        token_model = await self._token_repo.find_valid(refresh_token)
        if not token_model:
            raise ValueError("Refresh token tidak valid atau sudah expired")

        # Revoke token lama (token rotation)
        await self._token_repo.revoke(refresh_token)

        user = await self._user_repo.find_by_id(token_model.user_id)
        if not user or not user.is_active:
            raise ValueError("User tidak ditemukan atau tidak aktif")

        # Buat token baru
        new_access_token = self._jwt.create_access_token(user.id)
        new_refresh_token = self._jwt.create_refresh_token()
        expires_at = self._jwt.get_refresh_token_expiry()

        await self._token_repo.save(user.id, new_refresh_token, expires_at)

        return TokenPairDTO(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_in=self._jwt._settings.jwt_access_token_expire_minutes * 60,
        )

    async def logout(self, refresh_token: str) -> None:
        """Logout dengan merevoke refresh token."""
        await self._token_repo.revoke(refresh_token)

    async def logout_all_devices(self, user_id_str: str) -> None:
        """Logout dari semua perangkat dengan merevoke semua refresh token user."""
        from uuid import UUID

        await self._token_repo.revoke_all_for_user(UUID(user_id_str))

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifikasi password."""
        return bool(bcrypt.checkpw(plain_password.encode(), hashed_password.encode()))

    def hash_password(self, password: str) -> str:
        """Hash password baru."""
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
