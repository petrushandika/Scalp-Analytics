"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { usersApi } from "@/lib/api";
import { Button, Card, Input, Select } from "@/components/ui";
import { getErrorMessage } from "@/lib/utils";
import type { UpdateProfileRequest } from "@/types/auth";

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
        <div className="animate-pulse rounded-xl bg-gray-200 h-8 w-48" />
        <div className="animate-pulse rounded-xl bg-gray-200 h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola informasi akun Anda</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
            {user?.full_name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.full_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={form.full_name ?? ""}
            onChange={(e) => set("full_name", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tinggi Badan (cm)"
              type="number"
              min={100}
              max={250}
              value={form.height_cm ?? ""}
              onChange={(e) => set("height_cm", e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              label="Berat Badan (kg)"
              type="number"
              min={30}
              max={300}
              step={0.1}
              value={form.weight_kg ?? ""}
              onChange={(e) => set("weight_kg", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <Input
            label="Usia"
            type="number"
            min={10}
            max={120}
            value={form.age ?? ""}
            onChange={(e) => set("age", e.target.value ? Number(e.target.value) : undefined)}
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

          {success && <p className="text-sm text-green-600">Profil berhasil diperbarui.</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" isLoading={saving} className="w-full">
            Simpan Perubahan
          </Button>
        </form>
      </Card>
    </div>
  );
}
