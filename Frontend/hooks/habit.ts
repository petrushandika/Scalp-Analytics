"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { habitApi } from "@/lib/api";
import type { CreateHabitRequest } from "@/types/habit";

export function useHabits() {
  return useQuery({ queryKey: ["habits"], queryFn: () => habitApi.list() });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHabitRequest) => habitApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}
