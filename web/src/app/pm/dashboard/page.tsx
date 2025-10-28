"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  // Dummy data
  const stats = [
    { label: "Total Proyek", value: "12", change: "+2", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "blue" },
    { label: "Proyek Aktif", value: "8", change: "+1", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "green" },
    { label: "Total Tim", value: "45", change: "+5", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "purple" },
    { label: "Budget Terpakai", value: "Rp 2.5M", change: "75%", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "orange" },
  ];

  const recentProjects = [
    { id: 1, name: "Renovasi Villa Bali", client: "PT. Bali Resort", progress: 75, status: "On Track", deadline: "2025-03-15", team: 8 },
    { id: 2, name: "Pembangunan Kantor Jakarta", client: "CV. Maju Jaya", progress: 45, status: "On Track", deadline: "2025-04-20", team: 12 },
    { id: 3, name: "Interior Rumah Bandung", client: "Ibu Siti", progress: 90, status: "Almost Done", deadline: "2025-02-10", team: 5 },
    { id: 4, name: "Landscape Taman Surabaya", client: "Pak Budi", progress: 30, status: "Delayed", deadline: "2025-05-01", team: 6 },
  ];

  const upcomingTasks = [
    { id: 1, title: "Review Desain Arsitek", project: "Renovasi Villa Bali", assignee: "Ahmad", priority: "High", due: "Hari ini" },
    { id: 2, title: "Meeting dengan Klien", project: "Kantor Jakarta", assignee: "Siti", priority: "Medium", due: "Besok" },
    { id: 3, title: "Inspeksi Lapangan", project: "Interior Bandung", assignee: "Budi", priority: "High", due: "2 hari lagi" },
    { id: 4, title: "Update Progress Report", project: "Landscape Surabaya", assignee: "Rina", priority: "Low", due: "3 hari lagi" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-700";
      case "Almost Done": return "bg-blue-100 text-blue-700";
      case "Delayed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Low": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang kembali, Ahmad! Berikut ringkasan proyek Anda.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">{stat.change} bulan ini</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <svg className={`w-6 h-6 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Proyek Terbaru</h2>
              <p className="text-sm text-gray-600 mt-1">Pantau progres proyek yang sedang berjalan</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat Semua →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Proyek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klien</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{project.client}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{project.deadline}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-sm text-gray-700">{project.team} orang</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Tugas Mendatang</h2>
            <p className="text-sm text-gray-600 mt-1">Prioritaskan pekerjaan Anda hari ini</p>
          </div>
          <div className="p-6 space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {task.project} • Ditugaskan ke: {task.assignee}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {task.due}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
