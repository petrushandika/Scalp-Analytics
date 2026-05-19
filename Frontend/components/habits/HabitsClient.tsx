"use client";

import {
  ActivitySquare,
  BedDouble,
  ClipboardList,
  Droplets,
  Flame,
  Moon,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Button, Card, Input, Textarea } from "@/components/ui";
import { useCreateHabit, useDeleteHabit, useHabits } from "@/hooks/habit";
import { formatDate, getErrorMessage } from "@/lib/utils";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const WATER_PRESETS = [250, 500, 750, 1000];

const STRESS_EMOJI: Record<number, string> = {
  1: "😌",
  2: "🙂",
  3: "😐",
  4: "😕",
  5: "😟",
  6: "😰",
  7: "😩",
  8: "😫",
  9: "🤯",
  10: "💀",
};

function stressColor(level: number): string {
  if (level <= 3) return "text-emerald-600";
  if (level <= 6) return "text-yellow-600";
  return "text-red-600";
}

function stressRowBg(level: number): string {
  if (level <= 3) return "bg-emerald-50";
  if (level <= 6) return "bg-yellow-50";
  return "bg-red-50";
}

export function HabitsClient() {
  const { data: habits, isLoading } = useHabits();
  const createMutation = useCreateHabit();
  const deleteMutation = useDeleteHabit();

  const [form, setForm] = useState({
    log_date: todayStr(),
    stress_level: 5,
    sleep_hours: 7,
    water_intake_ml: 2000,
    notes: "",
  });
  const [error, setError] = useState("");

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createMutation.mutateAsync({
        log_date: form.log_date,
        stress_level: Number(form.stress_level),
        sleep_hours: Number(form.sleep_hours),
        water_intake_ml: Number(form.water_intake_ml),
        ...(form.notes ? { notes: form.notes } : {}),
      });
      setForm({
        log_date: todayStr(),
        stress_level: 5,
        sleep_hours: 7,
        water_intake_ml: 2000,
        notes: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  // Summary stats from habits data
  const totalLogged = habits?.length ?? 0;
  const avgStress =
    habits && habits.length > 0
      ? (habits.reduce((s, h) => s + h.stress_level, 0) / habits.length).toFixed(1)
      : null;
  const avgSleep =
    habits && habits.length > 0
      ? (habits.reduce((s, h) => s + h.sleep_hours, 0) / habits.length).toFixed(1)
      : null;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Habit Logger</h1>
        <p className="mt-1 text-sm text-slate-500">Catat kebiasaan harian Anda</p>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
            <ClipboardList className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Catatan</p>
            <p className="text-xl font-bold text-slate-900">{totalLogged}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Rata-rata Stres</p>
            <p className="text-xl font-bold text-slate-900">{avgStress ?? "--"}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Moon className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Rata-rata Tidur</p>
            <p className="text-xl font-bold text-slate-900">
              {avgSleep ? `${avgSleep}j` : "--"}
            </p>
          </div>
        </Card>
      </div>

      {/* Form card with gradient header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <h2 className="font-semibold text-white">Catat Hari Ini</h2>
          <p className="mt-0.5 text-sm text-primary-100">Tambahkan catatan habit harian Anda</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Tanggal"
              type="date"
              value={form.log_date}
              onChange={(e) => set("log_date", e.target.value)}
              required
            />

            {/* Stress level */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ActivitySquare className="h-4 w-4 text-slate-400" />
                  Tingkat Stres
                </label>
                <span className="text-2xl">{STRESS_EMOJI[form.stress_level]}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.stress_level}
                  onChange={(e) => set("stress_level", Number(e.target.value))}
                  className="stress-slider w-full"
                  style={{ cursor: "pointer" }}
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>😌 Rendah</span>
                  <span className={`text-sm font-bold ${stressColor(form.stress_level)}`}>
                    {form.stress_level}/10
                  </span>
                  <span>😰 Tinggi</span>
                </div>
              </div>
            </div>

            {/* Sleep hours */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <BedDouble className="h-4 w-4 text-slate-400" />
                Jam Tidur
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                  onClick={() => set("sleep_hours", Math.max(0, form.sleep_hours - 0.5))}
                >
                  −
                </button>
                <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900">
                  {form.sleep_hours} <span className="font-normal text-slate-400">jam</span>
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                  onClick={() => set("sleep_hours", Math.min(24, form.sleep_hours + 0.5))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Water intake */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Droplets className="h-4 w-4 text-slate-400" />
                Konsumsi Air
              </label>
              <div className="grid grid-cols-4 gap-2">
                {WATER_PRESETS.map((ml) => (
                  <button
                    type="button"
                    key={ml}
                    className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                      form.water_intake_ml === ml
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => set("water_intake_ml", ml)}
                  >
                    {ml} ml
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={0}
                step={50}
                value={form.water_intake_ml}
                onChange={(e) => set("water_intake_ml", Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                placeholder="Atau masukkan jumlah kustom (ml)"
              />
            </div>

            <Textarea
              label="Catatan"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Aktivitas hari ini, perasaan, dll..."
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" isLoading={createMutation.isPending} className="w-full">
              Simpan Catatan
            </Button>
          </form>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="mb-4 font-semibold text-slate-900">Riwayat</h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : !habits?.length ? (
          <p className="text-sm text-slate-500">Belum ada catatan habit.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-slate-100">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Stres</th>
                  <th className="px-4 py-3">Tidur</th>
                  <th className="px-4 py-3">Air</th>
                  <th className="px-4 py-3">Catatan</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {habits.map((h, i) => (
                  <tr key={h.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatDate(h.log_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${stressRowBg(h.stress_level)} ${stressColor(h.stress_level)}`}
                      >
                        {STRESS_EMOJI[h.stress_level]} {h.stress_level}/10
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{h.sleep_hours} jam</td>
                    <td className="px-4 py-3 text-slate-700">{h.water_intake_ml} ml</td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-slate-500">
                      {h.notes ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteMutation.mutate(h.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
