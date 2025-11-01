"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function PMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Only show DashboardLayout for non-auth pages
  const isAuthPage = pathname?.includes("/login") || 
                     pathname?.includes("/signup") || 
                     pathname?.includes("/forgot-password") || 
                     pathname?.includes("/reset-password");
  
  // Auth pages don't use DashboardLayout
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // All other PM pages use DashboardLayout (dashboard, projects, team, documents, etc.)
  return <DashboardLayout>{children}</DashboardLayout>;
}
