"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";

type Schedule = {
  id: number;
  title: string;
  project: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  assignee: string;
  location: string;
};

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Dummy data
  const schedules: Schedule[] = [
    { id: 1, title: "Kick-off Meeting Villa Bali", project: "Renovasi Villa Bali", date: "2025-02-01", time: "09:00", duration: "2 jam", type: "meeting", assignee: "Ahmad, Siti", location: "Zoom" },
    { id: 2, title: "Pengecoran Lantai 1", project: "Kantor Jakarta", date: "2025-02-01", time: "07:00", duration: "8 jam", type: "construction", assignee: "Budi, Joko", location: "Site Jakarta" },
    { id: 3, title: "Inspeksi Material", project: "Interior Bandung", date: "2025-02-02", time: "10:00", duration: "3 jam", type: "inspection", assignee: "Rina", location: "Gudang Bandung" },
    { id: 4, title: "Review Desain dengan Klien", project: "Landscape Surabaya", date: "2025-02-02", time: "14:00", duration: "1.5 jam", type: "meeting", assignee: "Ahmad", location: "Office" },
    { id: 5, title: "Pemasangan Keramik", project: "Interior Bandung", date: "2025-02-03", time: "08:00", duration: "6 jam", type: "construction", assignee: "Joko, Dewi", location: "Site Bandung" },
    { id: 6, title: "Pengecatan Dinding", project: "Renovasi Villa Bali", date: "2025-02-03", time: "07:00", duration: "8 jam", type: "construction", assignee: "Dewi, Agus", location: "Site Bali" },
    { id: 7, title: "Progress Report Meeting", project: "Kantor Jakarta", date: "2025-02-04", time: "15:00", duration: "1 jam", type: "meeting", assignee: "Siti, Linda", location: "Office" },
    { id: 8, title: "Instalasi Listrik", project: "Kantor Jakarta", date: "2025-02-05", time: "08:00", duration: "7 jam", type: "construction", assignee: "Budi, Joko", location: "Site Jakarta" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-700 border-blue-200";
      case "construction": return "bg-orange-100 text-orange-700 border-orange-200";
      case "inspection": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z";
      case "construction": return "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z";
      case "inspection": return "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4";
      default: return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  };

  // Group schedules by date
  const groupedSchedules = schedules.reduce<Record<string, Schedule[]>>((acc, schedule) => {
    // Safe array initialization using ??= pattern
    const dateKey = schedule.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey]!.push(schedule);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jadwal & Timeline</h1>
            <p className="text-gray-600 mt-1">Kelola jadwal proyek dan aktivitas tim</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "week" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Minggu
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "month" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Bulan
              </button>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Jadwal
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{schedules.filter(s => s.type === "meeting").length}</p>
                <p className="text-sm text-gray-600">Meeting</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{schedules.filter(s => s.type === "construction").length}</p>
                <p className="text-sm text-gray-600">Konstruksi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{schedules.filter(s => s.type === "inspection").length}</p>
                <p className="text-sm text-gray-600">Inspeksi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                <p className="text-sm text-gray-600">Total Jadwal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Timeline Minggu Ini</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">1 - 7 Februari 2025</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Date(date).getDate()}
                    </div>
                    <div className="text-xs text-gray-600 uppercase">
                      {new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="text-sm text-gray-600">{daySchedules.length} aktivitas</div>
                </div>

                <div className="ml-20 space-y-3">
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`border-l-4 rounded-lg p-4 hover:shadow-md transition-shadow ${getTypeColor(schedule.type)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getTypeIcon(schedule.type)} />
                            </svg>
                            <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              {schedule.project}
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {schedule.time} ({schedule.duration})
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {schedule.assignee}
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {schedule.location}
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
