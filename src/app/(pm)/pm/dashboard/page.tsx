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

  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    tasks: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasksThisMonth: 0,
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardStats();
    }
  }, [status]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      
      const data = await response.json();
      setStats(data.stats);
      setProjects(data.recentProjects || []);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/pm/login?callbackUrl=/pm/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLANNING":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Planning
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
                    {stats.projects}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Total proyek</p>
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
                  <p className="text-sm text-gray-500 mt-1">Sedang berjalan</p>
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
                    {stats.team || "-"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Anggota tim</p>
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

          {/* Tasks */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Total Tasks
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.tasks}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{stats.pendingTasks} pending</p>
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
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
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Tim
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Dibuat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center">
                        <div className="text-gray-500">
                          <svg
                            className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
                          <p className="text-base font-medium">Belum ada proyek</p>
                          <p className="text-sm mt-1">Mulai dengan membuat proyek baru</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div>
                            <div className="text-base font-medium text-slate-900">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          {getStatusBadge(project.status)}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-slate-600">
                            {project._count?.tasks || 0} tasks
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
                            {project._count?.members || 0} orang
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-slate-600">
                            {new Date(project.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
