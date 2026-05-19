"use client";

import { useRef, useState } from "react";
import { usePhotos, useUploadPhoto, useAnalyzePhoto, useDeletePhoto } from "@/hooks/photo";
import { Badge, Button, Card, Select } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { PhotoAngle, AnalyzeResult } from "@/types/photo";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ANGLES: { value: PhotoAngle; label: string }[] = [
  { value: "front", label: "Depan" },
  { value: "top", label: "Atas" },
  { value: "right", label: "Kanan" },
  { value: "left", label: "Kiri" },
];

export function PhotosClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<PhotoAngle>("front");
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: photos, isLoading } = usePhotos();
  const uploadMutation = useUploadPhoto();
  const analyzeMutation = useAnalyzePhoto();
  const deleteMutation = useDeletePhoto();

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    await uploadMutation.mutateAsync({ file: selectedFile, angle });
    setSelectedFile(null);
  }

  async function handleAnalyze(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await analyzeMutation.mutateAsync(file);
    setAnalyzeResult(result);
    e.target.value = "";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Foto & Analisis</h1>
        <p className="mt-1 text-sm text-gray-500">Upload foto kulit kepala untuk dianalisis AI</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload section */}
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900">Upload & Simpan</h2>
          <div
            className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragOver ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {selectedFile ? (
              <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
            ) : (
              <p className="text-sm text-gray-500">Klik atau drag foto ke sini</p>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
          </div>

          <Select
            label="Sudut Foto"
            value={angle}
            onChange={(e) => setAngle(e.target.value as PhotoAngle)}
            className="mb-4"
          >
            {ANGLES.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </Select>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            isLoading={uploadMutation.isPending}
            className="w-full"
          >
            Upload & Analisis
          </Button>

          {uploadMutation.data && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Hasil:</span>
                {uploadMutation.data.severity_stage && (
                  <Badge stage={uploadMutation.data.severity_stage} />
                )}
                {uploadMutation.data.confidence != null && (
                  <span className="text-sm text-gray-500">
                    {(uploadMutation.data.confidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              {uploadMutation.data.recommendation && (
                <p className="mt-2 text-sm text-gray-600">{uploadMutation.data.recommendation}</p>
              )}
            </div>
          )}
        </Card>

        {/* Quick analyze section */}
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900">Analisis Cepat (Tanpa Simpan)</h2>
          <p className="mb-4 text-sm text-gray-500">Analisis foto tanpa menyimpan ke riwayat.</p>
          <Button
            variant="outline"
            onClick={() => analyzeInputRef.current?.click()}
            isLoading={analyzeMutation.isPending}
            className="w-full"
          >
            Pilih Foto untuk Analisis
          </Button>
          <input ref={analyzeInputRef} type="file" accept="image/*" className="hidden" onChange={handleAnalyze} />

          {analyzeResult && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Badge stage={analyzeResult.severity_stage} />
                <span className="text-sm text-gray-500">
                  {(analyzeResult.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{analyzeResult.recommendation}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Photo grid */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Riwayat Foto</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-gray-200 aspect-square" />
            ))}
          </div>
        ) : !photos?.length ? (
          <p className="text-sm text-gray-500">Belum ada foto. Upload foto pertama Anda!</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden ring-1 ring-gray-100">
                <img
                  src={`${API_URL}/${photo.file_path}`}
                  alt={`Foto ${photo.angle}`}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-2">
                  <p className="text-xs text-gray-500">{formatDate(photo.created_at)}</p>
                  {photo.severity_stage && (
                    <Badge stage={photo.severity_stage} className="mt-1" />
                  )}
                </div>
                <button
                  onClick={() => deleteMutation.mutate(photo.id)}
                  className="absolute right-2 top-2 hidden rounded-full bg-red-500 p-1 text-white group-hover:flex"
                  aria-label="Hapus foto"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
