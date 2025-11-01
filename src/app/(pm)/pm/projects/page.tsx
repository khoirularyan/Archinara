"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddProjectDialog } from "@/components/pm/AddProjectDialog"
import { Input } from "@/components/ui/input"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects] = useState([
    {
      id: 1,
      name: "Renovasi Villa Bali",
      client: "PT. Bali Resort",
      progress: 75,
      status: "On Track",
      deadline: "2025-03-15",
      team: 8,
      budget: "Rp 500.000.000",
      description: "Renovasi lengkap villa dengan konsep modern tropical"
    },
    {
      id: 2,
      name: "Pembangunan Kantor Jakarta",
      client: "CV. Maju Jaya",
      progress: 45,
      status: "On Track",
      deadline: "2025-04-20",
      team: 12,
      budget: "Rp 1.200.000.000",
      description: "Pembangunan gedung kantor 5 lantai di Jakarta Selatan"
    },
    {
      id: 3,
      name: "Interior Rumah Bandung",
      client: "Ibu Siti",
      progress: 90,
      status: "Almost Done",
      deadline: "2025-02-10",
      team: 5,
      budget: "Rp 150.000.000",
      description: "Desain interior rumah minimalis modern"
    },
    {
      id: 4,
      name: "Landscape Taman Surabaya",
      client: "Pak Budi",
      progress: 30,
      status: "Delayed",
      deadline: "2025-05-01",
      team: 6,
      budget: "Rp 300.000.000",
      description: "Penataan landscape taman kota seluas 2 hektar"
    },
    {
      id: 5,
      name: "Renovasi Hotel Yogyakarta",
      client: "PT. Hospitality Indo",
      progress: 60,
      status: "On Track",
      deadline: "2025-06-15",
      team: 15,
      budget: "Rp 2.000.000.000",
      description: "Renovasi hotel bintang 4 dengan 50 kamar"
    },
    {
      id: 6,
      name: "Pembangunan Rumah Sakit",
      client: "Yayasan Sehat",
      progress: 25,
      status: "On Track",
      deadline: "2025-12-31",
      team: 20,
      budget: "Rp 5.000.000.000",
      description: "Pembangunan rumah sakit tipe C dengan fasilitas lengkap"
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Track":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            On Track
          </Badge>
        )
      case "Almost Done":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Almost Done
          </Badge>
        )
      case "Delayed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Delayed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-blue-600"
    if (progress >= 50) return "bg-blue-500"
    return "bg-blue-400"
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Daftar Proyek</h1>
          <p className="text-lg text-slate-600 mt-2">
            Kelola semua proyek yang sedang berjalan
          </p>
        </div>
        <AddProjectDialog />
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Cari proyek atau klien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/pm/projects/${project.id}`}>
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
              <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1">
                  {project.name}
                </CardTitle>
                {getStatusBadge(project.status)}
              </div>
              <p className="text-sm text-slate-500">{project.client}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Description */}
                <p className="text-sm text-slate-600 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        project.progress
                      )}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Deadline</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(project.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tim</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.team} orang
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Budget</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.budget}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Tidak ada proyek ditemukan
            </h3>
            <p className="text-slate-600 mb-4">
              Coba ubah kata kunci pencarian Anda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
