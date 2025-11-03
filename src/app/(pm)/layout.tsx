"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function PMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that don't use DashboardLayout
  const isAuthPage = pathname?.includes("/login") || 
                     pathname?.includes("/signup") || 
                     pathname?.includes("/forgot-password") || 
                     pathname?.includes("/reset-password");
  
  const isPMLanding = pathname === "/pm";
  
  // Auth pages and PM landing don't use DashboardLayout
  if (isAuthPage || isPMLanding) {
    return <>{children}</>;
  }
  
  // All other PM pages use DashboardLayout (dashboard, projects, team, documents, etc.)
  return <DashboardLayout>{children}</DashboardLayout>;
}
