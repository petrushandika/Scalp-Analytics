"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpCircle,
  Camera,
  CheckCircle2,
  ImageOff,
  RotateCcw,
  Trash2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

import { Badge, Button, Card, CameraCapture } from "@/components/ui";
import { useAnalyzePhoto, useDeletePhoto, usePhotos, useUploadPhoto } from "@/hooks/photo";
import { formatDate } from "@/lib/utils";
import type { AnalyzeResult, PhotoAngle } from "@/types/photo";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ANGLE_STEPS: {
  value: PhotoAngle;
  label: string;
  instruction: string;
  tip: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "front",
    label: "Depan",
    instruction: "Foto bagian depan kepala",
    tip: "Hadap kamera langsung, rambut terlihat jelas dari garis rambut ke depan",
    icon: ArrowUp,
  },
  {
    value: "top",
    label: "Atas",
    instruction: "Foto bagian atas kepala",
    tip: "Arahkan kamera tegak lurus ke bawah dari atas kepala, tampak mahkota kepala",
    icon: ArrowUpCircle,
  },
  {
    value: "right",
    label: "Kanan",
    instruction: "Foto bagian sisi kanan",
    tip: "Putar kepala ke kiri agar sisi kanan terlihat jelas oleh kamera",
    icon: ArrowRight,
  },
  {
    value: "left",
    label: "Kiri",
    instruction: "Foto bagian sisi kiri",
    tip: "Putar kepala ke kanan agar sisi kiri terlihat jelas oleh kamera",
    icon: ArrowLeft,
  },
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
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [stepFiles, setStepFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [uploadedSteps, setUploadedSteps] = useState<boolean[]>([false, false, false, false]);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const { data: photos, isLoading } = usePhotos();
  const uploadMutation = useUploadPhoto();
  const analyzeMutation = useAnalyzePhoto();
  const deleteMutation = useDeletePhoto();

  // stepIndex is always 0-3, ANGLE_STEPS has 4 elements
  const currentStep = ANGLE_STEPS[stepIndex]!;
  const currentFile = stepFiles[stepIndex];

  function setFileForStep(file: File) {
    setStepFiles((prev) => {
      const next = [...prev];
      next[stepIndex] = file;
      return next;
    });
  }

  async function handleUploadStep() {
    const file = stepFiles[stepIndex];
    if (!file) return;
    await uploadMutation.mutateAsync({ file, angle: currentStep.value });
    setUploadedSteps((prev) => {
      const next = [...prev];
      next[stepIndex] = true;
      return next;
    });
    if (stepIndex < ANGLE_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }

  async function handleAnalyze(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await analyzeMutation.mutateAsync(file);
    setAnalyzeResult(result);
    e.target.value = "";
  }

  function resetWizard() {
    setStepIndex(0);
    setStepFiles([null, null, null, null]);
    setUploadedSteps([false, false, false, false]);
  }

  const completedCount = uploadedSteps.filter(Boolean).length;

  return (
    <>
      {showCamera && (
        <CameraCapture
          direction={{
            label: currentStep.label,
            instruction: currentStep.tip,
            icon: currentStep.icon,
            arrow:
              currentStep.value === "front"
                ? "up"
                : currentStep.value === "top"
                  ? "center"
                  : currentStep.value === "right"
                    ? "right"
                    : "left",
          }}
          onCapture={(file) => {
            setFileForStep(file);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Foto &amp; Analisis</h1>
        <p className="mt-1 text-sm text-slate-500">
          Foto kulit kepala dari 4 sudut untuk analisis AI yang akurat
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Guided photo wizard ── */}
        <div className="flex flex-col gap-4">
          {/* Progress indicator */}
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Progress Pengambilan Foto</p>
              <span className="text-xs text-slate-500">{completedCount}/4 sudut</span>
            </div>
            <div className="flex gap-2">
              {ANGLE_STEPS.map((step, i) => (
                <button
                  key={step.value}
                  onClick={() => setStepIndex(i)}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-all ${
                    i === stepIndex
                      ? "bg-primary-600 text-white shadow-sm"
                      : uploadedSteps[i]
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <step.icon className="h-4.5 w-4.5 shrink-0" />
                  {step.label}
                  {uploadedSteps[i] && <CheckCircle2 className="h-3 w-3 mt-0.5" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Current step */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <currentStep.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Langkah {stepIndex + 1}: {currentStep.instruction}
                </p>
                <p className="text-xs text-slate-500">{currentStep.tip}</p>
              </div>
            </div>

            {/* Upload area */}
            {currentFile ? (
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={URL.createObjectURL(currentFile)}
                  alt="Preview"
                  width={400}
                  height={280}
                  className="w-full object-cover"
                  unoptimized
                />
                <button
                  onClick={() =>
                    setStepFiles((prev) => {
                      const next = [...prev];
                      next[stepIndex] = null;
                      return next;
                    })
                  }
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center transition-all hover:border-primary-300 hover:bg-primary-50/30 focus:outline-none"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Camera className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Upload atau ambil foto</p>
                  <p className="mt-0.5 text-xs text-slate-400">PNG, JPG hingga 10MB</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileForStep(f);
                e.target.value = "";
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileForStep(f);
                e.target.value = "";
              }}
            />

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCamera(true)}
                className="flex-1"
              >
                <Camera className="h-4 w-4" />
                Kamera
              </Button>
              <Button
                onClick={handleUploadStep}
                disabled={!currentFile || uploadedSteps[stepIndex]}
                isLoading={uploadMutation.isPending}
                className="flex-1"
              >
                {uploadedSteps[stepIndex] ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Tersimpan
                  </>
                ) : (
                  <>Upload &amp; Analisis</>
                )}
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                disabled={stepIndex === 0}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>
              {completedCount === 4 ? (
                <button
                  onClick={resetWizard}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <RotateCcw className="h-4 w-4" /> Sesi Baru
                </button>
              ) : (
                <button
                  onClick={() => setStepIndex(Math.min(3, stepIndex + 1))}
                  disabled={stepIndex === 3}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                >
                  Lewati <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Upload result */}
            {uploadMutation.data && uploadedSteps[stepIndex] && (
              <div
                className={`rounded-xl border p-3 ${severityAlertClass(uploadMutation.data.severity_stage)}`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Hasil Analisis</p>
                </div>
                {uploadMutation.data.severity_stage && (
                  <Badge stage={uploadMutation.data.severity_stage} />
                )}
                {uploadMutation.data.confidence != null && (
                  <div className="mt-2">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Confidence</span>
                      <span className="font-semibold">
                        {(uploadMutation.data.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${confidenceBarColor(uploadMutation.data.confidence)}`}
                        style={{ width: `${(uploadMutation.data.confidence * 100).toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                )}
                {uploadMutation.data.recommendation && (
                  <p className="mt-2 text-sm">{uploadMutation.data.recommendation}</p>
                )}
              </div>
            )}
          </Card>
        </div>

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => analyzeInputRef.current?.click()}
                isLoading={analyzeMutation.isPending}
                className="flex-1"
              >
                <Zap className="h-4 w-4" />
                Upload Foto
              </Button>
              <input
                ref={analyzeInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAnalyze}
              />
            </div>

            {analyzeResult ? (
              <div
                className={`rounded-xl border p-4 ${severityAlertClass(analyzeResult.severity_stage)}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Hasil Analisis</p>
                </div>
                <Badge stage={analyzeResult.severity_stage} />
                <div className="mt-3">
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
                <p className="mt-3 text-sm">{analyzeResult.recommendation}</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Siap menganalisis</p>
                  <p className="mt-0.5 text-xs text-slate-400">Pilih foto untuk hasil instan</p>
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
              <p className="mt-1 text-sm text-slate-400">Upload foto pertama untuk mulai analisis</p>
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
    </>
  );
}
