import uuid
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.db import get_db
from app.infrastructure.database.models import ItemModel, MealModel, WaterModel
from app.infrastructure.repositories.nutrition import (
    FoodRepository,
    MealRepository,
    WaterRepository,
)
from app.presentation.middleware.auth import CurrentUser
from app.presentation.schemas.nutrition import (
    FoodResponse,
    MealCreateRequest,
    MealItemResponse,
    MealResponse,
    WaterAddRequest,
    WaterResponse,
)


router = APIRouter()


# ─── Food Search ─────────────────────────────────────────────────────────────


@router.get("/foods", response_model=list[FoodResponse])
async def search_foods(
    db: Annotated[AsyncSession, Depends(get_db)],
    q: str = Query(..., min_length=1),
) -> list[FoodResponse]:
    """Cari makanan berdasarkan nama."""
    async with db.begin():
        foods = await FoodRepository(db).search(q)
    return [_food_to_response(f) for f in foods]


@router.get("/foods/{food_id}", response_model=FoodResponse)
async def get_food(
    food_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> FoodResponse:
    async with db.begin():
        food = await FoodRepository(db).find_by_id(food_id)
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Makanan tidak ditemukan."
        )
    return _food_to_response(food)


# ─── Meals ───────────────────────────────────────────────────────────────────


@router.post("/meals", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
async def create_meal(
    body: MealCreateRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MealResponse:
    """Catat log makan beserta item makanannya."""
    async with db.begin():
        meal_repo = MealRepository(db)
        food_repo = FoodRepository(db)

        meal = MealModel(
            user_id=current_user.id,
            log_date=body.log_date,
            log_time=body.log_time,
            meal_type=body.meal_type,
            notes=body.notes,
        )
        meal = await meal_repo.save(meal)

        for item_req in body.items:
            food = await food_repo.find_by_id(item_req.food_id)
            if not food:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Makanan dengan ID {item_req.food_id} tidak ditemukan.",
                )
            item = ItemModel(
                meal_id=meal.id,
                food_id=item_req.food_id,
                quantity=item_req.quantity,
                unit=item_req.unit,
                serving_multiplier=item_req.serving_multiplier,
            )
            db.add(item)

        await db.flush()
        meal = await meal_repo.find_by_id(meal.id)

    return _meal_to_response(meal)


@router.get("/meals", response_model=list[MealResponse])
async def list_meals(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    log_date: date | None = Query(None),
) -> list[MealResponse]:
    """Ambil log makan. Filter by tanggal jika ?log_date=YYYY-MM-DD."""
    async with db.begin():
        repo = MealRepository(db)
        if log_date:
            meals = await repo.find_by_user_date(current_user.id, log_date)
        else:
            meals = await repo.find_by_user(current_user.id)
    return [_meal_to_response(m) for m in meals]


@router.get("/meals/{meal_id}", response_model=MealResponse)
async def get_meal(
    meal_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MealResponse:
    async with db.begin():
        meal = await MealRepository(db).find_by_id(meal_id)
    if not meal or meal.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Log makan tidak ditemukan."
        )
    return _meal_to_response(meal)


@router.delete("/meals/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal(
    meal_id: uuid.UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    async with db.begin():
        repo = MealRepository(db)
        meal = await repo.find_by_id(meal_id)
        if not meal or meal.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Log makan tidak ditemukan.",
            )
        await repo.delete(meal)


# ─── Water ───────────────────────────────────────────────────────────────────


@router.post(
    "/water", response_model=WaterResponse, status_code=status.HTTP_201_CREATED
)
async def log_water(
    body: WaterAddRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WaterResponse:
    """Tambah intake air. Jika sudah ada log hari itu, jumlahnya ditambahkan."""
    async with db.begin():
        repo = WaterRepository(db)
        existing = await repo.find_by_date(current_user.id, body.log_date)
        if existing:
            existing.amount_ml = float(existing.amount_ml) + body.amount_ml
            water = await repo.save(existing)
        else:
            water = WaterModel(
                user_id=current_user.id,
                log_date=body.log_date,
                amount_ml=body.amount_ml,
            )
            water = await repo.save(water)
    return _water_to_response(water)


@router.get("/water", response_model=list[WaterResponse])
async def list_water(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[WaterResponse]:
    async with db.begin():
        water_logs = await WaterRepository(db).find_by_user(current_user.id)
    return [_water_to_response(w) for w in water_logs]


@router.get("/water/today", response_model=WaterResponse | None)
async def get_water_today(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WaterResponse | None:
    """Cek intake air hari ini."""
    from datetime import UTC, datetime

    today = datetime.now(UTC).date()
    async with db.begin():
        water = await WaterRepository(db).find_by_date(current_user.id, today)
    return _water_to_response(water) if water else None


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _food_to_response(food) -> FoodResponse:
    return FoodResponse(
        id=food.id,
        name=food.name,
        category=food.category,
        brand=food.brand,
        default_serving=float(food.default_serving),
        default_unit=food.default_unit,
        is_verified=food.is_verified,
    )


def _meal_to_response(meal) -> MealResponse:
    return MealResponse(
        id=meal.id,
        user_id=meal.user_id,
        log_date=meal.log_date,
        log_time=meal.log_time,
        meal_type=meal.meal_type,
        notes=meal.notes,
        items=[
            MealItemResponse(
                id=item.id,
                food_id=item.food_id,
                quantity=float(item.quantity),
                unit=item.unit,
                serving_multiplier=float(item.serving_multiplier),
            )
            for item in (meal.items or [])
        ],
        created_at=meal.created_at,
    )


def _water_to_response(water) -> WaterResponse:
    return WaterResponse(
        id=water.id,
        user_id=water.user_id,
        log_date=water.log_date,
        amount_ml=float(water.amount_ml),
        created_at=water.created_at,
        updated_at=water.updated_at,
    )
