import { Brain, Lock, MessageSquareQuote, Scan, Sparkles, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { Register } from "@/components/auth/Register";

export const metadata: Metadata = {
  title: "Daftar — Scalp Analytics",
};

const perks = [
  { icon: Scan,        text: "Analisis AI pertama gratis selamanya" },
  { icon: TrendingUp,  text: "Dashboard progres yang mudah dipahami" },
  { icon: Brain,       text: "Notifikasi treatment & pengingat rutin" },
  { icon: Lock,        text: "Data aman & terenkripsi penuh" },
];

export default function RegisterPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Brand panel — sticky, full height */}
      <div className="relative hidden lg:flex lg:w-[52%] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 p-12 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
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
        <div className="relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold text-primary-300 ring-1 ring-primary-400/20 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Daftar gratis, tanpa kartu kredit
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Mulai perjalanan<br />perawatan rambut<br />
              <span className="text-primary-300">Anda hari ini.</span>
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-sm">
              Buat akun gratis dan dapatkan analisis pertama kulit kepala Anda dalam hitungan menit.
            </p>
          </div>

          <div className="space-y-3.5">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 ring-1 ring-primary-400/20">
                  <Icon className="h-4 w-4 text-primary-300" />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-500/20">
                <MessageSquareQuote className="h-4 w-4 text-primary-300" />
              </div>
              <div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;Setelah 3 bulan pakai Scalp Analytics, rambut rontok saya berkurang drastis. Rekomendasi treatment-nya benar-benar pas!&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-400">— Budi S., Jakarta</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative text-xs text-slate-500">
          Dipercaya oleh 1.000+ pengguna di Indonesia
        </div>
      </div>

      {/* Form panel — scrollable */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-6 py-12">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
            <Scan className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">Scalp Analytics</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Buat akun baru</h1>
            <p className="mt-2 text-sm text-slate-500">
              Mulai pantau kesehatan rambut Anda dengan kecerdasan buatan.
            </p>
          </div>
          <Register />
        </div>
      </div>
    </div>
  );
}
