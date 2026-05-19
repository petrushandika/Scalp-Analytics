import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
        <p className="mt-1 text-sm text-gray-500">Login ke akun Scalp Analytics Anda</p>
      </div>
      <LoginForm />
    </div>
  );
}
