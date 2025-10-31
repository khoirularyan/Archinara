"use client";

import { PMHeader, PMFooter } from "../../components/layout";
import { usePathname } from "next/navigation";

export default function PMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show header/footer on auth pages (login, signup, etc.) or dashboard
  const isAuthPage = pathname?.includes("/login") || 
                     pathname?.includes("/signup") || 
                     pathname?.includes("/forgot-password") || 
                     pathname?.includes("/reset-password");
  const isDashboardPage = pathname?.includes("/dashboard");
  
  const showHeaderFooter = !isAuthPage && !isDashboardPage;
  
  return (
    <>
      {showHeaderFooter && <PMHeader />}
      <main className={showHeaderFooter ? "pt-20" : ""}>{children}</main>
      {showHeaderFooter && <PMFooter />}
    </>
  );
}
