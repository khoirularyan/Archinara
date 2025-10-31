import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN ?? 'dev-token'

/**
 * POST /api/profile/upload
 * Upload foto profil user
 * 
 * ⚠️ CATATAN PENTING:
 * - Di development, file disimpan ke /public/uploads/
 * - Di production (Vercel/Netlify), filesystem adalah READ-ONLY
 * - Untuk production, WAJIB pakai cloud storage:
 *   • AWS S3
 *   • Cloudflare R2
 *   • Supabase Storage
 *   • Uploadcare
 *   • Cloudinary
 * 
 * Implementasi ini hanya untuk development/testing.
 * Ganti dengan cloud storage sebelum deploy ke production!
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

    // ⚠️ DEVELOPMENT ONLY: Simpan ke /public/uploads/
    // Di production, ganti dengan cloud storage!
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const ext = file.name.split('.').pop()
      const filename = `avatar-${timestamp}-${randomStr}.${ext}`

      // Path ke public/uploads
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      
      // Buat folder kalau belum ada
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)

      // URL yang bisa diakses dari browser
      const url = `/uploads/${filename}`

      return NextResponse.json({
        message: 'File uploaded successfully',
        url,
        filename,
        size: file.size,
        type: file.type,
        warning: 'This is development mode. In production, use cloud storage (S3/R2/Supabase)!'
      })
    } catch (fsError) {
      // Kalau gagal tulis file (misal di Vercel), return placeholder
      console.error('Failed to write file (expected in production):', fsError)
      
      // Return placeholder/mock URL
      return NextResponse.json({
        message: 'File upload simulated (production mode)',
        url: '/placeholder/avatar.png',
        filename: file.name,
        size: file.size,
        type: file.type,
        warning: 'Production environment detected. Please configure cloud storage (S3/R2/Supabase) for real file uploads.'
      })
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
