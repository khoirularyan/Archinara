export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Budget</h1>
        <p className="text-lg text-slate-600 mt-2">
          Kelola budget dan keuangan proyek
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Fitur Budget Segera Hadir
        </h3>
        <p className="text-slate-600">
          Halaman ini sedang dalam pengembangan
        </p>
      </div>
    </div>
  )
}
