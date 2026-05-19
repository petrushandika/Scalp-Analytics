"use client";

import {
  BarChart3,
  Camera,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Pill,
  Salad,
  User,
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
  { href: "/dashboard/profile", label: "Profil", icon: User, exact: false },
];

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-slate-100 px-5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-600">
          <Dumbbell className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-900">Scalp Analytics</span>
        <span className="ml-auto rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary-700">
          v1
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        {mainNavItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                className={cn("h-4 w-4 shrink-0", active ? "text-primary-600" : "text-slate-400")}
              />
              {item.label}
            </Link>
          );
        })}

        <p className="mb-1 mt-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Pengaturan
        </p>
        {settingsNavItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                className={cn("h-4 w-4 shrink-0", active ? "text-primary-600" : "text-slate-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Pro banner */}
      <div className="mx-3 mb-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-3 ring-1 ring-primary-200">
        <p className="text-xs font-semibold text-primary-800">Upgrade ke Pro</p>
        <p className="mt-0.5 text-[11px] text-primary-600">
          Analisis tak terbatas & laporan lanjutan
        </p>
        <button className="mt-2 w-full rounded-lg bg-primary-600 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-700">
          Lihat Paket
        </button>
      </div>

      {/* User info + logout */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={user?.full_name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">{user?.full_name}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
