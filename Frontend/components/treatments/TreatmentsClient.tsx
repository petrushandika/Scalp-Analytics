"use client";

import { useState } from "react";
import { useTreatments, useCreateTreatment, useDeactivateTreatment, useDeleteTreatment } from "@/hooks/treatment";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { formatDate, getErrorMessage } from "@/lib/utils";
import type { TreatmentCategory } from "@/types/treatment";

const CATEGORIES: { value: TreatmentCategory; label: string }[] = [
  { value: "topical", label: "Topikal" },
  { value: "supplement", label: "Suplemen" },
  { value: "lifestyle", label: "Gaya Hidup" },
  { value: "medical", label: "Medis" },
];

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
      setForm({ name: "", category: "topical", frequency: "", start_date: new Date().toISOString().slice(0, 10), end_date: "", notes: "" });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Treatment</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola treatment perawatan rambut Anda</p>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Tambah Treatment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Treatment"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Minoxidil 5%, Biotin, dll."
            required
          />

          <Select
            label="Kategori"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>

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

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Daftar Treatment</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeOnly ? "primary" : "outline"}
              onClick={() => setActiveOnly(true)}
            >
              Aktif
            </Button>
            <Button
              size="sm"
              variant={!activeOnly ? "primary" : "outline"}
              onClick={() => setActiveOnly(false)}
            >
              Semua
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-20" />
            ))}
          </div>
        ) : !treatments?.length ? (
          <p className="text-sm text-gray-500">Tidak ada treatment {activeOnly ? "aktif" : ""}.</p>
        ) : (
          <div className="space-y-3">
            {treatments.map((t) => (
              <Card key={t.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{t.name}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
                        {t.category}
                      </span>
                      {t.is_active && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{t.frequency}</p>
                    <p className="text-xs text-gray-400">
                      {formatDate(t.start_date)}
                      {t.end_date ? ` — ${formatDate(t.end_date)}` : ""}
                    </p>
                    {t.notes && <p className="mt-1 text-xs text-gray-500">{t.notes}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {t.is_active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deactivateMutation.mutate(t.id)}
                        isLoading={deactivateMutation.isPending}
                      >
                        Nonaktifkan
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteMutation.mutate(t.id)}
                      isLoading={deleteMutation.isPending}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
