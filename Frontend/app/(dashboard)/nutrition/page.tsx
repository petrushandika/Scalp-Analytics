import type { Metadata } from "next";
import { NutritionClient } from "@/components/nutrition/NutritionClient";

export const metadata: Metadata = { title: "Nutrisi" };

export default function NutritionPage() {
  return <NutritionClient />;
}
