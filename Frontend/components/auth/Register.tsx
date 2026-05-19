"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/auth";
import { registerSchema, type RegisterFormValues } from "@/lib/schema";
import { getErrorMessage } from "@/lib/utils";

export function Register() {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await registerUser({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {registerError && <Alert variant="error">{getErrorMessage(registerError)}</Alert>}

      <Input
        label="Nama Lengkap"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        required
        leftIcon={<User className="h-4 w-4" />}
        error={errors.full_name?.message}
        {...register("full_name")}
      />

      <Input
        label="Email"
        type="email"
        placeholder="nama@example.com"
        autoComplete="email"
        required
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 karakter, 1 huruf kapital, 1 angka"
            autoComplete="new-password"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 hover:border-slate-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            {...register("password")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password?.message && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
          Konfirmasi Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="confirm_password"
            type={showConfirm ? "text" : "password"}
            placeholder="Ulangi password Anda"
            autoComplete="new-password"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 hover:border-slate-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            {...register("confirm_password")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirm_password?.message && (
          <p className="text-xs text-red-500">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isRegistering}>
        Buat Akun
      </Button>

      <p className="text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Login di sini
        </Link>
      </p>
    </form>
  );
}
