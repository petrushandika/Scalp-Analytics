import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pantau progres kesehatan rambut Anda
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards - akan diisi di Sprint selanjutnya */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Hair Density</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">--</p>
          <p className="mt-1 text-xs text-gray-400">Upload foto untuk analisis</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Streak Hari Ini</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          <p className="mt-1 text-xs text-gray-400">Hari berturut-turut</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Treatment Hari Ini</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">0 / 0</p>
          <p className="mt-1 text-xs text-gray-400">Selesai / Total</p>
        </div>
      </div>
    </div>
  );
}
