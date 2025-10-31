'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ProfileSummaryCard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session?.user) {
    return null
  }

  const { user } = session

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'MANAGER':
        return 'default'
      case 'ARCHITECT':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator'
      case 'MANAGER':
        return 'Manager'
      case 'ARCHITECT':
        return 'Architect'
      case 'USER':
        return 'User'
      default:
        return 'Unknown'
    }
  }

  // Format last login (dummy untuk sekarang, bisa diganti dengan data real)
  const lastLogin = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Saya</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Avatar & Name */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {user.name || 'Nama belum diatur'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role:</span>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          {/* Last Login */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Login:</span>
            <span className="text-sm font-medium">{lastLogin}</span>
          </div>

          {/* Edit Profile Button */}
          <Link href="/pm/profile" className="block">
            <Button variant="outline" className="w-full">
              Edit Profil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
