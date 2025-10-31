export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Add Work-specific header/sidebar */}
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}
