"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TeamPage() {
  const [teamMembers] = useState([
    {
      id: 1,
      name: "Budi Santoso",
      role: "Project Manager",
      email: "budi@archinara.com",
      phone: "+62 812-3456-7890",
      status: "active",
      currentProject: "Renovasi Villa Bali",
      tasksCompleted: 45,
      tasksInProgress: 5,
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Lead Architect",
      email: "siti@archinara.com",
      phone: "+62 813-4567-8901",
      status: "active",
      currentProject: "Pembangunan Kantor Jakarta",
      tasksCompleted: 38,
      tasksInProgress: 4,
    },
    {
      id: 3,
      name: "Ahmad Yani",
      role: "Procurement Specialist",
      email: "ahmad@archinara.com",
      phone: "+62 814-5678-9012",
      status: "active",
      currentProject: "Interior Rumah Bandung",
      tasksCompleted: 32,
      tasksInProgress: 3,
    },
    {
      id: 4,
      name: "Eko Prasetyo",
      role: "Construction Manager",
      email: "eko@archinara.com",
      phone: "+62 815-6789-0123",
      status: "active",
      currentProject: "Renovasi Villa Bali",
      tasksCompleted: 28,
      tasksInProgress: 6,
    },
    {
      id: 5,
      name: "Rudi Hartono",
      role: "Electrical Engineer",
      email: "rudi@archinara.com",
      phone: "+62 816-7890-1234",
      status: "active",
      currentProject: "Pembangunan Kantor Jakarta",
      tasksCompleted: 25,
      tasksInProgress: 2,
    },
    {
      id: 6,
      name: "Dewi Lestari",
      role: "Interior Designer",
      email: "dewi@archinara.com",
      phone: "+62 817-8901-2345",
      status: "active",
      currentProject: "Interior Rumah Bandung",
      tasksCompleted: 22,
      tasksInProgress: 3,
    },
    {
      id: 7,
      name: "Andi Wijaya",
      role: "Site Supervisor",
      email: "andi@archinara.com",
      phone: "+62 818-9012-3456",
      status: "active",
      currentProject: "Landscape Taman Surabaya",
      tasksCompleted: 30,
      tasksInProgress: 4,
    },
    {
      id: 8,
      name: "Maya Sari",
      role: "Architect",
      email: "maya@archinara.com",
      phone: "+62 819-0123-4567",
      status: "active",
      currentProject: "Renovasi Hotel Yogyakarta",
      tasksCompleted: 20,
      tasksInProgress: 5,
    },
  ])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = (role: string) => {
    if (role.includes("Manager")) {
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">{role}</Badge>
    }
    if (role.includes("Lead") || role.includes("Architect")) {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{role}</Badge>
    }
    return <Badge variant="outline">{role}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Tim & Pekerja</h1>
          <p className="text-lg text-slate-600 mt-2">
            Kelola semua anggota tim dan pekerja
          </p>
        </div>
        <Button>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Anggota
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Total Anggota
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {teamMembers.length}
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
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Tasks Selesai
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </h3>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Tasks Berjalan
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {teamMembers.reduce((sum, m) => sum + m.tasksInProgress, 0)}
                </h3>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
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
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Proyek Aktif
                </p>
                <h3 className="text-3xl font-bold text-slate-900">6</h3>
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} alt={member.name} />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {member.name}
                    </h3>
                    {getRoleBadge(member.role)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {member.phone}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {member.currentProject}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tasks Selesai</p>
                      <p className="text-lg font-bold text-green-600">
                        {member.tasksCompleted}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tasks Berjalan</p>
                      <p className="text-lg font-bold text-blue-600">
                        {member.tasksInProgress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
