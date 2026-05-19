"""
Interface (Abstract Base Class) untuk repositories.
Mendefinisikan kontrak yang harus diimplementasikan oleh infrastructure layer.
"""

from abc import ABC, abstractmethod
from datetime import datetime
from uuid import UUID

from app.domain.entities.user import User


class IUserRepository(ABC):
    """Interface untuk user repository."""

    @abstractmethod
    async def save(self, user: User) -> User: ...

    @abstractmethod
    async def update(self, user: User) -> User: ...

    @abstractmethod
    async def find_by_id(self, user_id: UUID) -> User | None: ...

    @abstractmethod
    async def find_by_email(self, email: str) -> User | None: ...

    @abstractmethod
    async def email_exists(self, email: str) -> bool: ...


class IRefreshTokenRepository(ABC):
    """Interface untuk refresh token repository."""

    @abstractmethod
    async def save(self, user_id: UUID, token: str, expires_at: datetime) -> object: ...

    @abstractmethod
    async def find_valid(self, token: str) -> object | None: ...

    @abstractmethod
    async def revoke(self, token: str) -> None: ...

    @abstractmethod
    async def revoke_all_for_user(self, user_id: UUID) -> None: ...
