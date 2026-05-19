"use client";

import { useState } from "react";
import { useHabits, useCreateHabit, useDeleteHabit } from "@/hooks/habit";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { getErrorMessage } from "@/lib/utils";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
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
      setForm({ log_date: todayStr(), stress_level: 5, sleep_hours: 7, water_intake_ml: 2000, notes: "" });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Habit Logger</h1>
        <p className="mt-1 text-sm text-gray-500">Catat kebiasaan harian Anda</p>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Catat Hari Ini</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tanggal"
            type="date"
            value={form.log_date}
            onChange={(e) => set("log_date", e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Tingkat Stres: <span className="font-bold text-primary-600">{form.stress_level}</span>/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={form.stress_level}
              onChange={(e) => set("stress_level", Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Rendah (1)</span>
              <span>Tinggi (10)</span>
            </div>
          </div>

          <Input
            label="Jam Tidur"
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={form.sleep_hours}
            onChange={(e) => set("sleep_hours", e.target.value)}
            required
          />

          <Input
            label="Konsumsi Air (ml)"
            type="number"
            min={0}
            step={100}
            value={form.water_intake_ml}
            onChange={(e) => set("water_intake_ml", e.target.value)}
            required
          />

          <Textarea
            label="Catatan"
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Aktivitas hari ini, dll..."
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" isLoading={createMutation.isPending} className="w-full">
            Simpan
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Riwayat</h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-16" />
            ))}
          </div>
        ) : !habits?.length ? (
          <p className="text-sm text-gray-500">Belum ada catatan habit.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Stres</th>
                  <th className="px-4 py-3">Tidur</th>
                  <th className="px-4 py-3">Air (ml)</th>
                  <th className="px-4 py-3">Catatan</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {habits.map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 py-3 text-gray-900">{formatDate(h.log_date)}</td>
                    <td className="px-4 py-3 text-gray-700">{h.stress_level}/10</td>
                    <td className="px-4 py-3 text-gray-700">{h.sleep_hours} jam</td>
                    <td className="px-4 py-3 text-gray-700">{h.water_intake_ml}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{h.notes ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(h.id)}
                        isLoading={deleteMutation.isPending}
                        className="text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </Button>
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
