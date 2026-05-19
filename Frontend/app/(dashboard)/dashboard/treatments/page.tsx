import type { Metadata } from "next";

import { TreatmentsClient } from "@/components/treatments/TreatmentsClient";

export const metadata: Metadata = { title: "Treatment" };

export default function TreatmentsPage() {
  return <TreatmentsClient />;
}
