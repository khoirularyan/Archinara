import { PMHeader, PMFooter } from "@/components/layout";

export default function PMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PMHeader />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <PMFooter />
    </>
  );
}
