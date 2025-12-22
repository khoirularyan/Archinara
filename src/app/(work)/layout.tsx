import Link from 'next/link';

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Work Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-4">
            <Link
              href="/work"
              className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              Work
            </Link>
            <div className="flex gap-4">
              <Link
                href="/work/schedule"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Schedule
              </Link>
              <Link
                href="/work/tasks"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Tasks
              </Link>
              <Link
                href="/work/attendance"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Attendance
              </Link>
              <Link
                href="/work/report"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Report
              </Link>
              <Link
                href="/work/reviews"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Reviews
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-slate-50">
        {children}
      </main>
    </>
  );
}
