"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, UserPlus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
}

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  onMemberAdded: () => void
  existingMemberIds?: string[]
}

export function AddMemberModal({
  open,
  onOpenChange,
  projectId,
  onMemberAdded,
  existingMemberIds = [],
}: AddMemberModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [memberRole, setMemberRole] = useState<string>("MEMBER")
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch available users
  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  // Filter users based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true)
      const res = await fetch("/api/pm/team")

      if (!res.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await res.json()
      // Filter out users yang sudah jadi member
      const availableUsers = data.users.filter(
        (user: User) => !existingMemberIds.includes(user.id)
      )
      setUsers(availableUsers)
      setFilteredUsers(availableUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Gagal memuat daftar user")
    } finally {
      setFetchingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUserId) {
      toast.error("Pilih user terlebih dahulu")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserId,
          role: memberRole,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add member")
      }

      toast.success("Member berhasil ditambahkan")
      onMemberAdded()
      onOpenChange(false)
      
      // Reset form
      setSelectedUserId("")
      setMemberRole("MEMBER")
      setSearchQuery("")
    } catch (error: any) {
      console.error("Error adding member:", error)
      toast.error(error.message || "Gagal menambahkan member")
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-700",
      MANAGER: "bg-indigo-100 text-indigo-700",
      ARCHITECT: "bg-blue-100 text-blue-700",
      DRAFTER: "bg-green-100 text-green-700",
      USER: "bg-gray-100 text-gray-700",
    }

    return (
      <Badge className={`${roleColors[role] || "bg-gray-100 text-gray-700"} text-xs`}>
        {role}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Tambah Member ke Project
          </DialogTitle>
          <DialogDescription>
            Pilih user yang akan ditambahkan sebagai member project ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Search User */}
            <div className="space-y-2">
              <Label htmlFor="search">Cari User</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  disabled={fetchingUsers}
                />
              </div>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user">Pilih User *</Label>
              {fetchingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-gray-500">
                    {searchQuery
                      ? "Tidak ada user yang sesuai dengan pencarian"
                      : "Semua user sudah menjadi member"}
                  </p>
                </div>
              ) : (
                <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-lg border p-2">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelectedUserId(user.id)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50 ${
                        selectedUserId === user.id
                          ? "bg-blue-50 ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {getRoleBadge(user.role)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Member Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Role dalam Project *</Label>
              <Select value={memberRole} onValueChange={setMemberRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Member</span>
                      <span className="text-xs text-gray-500">
                        Bisa view dan mengerjakan tasks
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MANAGER">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Manager</span>
                      <span className="text-xs text-gray-500">
                        Bisa manage tasks dan assignments
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="OWNER">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Owner</span>
                      <span className="text-xs text-gray-500">
                        Full control atas project
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading || !selectedUserId}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menambahkan...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Member
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
