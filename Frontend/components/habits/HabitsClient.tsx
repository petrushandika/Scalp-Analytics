"use client";

import {
  ActivitySquare,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Card, Textarea } from "@/components/ui";
import { useCreateHabit, useDeleteHabit, useHabits } from "@/hooks/habit";
import { useLogWater } from "@/hooks/nutrition";
import { formatDate, getErrorMessage } from "@/lib/utils";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Activity presets ─────────────────────────────────────────────────────────

const ACTIVITY_PRESETS = [
  { emoji: "🏃", label: "Lari Pagi" },
  { emoji: "🏋️", label: "Gym" },
  { emoji: "🚴", label: "Bersepeda" },
  { emoji: "🧘", label: "Yoga" },
  { emoji: "🏊", label: "Renang" },
  { emoji: "🚶", label: "Jalan Kaki" },
  { emoji: "⚽", label: "Futsal" },
  { emoji: "🏸", label: "Badminton" },
];

const DURATION_PRESETS = [15, 30, 45, 60, 90];

// ─── Stress questionnaire ─────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  { emoji: "😄", label: "Sangat Baik", base: 1 },
  { emoji: "🙂", label: "Baik", base: 3 },
  { emoji: "😐", label: "Biasa Saja", base: 5 },
  { emoji: "😟", label: "Buruk", base: 7 },
  { emoji: "😫", label: "Sangat Buruk", base: 9 },
];

const WORKLOAD_OPTIONS = [
  { label: "Ringan", mod: -1 },
  { label: "Sedang", mod: 0 },
  { label: "Berat", mod: 1 },
];

const ANXIETY_OPTIONS = [
  { label: "Tidak Cemas", mod: -1 },
  { label: "Sedikit", mod: 0 },
  { label: "Sangat Cemas", mod: 1 },
];

function calcStress(moodBase: number, workMod: number, anxMod: number): number {
  return Math.min(10, Math.max(1, moodBase + workMod + anxMod));
}

// ─── Sleep tracking ───────────────────────────────────────────────────────────

function getSleepPopupType(): "morning" | "evening" | null {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 21 || hour < 2) return "evening";
  return null;
}

function getSleepKey(type: "sleep" | "wake", date: string) {
  return `scalp_${type}_${date}`;
}

function calcSleepHours(sleepTime: string, wakeTime: string): number {
  const parts1 = sleepTime.split(":");
  const parts2 = wakeTime.split(":");
  const sh = Number(parts1[0] ?? 0);
  const sm = Number(parts1[1] ?? 0);
  const wh = Number(parts2[0] ?? 0);
  const wm = Number(parts2[1] ?? 0);
  const sleepMins = sh * 60 + sm;
  let wakeMins = wh * 60 + wm;
  if (wakeMins < sleepMins) wakeMins += 24 * 60;
  return Math.round(((wakeMins - sleepMins) / 60) * 10) / 10;
}

// ─── Water glasses ────────────────────────────────────────────────────────────

const GLASS_ML = 250;
const TOTAL_GLASSES = 8;

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

// ─── Sleep popup component ────────────────────────────────────────────────────

function SleepPopup({
  type,
  onConfirm,
  onDismiss,
}: {
  type: "morning" | "evening";
  onConfirm: (time: string) => void;
  onDismiss: () => void;
}) {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  const isMorning = type === "morning";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${isMorning ? "bg-amber-100" : "bg-primary-100"}`}
            >
              {isMorning ? "☀️" : "🌙"}
            </div>
            <div>
              <p className="font-bold text-slate-900">
                {isMorning ? "Selamat Pagi!" : "Mau Istirahat?"}
              </p>
              <p className="text-sm text-slate-500">
                {isMorning ? "Jam berapa kamu bangun tadi?" : "Catat jam tidurmu malam ini"}
              </p>
            </div>
          </div>
          <button onClick={onDismiss} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-bold text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDismiss}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Nanti
          </button>
          <button
            onClick={() => onConfirm(time)}
            className="flex-1 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {isMorning ? "Catat Bangun" : "Catat Tidur"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HabitsClient() {
  const { data: habits, isLoading } = useHabits();
  const createMutation = useCreateHabit();
  const deleteMutation = useDeleteHabit();
  const logWaterMutation = useLogWater();

  const today = todayStr();
  const popupType = getSleepPopupType();

  // Stress quiz state
  const [moodIdx, setMoodIdx] = useState<number | null>(null);
  const [workIdx, setWorkIdx] = useState<number | null>(null);
  const [anxIdx, setAnxIdx] = useState<number | null>(null);

  const stressLevel =
    moodIdx !== null && workIdx !== null && anxIdx !== null
      ? calcStress(
          MOOD_OPTIONS[moodIdx]?.base ?? 5,
          WORKLOAD_OPTIONS[workIdx]?.mod ?? 0,
          ANXIETY_OPTIONS[anxIdx]?.mod ?? 0,
        )
      : null;

  // Sleep state
  const [sleepHours, setSleepHours] = useState<number | null>(null);
  const [showSleepPopup, setShowSleepPopup] = useState(false);
  const [sleepPopupDismissed, setSleepPopupDismissed] = useState(false);

  // Water glasses state
  const [filledGlasses, setFilledGlasses] = useState(0);
  const waterMl = filledGlasses * GLASS_ML;

  const [activity, setActivity] = useState<string | null>(null);
  const [activityDuration, setActivityDuration] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [savedToday, setSavedToday] = useState(false);

  // Check if popup should show on mount
  useEffect(() => {
    if (!sleepPopupDismissed && popupType) {
      const dismissed = sessionStorage.getItem(`sleep_popup_${today}`);
      if (!dismissed) setShowSleepPopup(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved sleep data from localStorage
  useEffect(() => {
    const sleepTime = localStorage.getItem(getSleepKey("sleep", today));
    const wakeTime = localStorage.getItem(getSleepKey("wake", today));
    if (sleepTime && wakeTime) {
      setSleepHours(calcSleepHours(sleepTime, wakeTime));
    } else if (wakeTime) {
      // Only wake time — can still manually enter sleep hours
    }
  }, [today]);

  function handleSleepPopupConfirm(time: string) {
    if (popupType === "morning") {
      localStorage.setItem(getSleepKey("wake", today), time);
      const sleepTime = localStorage.getItem(getSleepKey("sleep", today));
      if (sleepTime) setSleepHours(calcSleepHours(sleepTime, time));
    } else {
      localStorage.setItem(getSleepKey("sleep", today), time);
    }
    sessionStorage.setItem(`sleep_popup_${today}`, "1");
    setShowSleepPopup(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stressLevel === null) {
      setError("Mohon jawab semua pertanyaan stres.");
      return;
    }
    setError("");
    try {
      await createMutation.mutateAsync({
        log_date: today,
        stress_level: stressLevel,
        ...(sleepHours !== null ? { sleep_hours: sleepHours } : {}),
        ...(activity ? { activity } : {}),
        ...(activityDuration !== null ? { activity_duration_min: activityDuration } : {}),
        ...(notes ? { notes } : {}),
      });
      setSavedToday(true);
      setMoodIdx(null);
      setWorkIdx(null);
      setAnxIdx(null);
      setSleepHours(null);
      setFilledGlasses(0);
      setActivity(null);
      setActivityDuration(null);
      setNotes("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const totalLogged = habits?.length ?? 0;
  const avgStress =
    habits && habits.length > 0
      ? (habits.reduce((s, h) => s + (h.stress_level ?? 0), 0) / habits.length).toFixed(1)
      : null;
  const avgSleep =
    habits && habits.length > 0
      ? (habits.reduce((s, h) => s + (h.sleep_hours ?? 0), 0) / habits.length).toFixed(1)
      : null;

  return (
    <>
      {showSleepPopup && popupType && (
        <SleepPopup
          type={popupType}
          onConfirm={handleSleepPopupConfirm}
          onDismiss={() => {
            sessionStorage.setItem(`sleep_popup_${today}`, "1");
            setShowSleepPopup(false);
            setSleepPopupDismissed(true);
          }}
        />
      )}

      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Habit Logger</h1>
          <p className="mt-1 text-sm text-slate-500">Catat kebiasaan harian Anda secara cerdas</p>
        </div>

        {/* Summary stats */}
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <Moon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Rata-rata Tidur</p>
              <p className="text-xl font-bold text-slate-900">
                {avgSleep ? `${avgSleep}j` : "--"}
              </p>
            </div>
          </Card>
        </div>

        {/* Form */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="font-semibold text-white">Catat Hari Ini</h2>
            <p className="mt-0.5 text-sm text-primary-100">
              {today} — jawab pertanyaan di bawah ini
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* ── Stress questionnaire ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ActivitySquare className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">Bagaimana kondisi Anda hari ini?</p>
                  {stressLevel !== null && (
                    <span
                      className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${stressColor(stressLevel)} bg-slate-100`}
                    >
                      Stres: {stressLevel}/10
                    </span>
                  )}
                </div>

                {/* Q1: Mood */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">Bagaimana perasaanmu?</p>
                  <div className="flex gap-2">
                    {MOOD_OPTIONS.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMoodIdx(i)}
                        className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-3 text-center transition-all ${
                          moodIdx === i
                            ? "bg-primary-50 ring-2 ring-primary-500"
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-[10px] font-medium text-slate-600">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Workload */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">Beban kerja/tugas hari ini?</p>
                  <div className="flex gap-2">
                    {WORKLOAD_OPTIONS.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setWorkIdx(i)}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                          workIdx === i
                            ? "bg-primary-50 text-primary-700 ring-2 ring-primary-500"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Anxiety */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">Seberapa cemas hari ini?</p>
                  <div className="flex gap-2">
                    {ANXIETY_OPTIONS.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAnxIdx(i)}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                          anxIdx === i
                            ? "bg-primary-50 text-primary-700 ring-2 ring-primary-500"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Sleep hours ── */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">Jam Tidur</p>
                  </div>
                  {sleepHours !== null && (
                    <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700">
                      <CheckCircle2 className="h-3 w-3" /> {sleepHours} jam (otomatis)
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowSleepPopup(true)}
                    className="ml-2 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  >
                    {sleepHours !== null ? "Ubah" : "Catat Tidur/Bangun"}
                  </button>
                </div>
                {sleepHours === null && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      onClick={() => setSleepHours(Math.max(0, (sleepHours ?? 7) - 0.5))}
                    >
                      −
                    </button>
                    <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900">
                      {sleepHours ?? "—"}{" "}
                      <span className="font-normal text-slate-400">jam</span>
                    </div>
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      onClick={() => setSleepHours(Math.min(24, (sleepHours ?? 7) + 0.5))}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* ── Exercise activity ── */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">Aktivitas Olahraga Hari Ini</p>
                  <span className="ml-auto text-xs text-slate-400">Opsional</span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {ACTIVITY_PRESETS.map((act) => (
                    <button
                      key={act.label}
                      type="button"
                      onClick={() => setActivity(activity === act.label ? null : act.label)}
                      className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-center transition-all ${
                        activity === act.label
                          ? "bg-primary-50 ring-2 ring-primary-500"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xl">{act.emoji}</span>
                      <span className="text-[10px] font-medium text-slate-600 leading-tight">{act.label}</span>
                    </button>
                  ))}
                </div>
                {activity && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-slate-500">Durasi {activity}?</p>
                    <div className="flex flex-wrap gap-2">
                      {DURATION_PRESETS.map((min) => (
                        <button
                          key={min}
                          type="button"
                          onClick={() => setActivityDuration(activityDuration === min ? null : min)}
                          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                            activityDuration === min
                              ? "bg-primary-600 text-white shadow-sm"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {min} menit
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Water glasses ── */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">Konsumsi Air Hari Ini</p>
                  </div>
                  <span className="text-sm font-bold text-primary-600">
                    {waterMl} / {TOTAL_GLASSES * GLASS_ML} ml
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: TOTAL_GLASSES }).map((_, i) => {
                    const filled = i < filledGlasses;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const next = filled ? i : i + 1;
                          setFilledGlasses(next);
                          if (!filled) logWaterMutation.mutate({ amount_ml: GLASS_ML, log_date: today });
                        }}
                        title={`${(i + 1) * GLASS_ML} ml`}
                        className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-center text-lg transition-all ${
                          filled
                            ? "bg-primary-100 text-primary-600 ring-1 ring-primary-300"
                            : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        🥛
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-xs text-slate-400">Ketuk gelas untuk menambah</p>
                  {filledGlasses === TOTAL_GLASSES && (
                    <p className="text-xs font-medium text-primary-600">Target terpenuhi! 🎉</p>
                  )}
                </div>
              </div>

              <Textarea
                label="Catatan Tambahan"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aktivitas hari ini, perasaan, dll..."
              />

              {error && <p className="text-sm text-red-500">{error}</p>}
              {savedToday && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Catatan hari ini berhasil disimpan!
                </div>
              )}

              <Button
                type="submit"
                disabled={stressLevel === null}
                isLoading={createMutation.isPending}
                className="w-full"
              >
                Simpan Catatan Hari Ini
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
                    <th className="px-4 py-3">Olahraga</th>
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
                        {h.stress_level != null ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${stressRowBg(h.stress_level)} ${stressColor(h.stress_level)}`}
                          >
                            {h.stress_level}/10
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {h.sleep_hours != null ? `${h.sleep_hours} jam` : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {h.activity ? (
                          <span className="text-sm">
                            {h.activity}
                            {h.activity_duration_min ? ` (${h.activity_duration_min}m)` : ""}
                          </span>
                        ) : "—"}
                      </td>
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
    </>
  );
}
