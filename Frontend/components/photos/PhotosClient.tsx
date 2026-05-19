"use client";

import { AlertCircle, CheckCircle2, ImageOff, Trash2, UploadCloud, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Badge, Button, Card } from "@/components/ui";
import { useAnalyzePhoto, useDeletePhoto, usePhotos, useUploadPhoto } from "@/hooks/photo";
import { formatDate } from "@/lib/utils";
import type { AnalyzeResult, PhotoAngle } from "@/types/photo";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ANGLES: { value: PhotoAngle; label: string }[] = [
  { value: "front", label: "Depan" },
  { value: "top", label: "Atas" },
  { value: "right", label: "Kanan" },
  { value: "left", label: "Kiri" },
];

function severityAlertClass(stage: string | null | undefined) {
  if (!stage) return "bg-slate-50 border-slate-200 text-slate-700";
  if (stage.includes("normal")) return "bg-emerald-50 border-emerald-200 text-emerald-800";
  if (stage.includes("mild")) return "bg-yellow-50 border-yellow-200 text-yellow-800";
  if (stage.includes("moderate")) return "bg-orange-50 border-orange-200 text-orange-800";
  return "bg-red-50 border-red-200 text-red-800";
}

function confidenceBarColor(confidence: number) {
  if (confidence >= 0.8) return "bg-emerald-500";
  if (confidence >= 0.6) return "bg-yellow-500";
  return "bg-orange-500";
}

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
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Foto &amp; Analisis</h1>
        <p className="mt-1 text-sm text-slate-500">Upload foto kulit kepala untuk dianalisis AI</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Upload & Analisis ── */}
        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100">
              <UploadCloud className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Upload &amp; Analisis</h2>
              <p className="text-xs text-slate-500">Simpan foto ke riwayat</p>
            </div>
          </div>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload foto"
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
              dragOver
                ? "border-primary-400 bg-primary-50"
                : selectedFile
                  ? "border-primary-300 bg-primary-50/60"
                  : "border-slate-200 hover:border-primary-300 hover:bg-slate-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                selectedFile ? "bg-primary-100" : "bg-slate-100"
              }`}
            >
              <UploadCloud
                className={`h-7 w-7 transition-colors ${selectedFile ? "text-primary-600" : "text-slate-400"}`}
              />
            </div>
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-primary-700">{selectedFile.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">Klik untuk ganti foto</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Klik atau seret foto ke sini
                </p>
                <p className="mt-0.5 text-xs text-slate-400">PNG, JPG, WEBP hingga 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Angle selector as pill buttons */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Sudut Foto</p>
            <div className="flex gap-2">
              {ANGLES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAngle(a.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    angle === a.value
                      ? "bg-primary-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-primary-50"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            isLoading={uploadMutation.isPending}
            className="w-full"
          >
            <UploadCloud className="h-4 w-4" />
            Upload &amp; Analisis
          </Button>

          {/* Upload result */}
          {uploadMutation.data && (
            <div
              className={`rounded-xl border p-4 ${severityAlertClass(uploadMutation.data.severity_stage)}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-wide">Hasil Analisis</p>
              </div>
              <div className="mb-3 flex items-center gap-3">
                {uploadMutation.data.severity_stage && (
                  <Badge stage={uploadMutation.data.severity_stage} />
                )}
              </div>
              {uploadMutation.data.confidence != null && (
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Confidence</span>
                    <span className="font-semibold">
                      {(uploadMutation.data.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${confidenceBarColor(uploadMutation.data.confidence)}`}
                      style={{ width: `${(uploadMutation.data.confidence * 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>
              )}
              {uploadMutation.data.recommendation && (
                <p className="text-sm">{uploadMutation.data.recommendation}</p>
              )}
            </div>
          )}
        </Card>

        {/* ── Quick Analyze ── */}
        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Analisis Cepat</h2>
              <p className="text-xs text-slate-500">Tanpa menyimpan ke riwayat</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={() => analyzeInputRef.current?.click()}
                isLoading={analyzeMutation.isPending}
                className="w-full"
              >
                <Zap className="h-4 w-4" />
                Pilih Foto untuk Analisis
              </Button>
              <input
                ref={analyzeInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAnalyze}
              />
              <p className="text-center text-xs text-slate-400">
                Foto tidak akan disimpan ke server
              </p>
            </div>

            {analyzeResult && (
              <div
                className={`rounded-xl border p-4 ${severityAlertClass(analyzeResult.severity_stage)}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Hasil Analisis</p>
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <Badge stage={analyzeResult.severity_stage} />
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Confidence</span>
                    <span className="font-semibold">
                      {(analyzeResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${confidenceBarColor(analyzeResult.confidence)}`}
                      style={{ width: `${(analyzeResult.confidence * 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm">{analyzeResult.recommendation}</p>
              </div>
            )}

            {!analyzeResult && !analyzeMutation.isPending && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Siap menganalisis</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Pilih foto untuk mendapatkan hasil instan
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Photo grid */}
      <div>
        <h2 className="mb-4 font-semibold text-slate-900">
          Riwayat Foto
          {photos && !isLoading && (
            <span className="ml-2 text-sm font-normal text-slate-400">({photos.length} foto)</span>
          )}
        </h2>

        {isLoading ? (
          <div className="columns-2 gap-4 sm:columns-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 animate-pulse rounded-xl bg-slate-200"
                style={{ height: `${140 + (i % 3) * 40}px` }}
              />
            ))}
          </div>
        ) : !photos?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <ImageOff className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="font-medium text-slate-600">Belum ada foto</p>
              <p className="mt-1 text-sm text-slate-400">
                Upload foto pertama Anda untuk mulai analisis
              </p>
            </div>
          </div>
        ) : (
          <div className="columns-2 gap-4 sm:columns-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative mb-4 overflow-hidden rounded-xl ring-1 ring-slate-200 transition-shadow hover:shadow-md"
              >
                <Image
                  src={`${API_URL}/${photo.file_path}`}
                  alt={`Foto sudut ${photo.angle}`}
                  width={400}
                  height={400}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteMutation.mutate(photo.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600"
                      aria-label="Hapus foto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                      {formatDate(photo.created_at)}
                    </span>
                    {photo.severity_stage && (
                      <Badge stage={photo.severity_stage} className="text-[10px]" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
