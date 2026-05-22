"use client";

import {
  CheckCircle2,
  ChevronDown,
  Pill,
  PowerOff,
  PlusCircle,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Button, Card, Input, Textarea } from "@/components/ui";
import {
  useCreateTreatment,
  useDeactivateTreatment,
  useDeleteTreatment,
  useTreatments,
} from "@/hooks/treatment";
import { formatDate, getErrorMessage } from "@/lib/utils";
import type { CreateTreatmentRequest, TreatmentFrequency } from "@/types/treatment";

const PRESET_TREATMENTS: (CreateTreatmentRequest & { category: string; emoji: string })[] = [
  {
    emoji: "💧",
    category: "Topikal",
    name: "Minoxidil 2%",
    frequency: "daily",
    dosage: "1ml pagi & malam",
    description: "Topikal untuk merangsang pertumbuhan rambut",
  },
  {
    emoji: "💧",
    category: "Topikal",
    name: "Minoxidil 5%",
    frequency: "daily",
    dosage: "1ml pagi & malam",
    description: "Konsentrasi lebih tinggi untuk hasil lebih cepat",
  },
  {
    emoji: "🧴",
    category: "Topikal",
    name: "Ketoconazole Shampoo",
    frequency: "weekly",
    dosage: "2-3x seminggu",
    description: "Sampo anti-jamur & anti-ketombe",
  },
  {
    emoji: "💊",
    category: "Medis",
    name: "Finasteride 1mg",
    frequency: "daily",
    dosage: "1 tablet sehari",
    description: "Penghambat DHT — konsultasi dokter terlebih dahulu",
  },
  {
    emoji: "🌿",
    category: "Suplemen",
    name: "Biotin 2500mcg",
    frequency: "daily",
    dosage: "1 tablet pagi hari",
    description: "Vitamin B7 untuk kuku & rambut",
  },
  {
    emoji: "⚡",
    category: "Suplemen",
    name: "Zinc 10mg",
    frequency: "daily",
    dosage: "1 tablet sehari",
    description: "Mineral penting untuk pertumbuhan rambut",
  },
  {
    emoji: "☀️",
    category: "Suplemen",
    name: "Vitamin D3 1000IU",
    frequency: "daily",
    dosage: "1 kapsul sehari",
    description: "Vitamin D untuk kesehatan folikel rambut",
  },
  {
    emoji: "🌸",
    category: "Topikal",
    name: "Rosemary Oil",
    frequency: "daily",
    dosage: "5-10 tetes ke kulit kepala",
    description: "Minyak esensial untuk sirkulasi darah",
  },
  {
    emoji: "🔵",
    category: "Gaya Hidup",
    name: "Derma Roller 0.5mm",
    frequency: "weekly",
    dosage: "1x seminggu",
    description: "Microneedling untuk stimulasi folikel rambut",
  },
  {
    emoji: "🤲",
    category: "Gaya Hidup",
    name: "Pijat Kulit Kepala",
    frequency: "daily",
    dosage: "5-10 menit",
    description: "Meningkatkan sirkulasi darah ke folikel rambut",
  },
];

const FREQ_LABELS: Record<TreatmentFrequency, string> = {
  daily: "Setiap hari",
  weekly: "Mingguan",
  custom: "Kustom",
};

const FREQ_BADGE: Record<TreatmentFrequency, string> = {
  daily: "bg-primary-50 text-primary-700",
  weekly: "bg-amber-50 text-amber-700",
  custom: "bg-slate-100 text-slate-600",
};

export function TreatmentsClient() {
  const [activeOnly, setActiveOnly] = useState(true);
  const { data: treatments, isLoading } = useTreatments(activeOnly);
  const createMutation = useCreateTreatment();
  const deactivateMutation = useDeactivateTreatment();
  const deleteMutation = useDeleteTreatment();

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [form, setForm] = useState<CreateTreatmentRequest>({
    name: "",
    frequency: "daily",
    dosage: "",
    description: "",
  });
  const [error, setError] = useState("");

  function set(field: keyof CreateTreatmentRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSelectPreset(preset: CreateTreatmentRequest) {
    setError("");
    try {
      await createMutation.mutateAsync(preset);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createMutation.mutateAsync({
        name: form.name,
        frequency: form.frequency,
        ...(form.dosage ? { dosage: form.dosage } : {}),
        ...(form.description ? { description: form.description } : {}),
      });
      setForm({ name: "", frequency: "daily", dosage: "", description: "" });
      setShowCustomForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Treatment</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pilih treatment dari daftar atau tambahkan sendiri
        </p>
      </div>

      {/* Preset treatments grid */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <h2 className="font-semibold text-white">Treatment Populer</h2>
          <p className="mt-0.5 text-sm text-primary-100">
            Ketuk untuk langsung menambahkan ke daftar Anda
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {PRESET_TREATMENTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              disabled={createMutation.isPending}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-60"
            >
              <span className="mt-0.5 shrink-0 text-xl">{preset.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-slate-900">{preset.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {FREQ_LABELS[preset.frequency]}
                  {preset.dosage ? ` · ${preset.dosage}` : ""}
                </p>
                <span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {preset.category}
                </span>
              </div>
            </button>
          ))}
        </div>
        {error && <p className="px-4 pb-3 text-sm text-red-500">{error}</p>}
      </div>

      {/* Custom form */}
      <Card>
        <button
          type="button"
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="flex w-full items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
            <PlusCircle className="h-5 w-5 text-slate-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-slate-900">Treatment Kustom</p>
            <p className="text-xs text-slate-500">Tambahkan yang tidak ada di daftar</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${showCustomForm ? "rotate-180" : ""}`}
          />
        </button>

        {showCustomForm && (
          <form
            onSubmit={handleCustomSubmit}
            className="mt-5 space-y-4 border-t border-slate-100 pt-5"
          >
            <Input
              label="Nama Treatment"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nama treatment..."
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Frekuensi</label>
              <div className="flex gap-2">
                {(["daily", "weekly", "custom"] as TreatmentFrequency[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set("frequency", f)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                      form.frequency === f
                        ? "bg-primary-50 text-primary-700 ring-2 ring-primary-500"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {FREQ_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Dosis / Cara Pakai"
              value={form.dosage ?? ""}
              onChange={(e) => set("dosage", e.target.value)}
              placeholder="Contoh: 1 tablet pagi hari"
            />
            <Textarea
              label="Deskripsi"
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Catatan tambahan..."
            />
            <Button type="submit" isLoading={createMutation.isPending} className="w-full">
              Tambah Treatment
            </Button>
          </form>
        )}
      </Card>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Daftar Treatment Saya</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveOnly(true)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeOnly
                  ? "bg-primary-600 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveOnly(false)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                !activeOnly
                  ? "bg-primary-600 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : !treatments?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Pill className="h-7 w-7 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-slate-600">
                Tidak ada treatment {activeOnly ? "aktif" : ""}
              </p>
              <p className="mt-1 text-sm text-slate-400">Pilih dari daftar populer di atas</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {treatments.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <Pill className="h-5 w-5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{t.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${FREQ_BADGE[t.frequency]}`}
                    >
                      {FREQ_LABELS[t.frequency]}
                    </span>
                    {t.is_active ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        <XCircle className="h-3 w-3" /> Nonaktif
                      </span>
                    )}
                  </div>
                  {t.dosage && <p className="mt-0.5 text-sm text-slate-500">{t.dosage}</p>}
                  {t.description && (
                    <p className="mt-0.5 text-xs text-slate-400">{t.description}</p>
                  )}
                  <p className="mt-0.5 text-xs text-slate-400">Mulai: {formatDate(t.created_at)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {t.is_active && (
                    <button
                      onClick={() => deactivateMutation.mutate(t.id)}
                      disabled={deactivateMutation.isPending}
                      title="Nonaktifkan"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50"
                    >
                      <PowerOff className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(t.id)}
                    disabled={deleteMutation.isPending}
                    title="Hapus"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
