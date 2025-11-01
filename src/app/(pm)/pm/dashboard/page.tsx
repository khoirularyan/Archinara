"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddProjectDialog } from "@/components/pm/AddProjectDialog";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    totalTeam: 45,
    budget: "Rp 2.5M",
  });

  const [projects] = useState([
    {
      id: 1,
      name: "Renovasi Villa Bali",
      client: "PT. Bali Resort",
      progress: 75,
      status: "On Track",
      deadline: "2025-03-15",
      team: 8,
    },
    {
      id: 2,
      name: "Pembangunan Kantor Jakarta",
      client: "CV. Maju Jaya",
      progress: 45,
      status: "On Track",
      deadline: "2025-04-20",
      team: 12,
    },
    {
      id: 3,
      name: "Interior Rumah Bandung",
      client: "Ibu Siti",
      progress: 90,
      status: "Almost Done",
      deadline: "2025-02-10",
      team: 5,
    },
    {
      id: 4,
      name: "Landscape Taman Surabaya",
      client: "Pak Budi",
      progress: 30,
      status: "Delayed",
      deadline: "2025-05-01",
      team: 6,
    },
  ]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/pm/login?callbackUrl=/pm/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Track":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            On Track
          </Badge>
        );
      case "Almost Done":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Almost Done
          </Badge>
        );
      case "Delayed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Delayed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-blue-600";
    if (progress >= 50) return "bg-blue-500";
    return "bg-blue-400";
  };

  return (
    <div>
      <div>
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-lg text-slate-600 mt-2">
              Selamat datang kembali, {session?.user?.name}! Berikut ringkasan
              proyek Anda.
            </p>
          </div>
          <AddProjectDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Proyek */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Total Proyek
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.totalProjects}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">+2 bulan ini</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proyek Aktif */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Proyek Aktif
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.activeProjects}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">+1 bulan ini</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Tim */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Total Tim
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.totalTeam}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">+6 bulan ini</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Terpakai */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Budget Terpakai
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.budget}
                  </h3>
                  <p className="text-sm text-orange-600 mt-1">75% bulan ini</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proyek Terbaru Table */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-white py-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Proyek Terbaru
                </CardTitle>
                <p className="text-base text-gray-500 mt-1">
                  Pantau progress proyek yang sedang berjalan
                </p>
              </div>
              <Link
                href="/pm/projects"
                className="text-base text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                Lihat Semua
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Nama Proyek
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Klien
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Tim
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-base font-medium text-slate-900">
                          {project.name}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-base text-slate-600">
                          {project.client}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-200 rounded-full h-3 max-w-[120px]">
                            <div
                              className={`h-3 rounded-full ${getProgressColor(
                                project.progress
                              )}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-base font-medium text-slate-700">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-base text-slate-600">
                          {project.deadline}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center text-base text-slate-600">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {project.team} orang
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
