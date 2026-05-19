import re
from dataclasses import dataclass


EMAIL_PATTERN = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


@dataclass(frozen=True)
class Email:
    """Immutable, self-validating email value object."""

    value: str

    def __post_init__(self) -> None:
        if not self.value or not self.value.strip():
            raise ValueError("Email tidak boleh kosong")
        normalized = self.value.strip().lower()
        if not EMAIL_PATTERN.match(normalized):
            raise ValueError(f"Format email tidak valid: {self.value}")
        object.__setattr__(self, "value", normalized)

    def __str__(self) -> str:
        return self.value

    @classmethod
    def create(cls, value: str) -> "Email":
        return cls(value=value)
