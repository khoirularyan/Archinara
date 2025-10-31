import Sidebar from "@/components/pm/Sidebar";

export default function PMLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen ml-64">{children}</main>
    </>
  );
}
