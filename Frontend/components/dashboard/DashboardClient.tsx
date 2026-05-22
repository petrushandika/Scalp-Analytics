"use client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Camera,
  ChevronRight,
  Droplets,
  Flame,
  Moon,
  Pill,
  Salad,
  Scan,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui";
import { useAnalytics } from "@/hooks/analytics";
import { useAuth } from "@/hooks/auth";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className ?? ""}`} />;
}

const quickActions = [
  {
    href: "/dashboard/photos",
    icon: Camera,
    label: "Upload Foto",
    desc: "Analisis kulit kepala",
  },
  {
    href: "/dashboard/habits",
    icon: Activity,
    label: "Log Habit",
    desc: "Catat stres & tidur",
  },
  {
    href: "/dashboard/treatments",
    icon: Pill,
    label: "Treatment",
    desc: "Kelola perawatan",
  },
  {
    href: "/dashboard/nutrition",
    icon: Salad,
    label: "Nutrisi",
    desc: "Track makanan & air",
  },
];

export function DashboardClient() {
  const { data, isLoading } = useAnalytics();
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Selamat Malam" :
    hour < 12 ? "Selamat Pagi" :
    hour < 17 ? "Selamat Siang" : "Selamat Sore";

  const firstName = user?.full_name?.split(" ")[0] ?? "Pengguna";
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-6 text-white shadow-md shadow-primary-950/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-12 left-12 h-40 w-40 rounded-full bg-primary-400/8 blur-2xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary-200 animate-pulse-gentle" />
              <span className="text-sm font-medium text-primary-200">{greeting},</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{firstName}</h1>
            <p className="mt-1 text-xs capitalize text-primary-200/70">{today}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/dashboard/photos"
                className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-primary-900 shadow-md hover:bg-primary-50 active:bg-primary-100 transition-all hover:scale-[1.02] active:scale-100"
              >
                <Scan className="h-3.5 w-3.5" /> Analisis Sekarang
              </Link>
              <Link
                href="/dashboard/habits"
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20 active:bg-white/5 transition-all border border-white/20"
              >
                <BarChart3 className="h-3.5 w-3.5" /> Catat Habit
              </Link>
            </div>
          </div>

          {/* Stage badge */}
          <div className="shrink-0 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm shadow-inner-sm">
              {isLoading ? (
                <div className="h-7 w-12 animate-pulse rounded-lg bg-white/20" />
              ) : data?.latest_severity_stage ? (
                <div className="text-center">
                  <p className="text-[9px] font-medium text-primary-200/80">Stage</p>
                  <p className="text-xl font-bold text-white leading-tight">
                    {data.latest_severity_stage.replace("stage_", "").replace("normal", "N")}
                  </p>
                  <p className="text-[9px] text-primary-300 font-medium">terkini</p>
                </div>
              ) : (
                <div className="text-center">
                  <Scan className="mx-auto h-5 w-5 text-primary-300" />
                  <p className="mt-1 text-[9px] text-primary-300">Belum ada</p>
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-primary-200/80 font-medium">Kondisi Kulit</p>
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-card ring-1 ring-black/[0.04]">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Kondisi</p>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
              <Scan className="h-3 w-3 text-slate-500" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : data?.latest_severity_stage ? (
            <Badge stage={data.latest_severity_stage} className="text-xs" />
          ) : (
            <span className="text-sm font-semibold text-slate-400">—</span>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Analisis terakhir</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-card ring-1 ring-black/[0.04]">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Foto</p>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
              <Camera className="h-3 w-3 text-slate-500" />
            </div>
          </div>
          {isLoading ? <Skeleton className="h-7 w-10" /> : (
            <p className="text-xl font-bold text-slate-900">{data?.total_photos ?? 0}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Total dianalisis</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-card ring-1 ring-black/[0.04]">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Stres</p>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
              <Flame className="h-3 w-3 text-slate-500" />
            </div>
          </div>
          {isLoading ? <Skeleton className="h-7 w-12" /> : (
            <p className="text-xl font-bold text-slate-900">
              {data?.avg_stress_level != null ? data.avg_stress_level.toFixed(1) : "—"}
              {data?.avg_stress_level != null && <span className="ml-1 text-xs font-normal text-slate-400">/10</span>}
            </p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Rata-rata</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-card ring-1 ring-black/[0.04]">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tidur</p>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
              <Moon className="h-3 w-3 text-slate-500" />
            </div>
          </div>
          {isLoading ? <Skeleton className="h-7 w-12" /> : (
            <p className="text-xl font-bold text-slate-900">
              {data?.avg_sleep_hours != null ? data.avg_sleep_hours.toFixed(1) : "—"}
              {data?.avg_sleep_hours != null && <span className="ml-1 text-xs font-normal text-slate-400">jam</span>}
            </p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Rata-rata</p>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Quick actions */}
        <div className="lg:col-span-3 rounded-xl bg-white p-5 shadow-card ring-1 ring-black/[0.04]">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Aksi Cepat</h2>
              <p className="mt-0.5 text-xs text-slate-400">Catat aktivitas hari ini</p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-primary-200 hover:bg-primary-50/60 hover:shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200 text-slate-500 group-hover:text-primary-600 group-hover:ring-primary-200 transition-colors">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-primary-700">{action.label}</p>
                  <p className="text-[11px] text-slate-400">{action.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-3 w-3 shrink-0 text-slate-300 group-hover:text-primary-400 transition-all group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Treatments */}
        <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-card ring-1 ring-black/[0.04]">
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Treatment Aktif</h2>
              {!isLoading && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {data?.active_treatments ?? 0} treatment berjalan
                </p>
              )}
            </div>
            <Link
              href="/dashboard/treatments"
              className="flex items-center gap-0.5 text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              Semua <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : data?.treatment_names?.length ? (
            <div className="space-y-1.5">
              {data.treatment_names.slice(0, 4).map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-slate-200">
                    <Pill className="h-3 w-3 text-slate-500" />
                  </div>
                  <span className="flex-1 truncate text-xs font-medium text-slate-700">{name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
              ))}
              {(data.treatment_names.length ?? 0) > 4 && (
                <p className="pt-1 text-center text-xs text-slate-400">
                  +{data.treatment_names.length - 4} lainnya
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-slate-200 py-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <Pill className="h-4 w-4 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Belum ada treatment</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Tambahkan untuk mulai melacak</p>
              </div>
              <Link
                href="/dashboard/treatments"
                className="rounded-lg bg-gradient-to-b from-primary-500 to-primary-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:from-primary-400 hover:to-primary-500 active:from-primary-600 active:to-primary-700 transition-all border border-primary-600/20 hover:scale-[1.02] active:scale-100 shadow-sm shadow-primary-900/10"
              >
                + Tambah
              </Link>
            </div>
          )}

          {/* Hydration */}
          <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-slate-200">
              <Droplets className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Jangan lupa minum air</p>
              <p className="text-[11px] text-slate-400">Target 8 gelas = 2000ml/hari</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
