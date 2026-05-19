"""Seed data awal untuk tabel foods dan nutrients."""

import asyncio

from sqlalchemy import select

from app.infrastructure.database.db import get_session_factory
from app.infrastructure.database.models import FoodModel, NutrientModel


NUTRIENTS = [
    {
        "name": "protein",
        "display_name": "Protein",
        "unit": "g",
        "daily_value": 50.0,
        "category": "macro",
    },
    {
        "name": "fat",
        "display_name": "Lemak Total",
        "unit": "g",
        "daily_value": 65.0,
        "category": "macro",
    },
    {
        "name": "carbs",
        "display_name": "Karbohidrat",
        "unit": "g",
        "daily_value": 300.0,
        "category": "macro",
    },
    {
        "name": "fiber",
        "display_name": "Serat",
        "unit": "g",
        "daily_value": 25.0,
        "category": "macro",
    },
    {
        "name": "sugar",
        "display_name": "Gula",
        "unit": "g",
        "daily_value": None,
        "category": "macro",
    },
    {
        "name": "calories",
        "display_name": "Kalori",
        "unit": "kcal",
        "daily_value": 2000.0,
        "category": "macro",
    },
    {
        "name": "iron",
        "display_name": "Zat Besi",
        "unit": "mg",
        "daily_value": 18.0,
        "category": "mineral",
    },
    {
        "name": "zinc",
        "display_name": "Zinc",
        "unit": "mg",
        "daily_value": 11.0,
        "category": "mineral",
    },
    {
        "name": "biotin",
        "display_name": "Biotin (B7)",
        "unit": "mcg",
        "daily_value": 30.0,
        "category": "vitamin",
    },
    {
        "name": "vitamin_d",
        "display_name": "Vitamin D",
        "unit": "IU",
        "daily_value": 600.0,
        "category": "vitamin",
    },
    {
        "name": "vitamin_e",
        "display_name": "Vitamin E",
        "unit": "mg",
        "daily_value": 15.0,
        "category": "vitamin",
    },
    {
        "name": "omega3",
        "display_name": "Omega-3",
        "unit": "g",
        "daily_value": 1.6,
        "category": "micro",
    },
    {
        "name": "collagen",
        "display_name": "Kolagen",
        "unit": "g",
        "daily_value": None,
        "category": "micro",
    },
]

FOODS = [
    # Protein tinggi — baik untuk pertumbuhan rambut
    {
        "name": "Telur Ayam",
        "category": "protein",
        "brand": None,
        "default_serving": 60.0,
        "default_unit": "butir",
        "is_verified": True,
    },
    {
        "name": "Dada Ayam",
        "category": "meat",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Ikan Salmon",
        "category": "seafood",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Ikan Tuna",
        "category": "seafood",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Tempe",
        "category": "legume",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Tahu",
        "category": "legume",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Daging Sapi",
        "category": "meat",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Udang",
        "category": "seafood",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    # Sayuran
    {
        "name": "Bayam",
        "category": "vegetable",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Brokoli",
        "category": "vegetable",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Wortel",
        "category": "vegetable",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Kangkung",
        "category": "vegetable",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Kacang Panjang",
        "category": "vegetable",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    # Buah
    {
        "name": "Alpukat",
        "category": "fruit",
        "brand": None,
        "default_serving": 150.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Pisang",
        "category": "fruit",
        "brand": None,
        "default_serving": 120.0,
        "default_unit": "buah",
        "is_verified": True,
    },
    {
        "name": "Jambu Biji",
        "category": "fruit",
        "brand": None,
        "default_serving": 100.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Jeruk",
        "category": "fruit",
        "brand": None,
        "default_serving": 130.0,
        "default_unit": "buah",
        "is_verified": True,
    },
    # Karbohidrat
    {
        "name": "Nasi Putih",
        "category": "grain",
        "brand": None,
        "default_serving": 150.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Nasi Merah",
        "category": "grain",
        "brand": None,
        "default_serving": 150.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Roti Gandum",
        "category": "grain",
        "brand": None,
        "default_serving": 30.0,
        "default_unit": "lembar",
        "is_verified": True,
    },
    {
        "name": "Oatmeal",
        "category": "grain",
        "brand": None,
        "default_serving": 40.0,
        "default_unit": "g",
        "is_verified": True,
    },
    # Dairy
    {
        "name": "Susu Sapi",
        "category": "dairy",
        "brand": None,
        "default_serving": 250.0,
        "default_unit": "ml",
        "is_verified": True,
    },
    {
        "name": "Yogurt Plain",
        "category": "dairy",
        "brand": None,
        "default_serving": 150.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Keju Cheddar",
        "category": "dairy",
        "brand": None,
        "default_serving": 30.0,
        "default_unit": "g",
        "is_verified": True,
    },
    # Kacang — tinggi biotin & zinc, bagus untuk rambut
    {
        "name": "Kacang Almond",
        "category": "nut",
        "brand": None,
        "default_serving": 30.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Kacang Walnut",
        "category": "nut",
        "brand": None,
        "default_serving": 30.0,
        "default_unit": "g",
        "is_verified": True,
    },
    {
        "name": "Kacang Tanah",
        "category": "nut",
        "brand": None,
        "default_serving": 30.0,
        "default_unit": "g",
        "is_verified": True,
    },
    # Minuman
    {
        "name": "Air Putih",
        "category": "beverage",
        "brand": None,
        "default_serving": 250.0,
        "default_unit": "ml",
        "is_verified": True,
    },
    {
        "name": "Teh Hijau",
        "category": "beverage",
        "brand": None,
        "default_serving": 240.0,
        "default_unit": "ml",
        "is_verified": True,
    },
    {
        "name": "Jus Jeruk",
        "category": "beverage",
        "brand": None,
        "default_serving": 200.0,
        "default_unit": "ml",
        "is_verified": True,
    },
]


async def seed() -> None:
    async with get_session_factory()() as session, session.begin():
        # Seed nutrients
        existing = await session.execute(select(NutrientModel).limit(1))
        if not existing.scalar_one_or_none():
            for n in NUTRIENTS:
                session.add(NutrientModel(**n))
            print(f"[SEED] {len(NUTRIENTS)} nutrients ditambahkan")
        else:
            print("[SEED] Nutrients sudah ada, skip")

        # Seed foods
        existing_food = await session.execute(select(FoodModel).limit(1))
        if not existing_food.scalar_one_or_none():
            for f in FOODS:
                session.add(FoodModel(**f))
            print(f"[SEED] {len(FOODS)} foods ditambahkan")
        else:
            print("[SEED] Foods sudah ada, skip")

    print("[SEED] Selesai.")


if __name__ == "__main__":
    asyncio.run(seed())
