"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddProjectDialog } from "@/components/pm/AddProjectDialog"
import { Input } from "@/components/ui/input"

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  startDate: string
  endDate: string | null
  budget: number | null
  teamCount: number
  taskCount: number
  documentCount: number
  progress: number
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch projects from database
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/pm/login')
      return
    }

    if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status, router])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/projects')
      
      if (!res.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await res.json()
      setProjects(data.projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Gagal memuat data proyek')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLANNING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Planning
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            In Progress
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Cancelled
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
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data proyek...</p>
        </div>
      </div>
    )
  }

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
        <AddProjectDialog onProjectAdded={fetchProjects} />
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
              <p className="text-sm text-slate-500">
                {new Date(project.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
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
                      {project.endDate ? new Date(project.endDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tim</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.teamCount} orang
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Budget</p>
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(project.budget)}
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
