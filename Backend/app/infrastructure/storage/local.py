import uuid
from pathlib import Path

import aiofiles

from app.config import get_settings


_EXT_MAP = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


class LocalStorage:
    """Simpan file ke disk lokal. Mudah diganti S3/GCS di production."""

    def __init__(self) -> None:
        settings = get_settings()
        self._root = Path(settings.storage_path) / "uploads"
        self._root.mkdir(parents=True, exist_ok=True)

    async def save(self, data: bytes, content_type: str) -> str:
        """Simpan bytes ke disk, kembalikan URL relatif."""
        ext = _EXT_MAP.get(content_type, ".jpg")
        filename = f"{uuid.uuid4()}{ext}"
        dest = self._root / filename
        async with aiofiles.open(dest, "wb") as f:
            await f.write(data)
        return f"/uploads/{filename}"

    async def delete(self, url: str) -> None:
        """Hapus file berdasarkan URL relatif."""
        filename = url.removeprefix("/uploads/")
        path = self._root / Path(filename).name
        if path.exists():
            path.unlink()
