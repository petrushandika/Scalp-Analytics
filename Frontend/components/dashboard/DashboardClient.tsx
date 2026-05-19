"use client";

import { useAnalytics } from "@/hooks/analytics";
import { Badge, Card } from "@/components/ui";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className ?? ""}`} />;
}

export function DashboardClient() {
  const { data, isLoading } = useAnalytics();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Pantau progres kesehatan rambut Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Kondisi Terkini</h3>
          {isLoading ? (
            <Skeleton className="mt-2 h-6 w-24" />
          ) : data?.latest_severity_stage ? (
            <div className="mt-2">
              <Badge stage={data.latest_severity_stage} className="text-sm" />
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-400">Belum ada analisis</p>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Foto</h3>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{data?.total_photos ?? 0}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">Foto yang dianalisis</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-500">Rata-rata Stres (7 hari)</h3>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {data?.avg_stress != null ? data.avg_stress.toFixed(1) : "--"}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">Skala 1–10</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-500">Rata-rata Tidur (7 hari)</h3>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {data?.avg_sleep != null ? `${data.avg_sleep.toFixed(1)} jam` : "--"}
            </p>
          )}
        </Card>

        <Card className="sm:col-span-2">
          <h3 className="mb-3 text-sm font-medium text-gray-500">
            Treatment Aktif ({isLoading ? "…" : (data?.active_treatments ?? 0)})
          </h3>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : data?.treatment_names?.length ? (
            <ul className="flex flex-wrap gap-2">
              {data.treatment_names.map((name) => (
                <li
                  key={name}
                  className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
                >
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Belum ada treatment aktif</p>
          )}
        </Card>
      </div>
    </div>
  );
}
