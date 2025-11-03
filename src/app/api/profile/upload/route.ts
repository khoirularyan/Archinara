import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToSupabase } from '@/lib/supabase'

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN ?? 'dev-token'

/**
 * POST /api/profile/upload
 * Upload foto profil user ke Supabase Storage
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Cek Bearer token dulu
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null
    const hasValidBearer = bearerToken === DASHBOARD_TOKEN

    // 2. Kalau tidak ada bearer, cek session
    if (!hasValidBearer) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // 3. Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' },
        { status: 400 }
      )
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Upload ke Supabase Storage
    const url = await uploadToSupabase(file, 'avatars', 'profiles')

    return NextResponse.json({
      message: 'File uploaded successfully to Supabase',
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
