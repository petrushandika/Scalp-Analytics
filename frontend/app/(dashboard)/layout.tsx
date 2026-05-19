import type { Metadata } from "next";

import { DashboardNav } from "@/components/layout/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
