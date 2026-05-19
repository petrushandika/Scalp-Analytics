"use client";

import {
  Activity,
  Camera,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Layers,
  Moon,
  Pill,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Badge, Card } from "@/components/ui";
import { useAnalytics } from "@/hooks/analytics";
import { useAuth } from "@/hooks/auth";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 ${className ?? ""}`} />;
}

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color,
  isLoading,
}: {
  label: string;
  value?: React.ReactNode;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isLoading: boolean;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-2xl font-bold text-slate-900">{value ?? "--"}</p>
      )}
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
    </Card>
  );
}

export function DashboardClient() {
  const { data, isLoading } = useAnalytics();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";
  const firstName = user?.full_name?.split(" ")[0] ?? "Pengguna";

  const quickActions = [
    {
      href: "/dashboard/photos",
      icon: Camera,
      label: "Upload Foto",
      color: "bg-primary-50 text-primary-700",
    },
    {
      href: "/dashboard/habits",
      icon: Activity,
      label: "Log Habit",
      color: "bg-blue-50 text-blue-700",
    },
    {
      href: "/dashboard/treatments",
      icon: Pill,
      label: "Tambah Treatment",
      color: "bg-purple-50 text-purple-700",
    },
    {
      href: "/dashboard/nutrition",
      icon: Droplets,
      label: "Catat Nutrisi",
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-6 text-white shadow-lg">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-200" />
              <span className="text-sm font-medium text-primary-100">{greeting},</span>
            </div>
            <h1 className="text-2xl font-bold">{firstName}!</h1>
            <p className="mt-1 text-sm capitalize text-primary-200">{today}</p>
          </div>
          <Link
            href="/dashboard/photos"
            className="flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <Plus className="h-4 w-4" />
            Analisis Sekarang
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-16 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Kondisi Terkini</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
              <Layers className="h-4 w-4 text-primary-600" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : data?.latest_severity_stage ? (
            <Badge stage={data.latest_severity_stage} className="w-fit text-sm" />
          ) : (
            <span className="text-sm text-slate-400">Belum ada data</span>
          )}
          <p className="text-xs text-slate-400">Analisis terakhir</p>
        </Card>

        <StatCard
          label="Total Foto"
          value={data?.total_photos ?? 0}
          subtext="Foto yang dianalisis"
          icon={Camera}
          color="bg-blue-50 text-blue-600"
          isLoading={isLoading}
        />

        <StatCard
          label="Rata-rata Stres"
          value={
            data?.avg_stress_level != null ? `${data.avg_stress_level.toFixed(1)}/10` : "--"
          }
          subtext="7 hari terakhir"
          icon={Flame}
          color="bg-orange-50 text-orange-600"
          isLoading={isLoading}
        />

        <StatCard
          label="Rata-rata Tidur"
          value={
            data?.avg_sleep_hours != null ? `${data.avg_sleep_hours.toFixed(1)} jam` : "--"
          }
          subtext="7 hari terakhir"
          icon={Moon}
          color="bg-indigo-50 text-indigo-600"
          isLoading={isLoading}
        />
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active treatments */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Treatment Aktif
              {!isLoading && (
                <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                  {data?.active_treatments ?? 0}
                </span>
              )}
            </h2>
            <Link
              href="/dashboard/treatments"
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
            >
              Lihat semua <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : data?.treatment_names?.length ? (
            <div className="flex flex-wrap gap-2">
              {data.treatment_names.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-primary-200"
                >
                  <Pill className="h-3 w-3" />
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Pill className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Belum ada treatment aktif</p>
                <p className="mt-1 text-xs text-slate-400">
                  Tambahkan treatment untuk mulai melacak
                </p>
              </div>
              <Link
                href="/dashboard/treatments"
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Tambah Treatment
              </Link>
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <Card>
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Aksi Cepat</h2>
            <p className="mt-0.5 text-xs text-slate-500">Catat aktivitas hari ini</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-3.5 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${action.color}`}
                >
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700">Konsistensi adalah kunci</p>
              <p className="text-[11px] text-slate-500">Catat setiap hari untuk hasil terbaik</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
