import type { Metadata } from "next";

import { Register } from "@/components/auth/Register";

export const metadata: Metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mulai pantau kesehatan rambut Anda dengan AI
        </p>
      </div>
      <Register />
    </div>
  );
}
