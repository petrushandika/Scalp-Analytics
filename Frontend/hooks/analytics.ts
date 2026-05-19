"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";

export function useAnalytics() {
  return useQuery({ queryKey: ["analytics"], queryFn: () => analyticsApi.get() });
}
