"use client";

import { Minus, Plus, Search, Trash2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { Button, Card } from "@/components/ui";
import {
  useCreateMeal,
  useDeleteMeal,
  useLogWater,
  useMeals,
  useSearchFoods,
  useWaterToday,
} from "@/hooks/nutrition";
import { getErrorMessage } from "@/lib/utils";
import type { MealType } from "@/types/nutrition";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: "breakfast", label: "Sarapan", emoji: "🌅" },
  { value: "lunch", label: "Makan Siang", emoji: "☀️" },
  { value: "dinner", label: "Makan Malam", emoji: "🌙" },
  { value: "snack", label: "Camilan", emoji: "🍎" },
];

const WATER_GOAL = 2000;

function WaterDonut({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(1, current / goal);
  const r = 90;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
      <svg width="240" height="240" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        <circle
          cx="120"
          cy="120"
          r={r}
          fill="none"
          stroke="#0d9488"
          strokeWidth="18"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-900">{current}</span>
        <span className="text-sm text-slate-400">/ {goal} ml</span>
        <span className="mt-1 text-xs font-medium text-primary-600">
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}

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
  const [mealItems, setMealItems] = useState<
    { food_id: string; food_name: string; quantity_grams: number }[]
  >([]);
  const [mealError, setMealError] = useState("");

  function addFood(foodId: string, foodName: string) {
    setMealItems((prev) => {
      const existing = prev.find((i) => i.food_id === foodId);
      if (existing)
        return prev.map((i) =>
          i.food_id === foodId ? { ...i, quantity_grams: i.quantity_grams + 100 } : i,
        );
      return [...prev, { food_id: foodId, food_name: foodName, quantity_grams: 100 }];
    });
    setFoodQuery("");
  }

  function updateQty(foodId: string, qty: number) {
    setMealItems((prev) =>
      prev.map((i) => (i.food_id === foodId ? { ...i, quantity_grams: qty } : i)),
    );
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

  const currentWater = waterData?.total_ml ?? 0;

  // Group meals by type
  const mealsByType = MEAL_TYPES.map((mt) => ({
    ...mt,
    meals: meals?.filter((m) => m.meal_type === mt.value) ?? [],
  })).filter((g) => g.meals.length > 0);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nutrisi</h1>
        <p className="mt-1 text-sm text-slate-500">Pantau asupan air dan makanan harian</p>
      </div>

      {/* Water tracker — prominent donut */}
      <Card>
        <h2 className="mb-6 font-semibold text-slate-900">Tracker Air Minum</h2>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex shrink-0 justify-center">
            <WaterDonut current={currentWater} goal={WATER_GOAL} />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Progres Hari Ini</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {currentWater}{" "}
                <span className="text-lg font-normal text-slate-400">/ {WATER_GOAL} ml</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {WATER_GOAL - currentWater > 0
                  ? `Sisa ${WATER_GOAL - currentWater} ml lagi`
                  : "Target tercapai! 🎉"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">Tambah cepat</p>
              <div className="flex flex-wrap gap-2">
                {[250, 500, 750, 1000].map((ml) => (
                  <Button
                    key={ml}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogWater(ml)}
                    isLoading={logWaterMutation.isPending}
                  >
                    <Plus className="h-3 w-3" />
                    {ml} ml
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meal logger */}
      <Card>
        <h2 className="mb-5 font-semibold text-slate-900">Catat Makanan</h2>
        <div className="space-y-4">
          {/* Meal type as pill tabs */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Waktu Makan</p>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  type="button"
                  onClick={() => setMealType(mt.value)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    mealType === mt.value
                      ? "bg-primary-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-primary-50"
                  }`}
                >
                  <span>{mt.emoji}</span>
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food search */}
          <div className="relative">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Cari Makanan</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={foodQuery}
                onChange={(e) => setFoodQuery(e.target.value)}
                placeholder="Ketik nama makanan..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            {foods && foods.length > 0 && foodQuery.length >= 2 && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {foods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-50"
                    onClick={() => addFood(food.id, food.name)}
                  >
                    <span className="font-medium text-slate-800">{food.name}</span>
                    <span className="text-xs text-slate-400">
                      {food.calories_per_100g} kcal/100g
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected items */}
          {mealItems.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {mealItems.map((item) => (
                <div
                  key={item.food_id}
                  className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-b-0"
                >
                  <span className="flex-1 text-sm font-medium text-slate-800">
                    {item.food_name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                      onClick={() =>
                        updateQty(item.food_id, Math.max(1, item.quantity_grams - 50))
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-14 text-center text-sm font-semibold">
                      {item.quantity_grams}g
                    </span>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                      onClick={() => updateQty(item.food_id, item.quantity_grams + 50)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.food_id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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

      {/* Today's meals grouped by type */}
      <div>
        <h2 className="mb-4 font-semibold text-slate-900">Makanan Hari Ini</h2>
        {mealsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : !meals?.length ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">
            <UtensilsCrossed className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">Belum ada catatan makan hari ini.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {mealsByType.map((group) => (
              <div key={group.value}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">{group.emoji}</span>
                  <h3 className="text-sm font-semibold text-slate-700">{group.label}</h3>
                </div>
                <div className="space-y-2">
                  {group.meals.map((meal) => (
                    <Card key={meal.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {meal.items.length} item makanan
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {meal.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                              >
                                {item.food?.name ?? `Item ${idx + 1}`}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMealMutation.mutate(meal.id)}
                          disabled={deleteMealMutation.isPending}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
