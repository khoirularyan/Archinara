'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface UserProfile {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'MANAGER' | 'ARCHITECT' | 'USER'
  image: string | null
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Fetch profile data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/pm/login')
      return
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile()
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/profile')
      
      if (!res.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await res.json()
      setProfile(data.user)
      setName(data.user.name || '')
      setImageUrl(data.user.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File terlalu besar. Maksimal 5MB')
      return
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipe file tidak valid. Hanya JPEG, PNG, WebP, dan GIF yang diperbolehkan')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await res.json()
      setImageUrl(data.url)
      setSuccess('Foto berhasil diupload! Jangan lupa klik Simpan.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Nama tidak boleh kosong')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const data = await res.json()
      setProfile(data.user)
      setSuccess('Profil berhasil diperbarui!')

      // Update session NextAuth
      await update({
        name: data.user.name,
        image: data.user.image,
      })

      // Refresh profile data
      setTimeout(() => {
        fetchProfile()
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeVariant = (role: string) => {
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

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>
            Kelola informasi profil Anda. Email dan role tidak dapat diubah.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imageUrl || undefined} alt={name} />
                <AvatarFallback className="text-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col items-center space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Mengupload...' : 'Ganti Foto'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, atau GIF (max. 5MB)
                </p>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

            {/* Email Field (Readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah
              </p>
            </div>

            {/* Role Field (Readonly) */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="role"
                  type="text"
                  value={profile.role}
                  disabled
                  className="bg-muted cursor-not-allowed flex-1"
                />
                <Badge variant={getRoleBadgeVariant(profile.role)}>
                  {profile.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Role tidak dapat diubah
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/pm/dashboard')}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>

          {/* Profile Info */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-2">Informasi Akun</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Dibuat: {new Date(profile.createdAt).toLocaleDateString('id-ID')}</p>
              <p>Terakhir diupdate: {new Date(profile.updatedAt).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
