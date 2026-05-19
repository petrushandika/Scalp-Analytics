from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.infrastructure.database.db import create_tables, dispose_engine
from app.presentation.middleware.error import register_exception_handlers
from app.presentation.routers import (
    analytics,
    auth,
    habit,
    nutrition,
    photo,
    treatment,
    user,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifecycle handler untuk startup dan shutdown."""
    await create_tables()
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description="AI-powered hair health management system",
        version="0.1.0",
        debug=settings.app_debug,
        lifespan=lifespan,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    # Serve uploaded photos
    uploads_dir = Path(settings.storage_path) / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(user.router, prefix="/api/users", tags=["Users"])
    app.include_router(photo.router, prefix="/api/photos", tags=["Photos"])
    app.include_router(habit.router, prefix="/api/habits", tags=["Habits"])
    app.include_router(treatment.router, prefix="/api/treatments", tags=["Treatments"])
    app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
    app.include_router(nutrition.router, prefix="/api/nutrition", tags=["Nutrition"])

    @app.get("/health", tags=["Health"])
    async def health_check() -> dict[str, str]:
        return {"status": "ok", "service": settings.app_name}

    return app


app = create_app()
