export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Jadwal</h1>
        <p className="text-lg text-slate-600 mt-2">
          Kelola jadwal dan timeline proyek
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Fitur Jadwal Segera Hadir
        </h3>
        <p className="text-slate-600">
          Halaman ini sedang dalam pengembangan
        </p>
      </div>
    </div>
  )
}
