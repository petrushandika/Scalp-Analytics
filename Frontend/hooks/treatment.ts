"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { treatmentApi } from "@/lib/api";
import type { CreateTreatmentRequest } from "@/types/treatment";

export function useTreatments(activeOnly?: boolean) {
  return useQuery({
    queryKey: ["treatments", { activeOnly }],
    queryFn: () => treatmentApi.list(activeOnly),
  });
}

export function useCreateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTreatmentRequest) => treatmentApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
  });
}

export function useDeactivateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => treatmentApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
  });
}

export function useDeleteTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => treatmentApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["treatments"] }),
  });
}
