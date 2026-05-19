"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/photos", label: "Foto & Analisis", icon: "📸" },
  { href: "/dashboard/habits", label: "Habit Logger", icon: "📊" },
  { href: "/dashboard/treatments", label: "Treatment", icon: "💊" },
  { href: "/dashboard/profile", label: "Profil", icon: "👤" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <span className="text-lg font-bold text-primary-600">Scalp Analytics</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-gray-100 p-4">
        {user && (
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-gray-900">{user.full_name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
          Keluar
        </Button>
      </div>
    </aside>
  );
}
