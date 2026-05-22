import { BarChart3, Pill, Scan, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { Login } from "@/components/auth/Login";

export const metadata: Metadata = {
  title: "Login — Scalp Analytics",
};

const features = [
  {
    icon: Scan,
    title: "Analisis AI Real-time",
    desc: "Deteksi kondisi kulit kepala secara akurat",
    color: "text-primary-300",
    bg: "bg-primary-500/15",
  },
  {
    icon: BarChart3,
    title: "Tracking Komprehensif",
    desc: "Pantau habit, nutrisi & progres perawatan",
    color: "text-primary-300",
    bg: "bg-primary-500/15",
  },
  {
    icon: Pill,
    title: "Rekomendasi Personal",
    desc: "Treatment yang disesuaikan kondisi Anda",
    color: "text-primary-300",
    bg: "bg-primary-500/15",
  },
];

export default function LoginPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Brand panel — sticky, full height */}
      <div className="relative hidden lg:flex lg:w-[52%] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 p-12 text-white">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-48 w-48 rounded-full bg-primary-500/5 blur-2xl" />
        </div>

        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/20 ring-1 ring-primary-400/30">
              <Scan className="h-5 w-5 text-primary-300" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">Scalp Analytics</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3 w-3 text-primary-400" />
                <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-widest">Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold text-primary-300 ring-1 ring-primary-400/20 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Lebih dari 1.000 pengguna aktif
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Pantau kesehatan<br />rambut Anda<br />
              <span className="text-primary-300">dengan AI.</span>
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-sm">
              Analisis kondisi kulit kepala secara real-time dan dapatkan rekomendasi perawatan yang benar-benar personal.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.bg} ring-1 ring-white/10 ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{f.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — user avatars */}
        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D"].map((l) => (
              <div key={l} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/30 ring-2 ring-slate-900 text-[10px] font-bold text-primary-200">
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">Bergabung dengan ribuan pengguna yang telah merasakan manfaatnya</p>
        </div>
      </div>

      {/* Form panel — scrollable */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
            <Scan className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">Scalp Analytics</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Selamat datang kembali</h1>
            <p className="mt-2 text-sm text-slate-500">Masuk ke akun Scalp Analytics Anda untuk melanjutkan.</p>
          </div>
          <Suspense>
            <Login />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
