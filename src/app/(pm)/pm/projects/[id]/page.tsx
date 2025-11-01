"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // Mock data - nanti diganti dengan fetch dari API
  const [project] = useState({
    id: params.id,
    name: "Renovasi Villa Bali",
    client: "PT. Bali Resort",
    description: "Renovasi lengkap villa dengan konsep modern tropical. Proyek ini mencakup pembaruan seluruh interior, eksterior, dan landscape area villa seluas 500m².",
    status: "On Track",
    progress: 75,
    deadline: "2025-03-15",
    startDate: "2024-12-01",
    budget: "Rp 500.000.000",
    spent: "Rp 375.000.000",
    team: 8,
    location: "Ubud, Bali",
    category: "Renovasi",
  })

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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/pm/projects" className="inline-flex items-center text-blue-600 hover:text-blue-700">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar Proyek
      </Link>

      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h1>
          <p className="text-lg text-slate-600">{project.client}</p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(project.status)}
          <Button variant="outline">Edit Proyek</Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Proyek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Overall Progress
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Proyek berjalan sesuai jadwal. Target penyelesaian pada{" "}
              {new Date(project.deadline).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Deadline</p>
                <h3 className="text-xl font-bold text-slate-900">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h3>
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Budget</p>
                <h3 className="text-xl font-bold text-slate-900">{project.budget}</h3>
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Tim</p>
                <h3 className="text-xl font-bold text-slate-900">{project.team} orang</h3>
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Lokasi</p>
                <h3 className="text-xl font-bold text-slate-900">{project.location}</h3>
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deskripsi Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{project.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Proyek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Tanggal Mulai</p>
              <p className="text-base font-medium text-slate-900">
                {new Date(project.startDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Kategori</p>
              <p className="text-base font-medium text-slate-900">{project.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Budget Terpakai</p>
              <p className="text-base font-medium text-slate-900">{project.spent}</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full bg-orange-500"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
