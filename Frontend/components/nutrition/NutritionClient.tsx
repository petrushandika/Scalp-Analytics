"use client";

import { useState } from "react";

import { Button, Card, Input, Select } from "@/components/ui";
import { useWaterToday, useLogWater, useMeals, useCreateMeal, useDeleteMeal, useSearchFoods } from "@/hooks/nutrition";
import { getErrorMessage } from "@/lib/utils";
import type { MealType } from "@/types/nutrition";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Sarapan" },
  { value: "lunch", label: "Makan Siang" },
  { value: "dinner", label: "Makan Malam" },
  { value: "snack", label: "Camilan" },
];

export function NutritionClient() {
  const today = todayStr();
  const { data: waterData } = useWaterToday();
  const logWaterMutation = useLogWater();
  const { data: meals, isLoading: mealsLoading } = useMeals(today);
  const createMealMutation = useCreateMeal();
  const deleteMealMutation = useDeleteMeal();

  const [foodQuery, setFoodQuery] = useState("");
  const { data: foods } = useSearchFoods(foodQuery);

  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [mealItems, setMealItems] = useState<{ food_id: string; food_name: string; quantity_grams: number }[]>([]);
  const [mealError, setMealError] = useState("");

  function addFood(foodId: string, foodName: string) {
    setMealItems((prev) => {
      const existing = prev.find((i) => i.food_id === foodId);
      if (existing) return prev.map((i) => i.food_id === foodId ? { ...i, quantity_grams: i.quantity_grams + 100 } : i);
      return [...prev, { food_id: foodId, food_name: foodName, quantity_grams: 100 }];
    });
    setFoodQuery("");
  }

  function updateQty(foodId: string, qty: number) {
    setMealItems((prev) => prev.map((i) => i.food_id === foodId ? { ...i, quantity_grams: qty } : i));
  }

  function removeItem(foodId: string) {
    setMealItems((prev) => prev.filter((i) => i.food_id !== foodId));
  }

  async function handleCreateMeal() {
    if (!mealItems.length) return;
    setMealError("");
    try {
      await createMealMutation.mutateAsync({
        log_date: today,
        meal_type: mealType,
        items: mealItems.map(({ food_id, quantity_grams }) => ({ food_id, quantity_grams })),
      });
      setMealItems([]);
    } catch (err) {
      setMealError(getErrorMessage(err));
    }
  }

  async function handleLogWater(ml: number) {
    await logWaterMutation.mutateAsync({ amount_ml: ml, log_date: today });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nutrisi</h1>
        <p className="mt-1 text-sm text-gray-500">Pantau asupan air dan makanan harian</p>
      </div>

      {/* Water tracker */}
      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Tracker Air Minum</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold text-primary-600">
            {waterData?.total_ml ?? 0} <span className="text-lg font-normal text-gray-500">ml</span>
          </div>
          <div className="text-sm text-gray-500">dari target 2000 ml</div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, ((waterData?.total_ml ?? 0) / 2000) * 100)}%` }}
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLogWater(250)}
            isLoading={logWaterMutation.isPending}
          >
            +250 ml
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLogWater(500)}
            isLoading={logWaterMutation.isPending}
          >
            +500 ml
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLogWater(1000)}
            isLoading={logWaterMutation.isPending}
          >
            +1000 ml
          </Button>
        </div>
      </Card>

      {/* Meal log */}
      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Catat Makanan</h2>
        <div className="space-y-4">
          <Select
            label="Waktu Makan"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
          >
            {MEAL_TYPES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>

          <div className="relative">
            <Input
              label="Cari Makanan"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="Ketik nama makanan..."
            />
            {foods && foods.length > 0 && foodQuery.length >= 2 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {foods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => addFood(food.id, food.name)}
                  >
                    <span>{food.name}</span>
                    <span className="text-gray-400">{food.calories_per_100g} kcal/100g</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {mealItems.length > 0 && (
            <div className="rounded-lg border border-gray-200">
              {mealItems.map((item) => (
                <div key={item.food_id} className="flex items-center gap-3 px-4 py-2 border-b last:border-b-0">
                  <span className="flex-1 text-sm">{item.food_name}</span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity_grams}
                    onChange={(e) => updateQty(item.food_id, Number(e.target.value))}
                    className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <span className="text-xs text-gray-400">g</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.food_id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {mealError && <p className="text-sm text-red-500">{mealError}</p>}

          <Button
            onClick={handleCreateMeal}
            disabled={mealItems.length === 0}
            isLoading={createMealMutation.isPending}
            className="w-full"
          >
            Simpan Makanan
          </Button>
        </div>
      </Card>

      {/* Today's meals */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Makanan Hari Ini</h2>
        {mealsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-16" />
            ))}
          </div>
        ) : !meals?.length ? (
          <p className="text-sm text-gray-500">Belum ada catatan makan hari ini.</p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <Card key={meal.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize text-gray-900">
                      {MEAL_TYPES.find((m) => m.value === meal.meal_type)?.label ?? meal.meal_type}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      {meal.items.length} item
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteMealMutation.mutate(meal.id)}
                    isLoading={deleteMealMutation.isPending}
                  >
                    Hapus
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
