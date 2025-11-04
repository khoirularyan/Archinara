"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

type TeamMember = {
  id: string
  name: string | null
  email: string
  username: string | null
  role: "ADMIN" | "MANAGER" | "ARCHITECT" | "USER"
  image: string | null
  isTempPassword: boolean
  createdAt: string
  _count: {
    projects: number
  }
}

export default function TeamPage() {
  const { data: session } = useSession()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    role: "USER" as "ADMIN" | "MANAGER" | "ARCHITECT" | "USER",
    password: "",
    autoGeneratePassword: true,
  })

  // Fetch team members
  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      console.log('[Team Page] Fetching team members...')
      
      const response = await fetch("/api/pm/team")
      console.log('[Team Page] Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('[Team Page] Error response:', errorData)
        throw new Error(errorData.error || "Failed to fetch team members")
      }

      const data = await response.json()
      console.log('[Team Page] Received data:', data)
      setTeamMembers(data.users || [])
    } catch (error: any) {
      console.error("[Team Page] Error fetching team members:", error)
      toast.error(error.message || "Gagal memuat data tim")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setGeneratedPassword(null)

    try {
      const response = await fetch("/api/pm/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create team member")
      }

      // Show generated password if auto-generated
      if (data.generatedPassword) {
        setGeneratedPassword(data.generatedPassword)
        toast.success(
          `Anggota berhasil ditambahkan! Password: ${data.generatedPassword}`,
          { duration: 10000 }
        )
      } else {
        toast.success("Anggota tim berhasil ditambahkan!")
        setIsDialogOpen(false)
        resetForm()
      }

      // Refresh team members list
      fetchTeamMembers()
    } catch (error: any) {
      console.error("Error creating team member:", error)
      toast.error(error.message || "Gagal menambahkan anggota tim")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      username: "",
      role: "USER",
      password: "",
      autoGeneratePassword: true,
    })
    setGeneratedPassword(null)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; className: string }> = {
      ADMIN: { label: "Admin", className: "bg-red-100 text-red-700 hover:bg-red-100" },
      MANAGER: { label: "Manager", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
      ARCHITECT: { label: "Architect", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
      USER: { label: "User", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    }
    
    const roleInfo = roleMap[role] || { label: role, className: "" }
    return <Badge className={roleInfo.className}>{roleInfo.label}</Badge>
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
        <Button onClick={() => setIsDialogOpen(true)}>
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

      {/* Add Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Anggota Tim</DialogTitle>
            <DialogDescription>
              Tambahkan staf kantor baru. Password akan di-generate otomatis atau Anda bisa mengatur sendiri.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="budi@archinara.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (Opsional)</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="budisantoso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ARCHITECT">Architect</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoGenerate"
                  checked={formData.autoGeneratePassword}
                  onChange={(e) =>
                    setFormData({ ...formData, autoGeneratePassword: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="autoGenerate" className="cursor-pointer">
                  Generate password otomatis
                </Label>
              </div>

              {!formData.autoGeneratePassword && (
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  required={!formData.autoGeneratePassword}
                />
              )}
            </div>

            {generatedPassword && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-medium text-green-900 mb-1">
                  Password yang di-generate:
                </p>
                <p className="text-lg font-mono font-bold text-green-700">
                  {generatedPassword}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Simpan password ini dan berikan ke anggota baru. Mereka wajib mengganti password saat login pertama.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : generatedPassword ? "Tutup" : "Tambah Anggota"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                  {isLoading ? "..." : teamMembers.length}
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
                  Admin
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : teamMembers.filter(m => m.role === "ADMIN").length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
                  Manager
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : teamMembers.filter(m => m.role === "MANAGER").length}
                </h3>
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                  Architect
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : teamMembers.filter(m => m.role === "ARCHITECT").length}
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-slate-500">Memuat data tim...</div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-16 h-16 text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Belum ada anggota tim
          </h3>
          <p className="text-slate-500 mb-4">
            Mulai tambahkan anggota tim untuk mengelola proyek Anda
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Tambah Anggota Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.image || undefined} alt={member.name || "User"} />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                      {getInitials(member.name || "U")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {member.name || "No Name"}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(member.role)}
                        {member.isTempPassword && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Temp Password
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
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
                        <span className="truncate">{member.email}</span>
                      </div>
                      
                      {member.username && (
                        <div className="flex items-center text-sm text-slate-600">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="truncate">@{member.username}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-slate-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
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
                        {member._count.projects} Proyek
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-slate-500">
                        Bergabung {new Date(member.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
