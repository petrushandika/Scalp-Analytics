import type { Metadata } from "next";

import { HabitsClient } from "@/components/habits/HabitsClient";

export const metadata: Metadata = { title: "Habit Logger" };

export default function HabitsPage() {
  return <HabitsClient />;
}
