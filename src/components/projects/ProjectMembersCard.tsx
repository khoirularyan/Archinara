"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserPlus, Trash2, Crown, Shield, User as UserIcon } from "lucide-react"
import { AddMemberModal } from "./AddMemberModal"

interface ProjectMember {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
    image?: string | null
  }
}

interface ProjectMembersCardProps {
  projectId: string
  members: ProjectMember[]
  onMembersUpdate: () => void
  userRole?: string | undefined
  currentUserId?: string | undefined
}

export function ProjectMembersCard({
  projectId,
  members,
  onMembersUpdate,
  userRole,
  currentUserId,
}: ProjectMembersCardProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(null)
  const [removing, setRemoving] = useState(false)

  // Check if current user can manage members
  const canManageMembers = () => {
    if (userRole === "ADMIN" || userRole === "MANAGER") return true
    
    // Check if user is project OWNER
    const currentUserMember = members.find(m => m.user.id === currentUserId)
    return currentUserMember?.role === "OWNER"
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return

    try {
      setRemoving(true)

      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: memberToRemove.user.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove member")
      }

      toast.success("Member berhasil dihapus")
      onMembersUpdate()
      setMemberToRemove(null)
    } catch (error: any) {
      console.error("Error removing member:", error)
      toast.error(error.message || "Gagal menghapus member")
    } finally {
      setRemoving(false)
    }
  }

  const getMemberRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "MANAGER":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <UserIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const getMemberRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      OWNER: "bg-yellow-100 text-yellow-700 border-yellow-200",
      MANAGER: "bg-blue-100 text-blue-700 border-blue-200",
      MEMBER: "bg-gray-100 text-gray-700 border-gray-200",
    }

    return (
      <Badge
        variant="outline"
        className={`${roleColors[role] || "bg-gray-100 text-gray-700"} flex items-center gap-1`}
      >
        {getMemberRoleIcon(role)}
        {role}
      </Badge>
    )
  }

  const getUserRoleBadge = (role: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            Team Members ({members.length})
          </CardTitle>
          {canManageMembers() && (
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Tambah Member
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Belum ada member
                </p>
                <p className="text-sm text-gray-500">
                  Tambahkan member untuk mulai berkolaborasi
                </p>
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {getInitials(member.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{member.user.name}</p>
                        {getUserRoleBadge(member.user.role)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {member.user.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Bergabung {formatDate(member.joinedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getMemberRoleBadge(member.role)}
                    {canManageMembers() && member.user.id !== currentUserId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMemberToRemove(member)}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <AddMemberModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        projectId={projectId}
        onMemberAdded={onMembersUpdate}
        existingMemberIds={members.map((m) => m.user.id)}
      />

      {/* Remove Member Confirmation */}
      <Dialog
        open={!!memberToRemove}
        onOpenChange={(open: boolean) => !open && setMemberToRemove(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Member?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold">{memberToRemove?.user.name}</span>{" "}
              dari project ini? Member tidak akan bisa mengakses project lagi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMemberToRemove(null)}
              disabled={removing}
            >
              Batal
            </Button>
            <Button
              onClick={handleRemoveMember}
              disabled={removing}
              className="bg-red-600 hover:bg-red-700"
            >
              {removing ? "Menghapus..." : "Hapus Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
