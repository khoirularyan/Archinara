import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import ClientToaster from "@/components/ClientToaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Archinara - Modern Architecture Studio",
  description: "Studio arsitektur modern yang menghadirkan solusi desain inovatif untuk ruang hidup Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-800 antialiased`}>
        {children}
        <ClientToaster />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0WPHCPY05P"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0WPHCPY05P');
          `}
        </Script>
      </body>
    </html>
  );
}
