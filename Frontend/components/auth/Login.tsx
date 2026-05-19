"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/auth";
import { loginSchema, type LoginFormValues } from "@/lib/schema";
import { getErrorMessage } from "@/lib/utils";

export function Login() {
  const { login, isLoggingIn, loginError } = useAuth();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {justRegistered && (
        <Alert variant="success">Registrasi berhasil! Silakan login dengan akun Anda.</Alert>
      )}

      {loginError && <Alert variant="error">{getErrorMessage(loginError)}</Alert>}

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
            placeholder="••••••••"
            autoComplete="current-password"
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

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
        >
          Lupa password?
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isLoggingIn}>
        Masuk
      </Button>

      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
