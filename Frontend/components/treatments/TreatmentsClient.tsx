"use client";

import {
  Calendar,
  CheckCircle2,
  Pill,
  PlusCircle,
  PowerOff,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import {
  useCreateTreatment,
  useDeactivateTreatment,
  useDeleteTreatment,
  useTreatments,
} from "@/hooks/treatment";
import { formatDate, getErrorMessage } from "@/lib/utils";
import type { TreatmentCategory } from "@/types/treatment";

const CATEGORIES: { value: TreatmentCategory; label: string }[] = [
  { value: "topical", label: "Topikal" },
  { value: "supplement", label: "Suplemen" },
  { value: "lifestyle", label: "Gaya Hidup" },
  { value: "medical", label: "Medis" },
];

const categoryColor: Record<TreatmentCategory, string> = {
  topical: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  supplement: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  lifestyle: "bg-green-50 text-green-700 ring-1 ring-green-200",
  medical: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const categoryAccent: Record<TreatmentCategory, string> = {
  topical: "bg-blue-500",
  supplement: "bg-purple-500",
  lifestyle: "bg-green-500",
  medical: "bg-red-500",
};

export function TreatmentsClient() {
  const [activeOnly, setActiveOnly] = useState(true);
  const { data: treatments, isLoading } = useTreatments(activeOnly);
  const createMutation = useCreateTreatment();
  const deactivateMutation = useDeactivateTreatment();
  const deleteMutation = useDeleteTreatment();

  const [form, setForm] = useState({
    name: "",
    category: "topical" as TreatmentCategory,
    frequency: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
    notes: "",
  });
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createMutation.mutateAsync({
        name: form.name,
        category: form.category,
        frequency: form.frequency,
        start_date: form.start_date,
        is_active: true,
        ...(form.end_date ? { end_date: form.end_date } : {}),
        ...(form.notes ? { notes: form.notes } : {}),
      });
      setForm({
        name: "",
        category: "topical",
        frequency: "",
        start_date: new Date().toISOString().slice(0, 10),
        end_date: "",
        notes: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Treatment</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola treatment perawatan rambut Anda</p>
      </div>

      {/* Add Treatment form */}
      <Card>
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
            <PlusCircle className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Tambah Treatment</h2>
            <p className="text-xs text-slate-500">Catat treatment baru Anda</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Two-column grid for name + category */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nama Treatment"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Minoxidil 5%, Biotin, dll."
              required
              leftIcon={<Tag className="h-4 w-4" />}
            />
            <Select
              label="Kategori"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Frekuensi"
            value={form.frequency}
            onChange={(e) => set("frequency", e.target.value)}
            placeholder="2x sehari, setiap pagi, dll."
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              required
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              hint="Opsional"
            />
          </div>

          <Textarea
            label="Catatan"
            rows={2}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" isLoading={createMutation.isPending} className="w-full">
            Tambah Treatment
          </Button>
        </form>
      </Card>

      {/* Treatment list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Daftar Treatment</h2>
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
              <p className="mt-1 text-sm text-slate-400">
                Tambahkan treatment di atas untuk mulai melacak
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {treatments.map((t) => (
              <div
                key={t.id}
                className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Left accent bar based on category */}
                <div className={`w-1.5 shrink-0 ${categoryAccent[t.category]}`} />

                <div className="flex flex-1 items-center gap-4 px-4 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <Pill className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{t.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${categoryColor[t.category]}`}
                      >
                        {CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category}
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
                    <p className="mt-0.5 text-sm text-slate-500">{t.frequency}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(t.start_date)}
                      {t.end_date ? ` — ${formatDate(t.end_date)}` : ""}
                    </p>
                    {t.notes && <p className="mt-1 text-xs text-slate-500">{t.notes}</p>}
                  </div>

                  {/* Action icon buttons */}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
