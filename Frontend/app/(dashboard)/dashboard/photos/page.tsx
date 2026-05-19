import type { Metadata } from "next";

import { PhotosClient } from "@/components/photos/PhotosClient";

export const metadata: Metadata = { title: "Foto & Analisis" };

export default function PhotosPage() {
  return <PhotosClient />;
}
