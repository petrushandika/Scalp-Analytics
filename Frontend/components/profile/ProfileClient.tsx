"use client";

import { CheckCircle2, Mail, User2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, Button, Card, Input, Select } from "@/components/ui";
import { useAuth } from "@/hooks/auth";
import { usersApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type { UpdateProfileRequest } from "@/types/auth";

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

export function ProfileClient() {
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState<UpdateProfileRequest>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const next: UpdateProfileRequest = { full_name: user.full_name ?? "" };
      if (user.height_cm != null) next.height_cm = user.height_cm;
      if (user.weight_kg != null) next.weight_kg = user.weight_kg;
      if (user.age != null) next.age = user.age;
      if (user.gender != null) next.gender = user.gender;
      if (user.activity_level != null) next.activity_level = user.activity_level;
      setForm(next);
    }
  }, [user]);

  function set(field: keyof UpdateProfileRequest, value: string | number | undefined) {
    setForm((prev) => {
      const next = { ...prev };
      if (value === undefined) {
        delete next[field];
      } else {
        (next as Record<string, unknown>)[field] = value;
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await usersApi.updateProfile(form);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola informasi akun Anda</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: avatar card ── */}
        <Card className="flex flex-col items-center gap-5 p-8 text-center">
          <Avatar name={user?.full_name} size="xl" />
          <div>
            <p className="text-lg font-bold text-slate-900">{user?.full_name ?? "—"}</p>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </p>
          </div>

          {/* Stats row */}
          <div className="w-full space-y-2 rounded-xl bg-slate-50 p-4 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <User2 className="h-3.5 w-3.5" /> Status
              </span>
              <span className="font-semibold text-emerald-600">Aktif</span>
            </div>
            {memberSince && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Member sejak</span>
                <span className="font-medium text-slate-700">{memberSince}</span>
              </div>
            )}
            {user?.gender && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Jenis kelamin</span>
                <span className="font-medium capitalize text-slate-700">
                  {user.gender === "male"
                    ? "Laki-laki"
                    : user.gender === "female"
                      ? "Perempuan"
                      : "Lainnya"}
                </span>
              </div>
            )}
            {user?.height_cm && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tinggi</span>
                <span className="font-medium text-slate-700">{user.height_cm} cm</span>
              </div>
            )}
            {user?.weight_kg && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Berat</span>
                <span className="font-medium text-slate-700">{user.weight_kg} kg</span>
              </div>
            )}
          </div>
        </Card>

        {/* ── Right: edit form ── */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-5 font-semibold text-slate-900">Edit Profil</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Informasi Dasar */}
              <SectionDivider title="Informasi Dasar" />
              <Input
                label="Nama Lengkap"
                value={form.full_name ?? ""}
                onChange={(e) => set("full_name", e.target.value)}
                required
              />

              {/* Data Fisik */}
              <SectionDivider title="Data Fisik" />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Tinggi Badan (cm)"
                  type="number"
                  min={100}
                  max={250}
                  value={form.height_cm ?? ""}
                  onChange={(e) =>
                    set("height_cm", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
                <Input
                  label="Berat Badan (kg)"
                  type="number"
                  min={30}
                  max={300}
                  step={0.1}
                  value={form.weight_kg ?? ""}
                  onChange={(e) =>
                    set("weight_kg", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Usia"
                  type="number"
                  min={10}
                  max={120}
                  value={form.age ?? ""}
                  onChange={(e) =>
                    set("age", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
                <Select
                  label="Jenis Kelamin"
                  value={form.gender ?? ""}
                  onChange={(e) => set("gender", e.target.value || undefined)}
                >
                  <option value="">Pilih...</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                  <option value="other">Lainnya</option>
                </Select>
              </div>

              {/* Aktivitas */}
              <SectionDivider title="Aktivitas" />
              <Select
                label="Tingkat Aktivitas"
                value={form.activity_level ?? ""}
                onChange={(e) => set("activity_level", e.target.value || undefined)}
              >
                <option value="">Pilih...</option>
                <option value="sedentary">Sedentary (jarang olahraga)</option>
                <option value="light">Light (1-3x/minggu)</option>
                <option value="moderate">Moderate (3-5x/minggu)</option>
                <option value="active">Active (6-7x/minggu)</option>
                <option value="very_active">Very Active (2x/hari)</option>
              </Select>

              {/* Feedback */}
              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Profil berhasil diperbarui.
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  <XCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" isLoading={saving} className="w-full">
                Simpan Perubahan
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
