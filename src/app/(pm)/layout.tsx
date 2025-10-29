import { PMHeader, PMFooter } from "@/components/layout";

export default function PMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PMHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <PMFooter />
    </>
  );
}
