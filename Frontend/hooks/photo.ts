"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { photoApi } from "@/lib/api";
import type { PhotoAngle } from "@/types/photo";

export function usePhotos() {
  return useQuery({ queryKey: ["photos"], queryFn: () => photoApi.list() });
}

export function useUploadPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { file: File; angle: PhotoAngle }) => photoApi.upload(vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}

export function useAnalyzePhoto() {
  return useMutation({ mutationFn: (file: File) => photoApi.analyze(file) });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => photoApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}
