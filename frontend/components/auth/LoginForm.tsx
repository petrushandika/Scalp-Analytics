"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { Alert, Button, Input } from "@/components/ui";

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {justRegistered && (
        <Alert variant="success">
          Registrasi berhasil! Silakan login dengan akun Anda.
        </Alert>
      )}

      {loginError && (
        <Alert variant="error">{getErrorMessage(loginError)}</Alert>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="nama@example.com"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
        >
          Lupa password?
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoggingIn}>
        Masuk
      </Button>

      <p className="text-center text-sm text-gray-500">
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
