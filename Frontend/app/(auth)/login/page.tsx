import type { Metadata } from "next";
import { Suspense } from "react";

import { Login } from "@/components/auth/Login";

export const metadata: Metadata = {
  title: "Login — Scalp Analytics",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary-900 to-primary-700 p-12 text-white">
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="rgba(255,255,255,0.15)" />
            <path d="M18 6C11.373 6 6 11.373 6 18c0 3.314 1.343 6.314 3.515 8.485C9.515 26.485 18 30 18 30s8.485-3.515 8.485-3.515A11.956 11.956 0 0030 18c0-6.627-5.373-12-12-12z" fill="rgba(255,255,255,0.9)" />
            <circle cx="18" cy="16" r="4" fill="#0f766e" />
            <path d="M13 22c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-bold tracking-tight">Scalp Analytics</span>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Pantau kesehatan<br />rambut Anda<br />dengan AI.
            </h2>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed">
              Analisis kondisi kulit kepala secara real-time dan dapatkan rekomendasi perawatan yang personal.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: "📸", text: "Analisis foto berbasis kecerdasan buatan" },
              { icon: "📊", text: "Lacak progres dengan data habit & nutrisi" },
              { icon: "💊", text: "Kelola treatment dan rekomendasi personal" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-base">
                  {item.icon}
                </span>
                <span className="text-primary-100">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-300">Dipercaya oleh 1.000+ pengguna</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="#0d9488" />
            <path d="M18 6C11.373 6 6 11.373 6 18c0 3.314 1.343 6.314 3.515 8.485C9.515 26.485 18 30 18 30s8.485-3.515 8.485-3.515A11.956 11.956 0 0030 18c0-6.627-5.373-12-12-12z" fill="rgba(255,255,255,0.9)" />
            <circle cx="18" cy="16" r="4" fill="#0f766e" />
          </svg>
          <span className="text-lg font-bold text-slate-900">Scalp Analytics</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Selamat datang kembali</h1>
            <p className="mt-1.5 text-sm text-slate-500">Masuk ke akun Scalp Analytics Anda</p>
          </div>
          <Suspense>
            <Login />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
