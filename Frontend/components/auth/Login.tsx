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

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="current-password"
        required
        leftIcon={<Lock className="h-4 w-4" />}
        rightElement={
          <button
            type="button"
            tabIndex={-1}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Lupa password?
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isLoggingIn}>
        Masuk ke Akun
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400">atau</span>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          Daftar gratis sekarang
        </Link>
      </p>
    </form>
  );
}
