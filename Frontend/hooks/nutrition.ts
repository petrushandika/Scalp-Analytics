"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nutritionApi } from "@/lib/api";
import type { CreateMealRequest } from "@/types/nutrition";

export function useWaterToday() {
  return useQuery({ queryKey: ["water", "today"], queryFn: () => nutritionApi.getWaterToday() });
}

export function useLogWater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { amount_ml: number; log_date: string }) =>
      nutritionApi.logWater(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["water"] }),
  });
}

export function useMeals(logDate: string) {
  return useQuery({
    queryKey: ["meals", logDate],
    queryFn: () => nutritionApi.getMeals(logDate),
    enabled: !!logDate,
  });
}

export function useCreateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMealRequest) => nutritionApi.createMeal(payload),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["meals", vars.log_date] }),
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => nutritionApi.deleteMeal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] }),
  });
}

export function useSearchFoods(q: string) {
  return useQuery({
    queryKey: ["foods", q],
    queryFn: () => nutritionApi.searchFoods(q),
    enabled: q.length >= 2,
  });
}
