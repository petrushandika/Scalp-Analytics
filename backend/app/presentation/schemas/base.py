"""
Base schemas untuk format response standar API.
Semua response mengikuti format: { success, data/error, meta }.
"""

import uuid
from datetime import UTC, datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field


DataT = TypeVar("DataT")


class MetaSchema(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))


class SuccessResponse(BaseModel, Generic[DataT]):
    success: bool = True
    data: DataT
    meta: MetaSchema = Field(default_factory=MetaSchema)


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str


class ErrorInfo(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorInfo
    meta: MetaSchema = Field(default_factory=MetaSchema)


def success_response(data: Any, **kwargs: Any) -> dict[str, Any]:
    """Helper untuk membuat dict response sukses."""
    return SuccessResponse(data=data, **kwargs).model_dump(mode="json")


def error_response(
    code: str, message: str, details: list[dict[str, str]] | None = None
) -> dict[str, Any]:
    """Helper untuk membuat dict response error."""
    return ErrorResponse(
        error=ErrorInfo(
            code=code,
            message=message,
            details=[ErrorDetail(**d) for d in (details or [])],
        )
    ).model_dump(mode="json")
