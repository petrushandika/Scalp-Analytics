"use client";

import { Camera, FlipHorizontal, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  direction?: {
    label: string;
    instruction: string;
    icon: string | React.ComponentType<{ className?: string }>;
    arrow?: "up" | "down" | "left" | "right" | "center";
  };
  onCapture: (file: File) => void;
  onClose: () => void;
}

const ARROW_SVG: Record<string, string> = {
  up: "M12 5l-7 7h4v7h6v-7h4z",
  down: "M12 19l7-7h-4V5H9v7H5z",
  left: "M5 12l7-7v4h7v6h-7v4z",
  right: "M19 12l-7 7v-4H5V9h7V5z",
  center: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4a6 6 0 110 12A6 6 0 0112 6z",
};

export function CameraCapture({ direction, onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const startCamera = useCallback(async (mode: "environment" | "user") => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setReady(false);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kamera tidak dapat diakses";
      if (msg.includes("NotAllowed") || msg.includes("Permission")) {
        setError("Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser.");
      } else if (msg.includes("NotFound")) {
        setError("Tidak ada kamera yang ditemukan di perangkat ini.");
      } else {
        setError(`Gagal membuka kamera: ${msg}`);
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, startCamera]);

  function flipCamera() {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      },
      "image/jpeg",
      0.92,
    );
  }

  const arrow = direction?.arrow ?? "center";
  const arrowPath = ARROW_SVG[arrow] ?? ARROW_SVG.center!;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
        <button
          onClick={() => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            onClose();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {direction && (
          <div className="rounded-full bg-black/60 px-4 py-1.5 text-center backdrop-blur-sm">
            {typeof direction.icon === "string" ? (
              <span className="text-xs font-semibold text-white">
                {direction.icon} {direction.label}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                {React.createElement(direction.icon, {
                  className: "h-3.5 w-3.5 text-primary-400 shrink-0",
                })}
                <span>{direction.label}</span>
              </span>
            )}
          </div>
        )}
        <button
          onClick={flipCamera}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white"
        >
          <FlipHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Camera view */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
        />

        {/* Direction overlay */}
        {ready && direction && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Direction arrow */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/50">
              <svg viewBox="0 0 24 24" className="h-10 w-10 fill-white">
                <path d={arrowPath} />
              </svg>
            </div>
            {/* Guide box */}
            <div className="h-48 w-48 rounded-2xl border-2 border-dashed border-white/60" />
            {/* Instruction */}
            <div className="mt-4 rounded-2xl bg-black/50 px-5 py-2 backdrop-blur-sm">
              <p className="text-center text-sm font-medium text-white">{direction.instruction}</p>
            </div>
          </div>
        )}

        {/* Flash effect */}
        {flash && <div className="absolute inset-0 bg-white opacity-70" />}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-8 text-center">
            <Camera className="h-12 w-12 text-slate-400" />
            <p className="text-sm text-white">{error}</p>
            <button
              onClick={() => startCamera(facingMode)}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      {/* Capture button */}
      <div className="flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent py-8">
        <button
          onClick={capturePhoto}
          disabled={!ready}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-white/30 transition-transform active:scale-95 disabled:opacity-50"
        >
          <div className="h-16 w-16 rounded-full bg-white ring-2 ring-slate-200" />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
