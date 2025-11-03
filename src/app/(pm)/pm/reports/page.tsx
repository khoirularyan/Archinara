export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Laporan</h1>
        <p className="text-lg text-slate-600 mt-2">
          Lihat laporan dan analisis proyek
        </p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto text-slate-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Fitur Laporan Segera Hadir
        </h3>
        <p className="text-slate-600">
          Halaman ini sedang dalam pengembangan
        </p>
      </div>
    </div>
  )
}
