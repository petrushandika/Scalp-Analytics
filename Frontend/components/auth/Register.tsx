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

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Min. 8 karakter, 1 huruf kapital, 1 angka"
        autoComplete="new-password"
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
        hint="Minimal 8 karakter, mengandung huruf kapital dan angka"
        {...register("password")}
      />

      <Input
        label="Konfirmasi Password"
        type={showConfirm ? "text" : "password"}
        placeholder="Ulangi password Anda"
        autoComplete="new-password"
        required
        leftIcon={<Lock className="h-4 w-4" />}
        rightElement={
          <button
            type="button"
            tabIndex={-1}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500 leading-relaxed">
        Dengan mendaftar, Anda menyetujui{" "}
        <span className="font-medium text-primary-600">Syarat & Ketentuan</span> dan{" "}
        <span className="font-medium text-primary-600">Kebijakan Privasi</span> kami.
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isRegistering}>
        Buat Akun Gratis
      </Button>

      <p className="text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          Login di sini
        </Link>
      </p>
    </form>
  );
}
