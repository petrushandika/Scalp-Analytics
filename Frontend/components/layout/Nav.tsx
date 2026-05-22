"use client";

import {
  BarChart3,
  Camera,
  LayoutDashboard,
  LogOut,
  Pill,
  Salad,
  Scan,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/photos", label: "Foto & Analisis", icon: Camera, exact: false },
  { href: "/dashboard/habits", label: "Habit Logger", icon: BarChart3, exact: false },
  { href: "/dashboard/treatments", label: "Treatment", icon: Pill, exact: false },
  { href: "/dashboard/nutrition", label: "Nutrisi", icon: Salad, exact: false },
];

const settingsNavItems = [
  { href: "/dashboard/profile", label: "Profil Saya", icon: User, exact: false },
];

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-white border-r border-slate-200/80">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-500 shadow-lg shadow-primary-900/50">
          <Scan className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-slate-900">Scalp Analytics</span>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-500/20 px-1.5 py-0 text-[9px] font-semibold text-primary-600">
              <Zap className="h-2.5 w-2.5" /> PRO
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400/80">
          Menu
        </p>
        {mainNavItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary-50 text-primary-600 font-semibold shadow-[inset_0_1px_2px_rgba(20,184,166,0.05)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                  active
                    ? "bg-primary-100 text-primary-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />
              )}
            </Link>
          );
        })}

        <div className="mx-2.5 my-3 h-px bg-slate-100" />

        <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400/80">
          Pengaturan
        </p>
        {settingsNavItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary-50 text-primary-600 font-semibold shadow-[inset_0_1px_2px_rgba(20,184,166,0.05)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                  active
                    ? "bg-primary-100 text-primary-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
              {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="mx-3 mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-4">
        <p className="text-xs font-bold text-white">Upgrade ke Pro ✨</p>
        <p className="mt-1 text-[11px] text-primary-200 leading-relaxed">
          Analisis AI tak terbatas, laporan mendalam & notifikasi cerdas
        </p>
        <button className="mt-3 w-full rounded-xl bg-white py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-50 transition-colors">
          Lihat Paket
        </button>
      </div>

      {/* User section */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2.5 rounded-xl p-2">
          <Avatar name={user?.full_name ?? null} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">{user?.full_name}</p>
            <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
