"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/auth";
import { registerSchema, type RegisterFormValues } from "@/lib/schema";
import { getErrorMessage } from "@/lib/utils";

export function Register() {
  const { register: registerUser, isRegistering, registerError } = useAuth();

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
      {registerError && (
        <Alert variant="error">{getErrorMessage(registerError)}</Alert>
      )}

      <Input
        label="Nama Lengkap"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        required
        error={errors.full_name?.message}
        {...register("full_name")}
      />

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
        placeholder="Min. 8 karakter, 1 huruf kapital, 1 angka"
        autoComplete="new-password"
        required
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Konfirmasi Password"
        type="password"
        placeholder="Ulangi password Anda"
        autoComplete="new-password"
        required
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      <Button type="submit" className="w-full" isLoading={isRegistering}>
        Buat Akun
      </Button>

      <p className="text-center text-sm text-gray-500">
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
