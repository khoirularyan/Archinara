import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN ?? 'dev-token'

/**
 * GET /api/profile
 * Ambil data profil user yang sedang login
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Cek Bearer token dulu
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null
    const hasValidBearer = bearerToken === DASHBOARD_TOKEN

    // 2. Kalau tidak ada bearer, cek session
    let userId: string | undefined

    if (hasValidBearer) {
      // Kalau pakai bearer token, ambil userId dari query atau body
      // Untuk GET, bisa dari query param
      const url = new URL(req.url)
      userId = url.searchParams.get('userId') || undefined
      
      if (!userId) {
        return NextResponse.json(
          { error: 'userId required when using bearer token' },
          { status: 400 }
        )
      }
    } else {
      // Pakai session
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      userId = session.user.id
    }

    // 3. Ambil data user dari database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/profile
 * Update profil user (name, image)
 * Email dan role TIDAK boleh diubah dari sini
 */
export async function PATCH(req: NextRequest) {
  try {
    // 1. Cek Bearer token dulu
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null
    const hasValidBearer = bearerToken === DASHBOARD_TOKEN

    // 2. Kalau tidak ada bearer, cek session
    let userId: string | undefined

    if (hasValidBearer) {
      // Kalau pakai bearer token, userId harus dari body
      const body = await req.json()
      userId = body.userId
      
      if (!userId) {
        return NextResponse.json(
          { error: 'userId required when using bearer token' },
          { status: 400 }
        )
      }
    } else {
      // Pakai session
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      userId = session.user.id
    }

    // 3. Parse body
    const body = await req.json()
    const { name, image } = body

    // Validasi: minimal salah satu field harus ada
    if (!name && !image && image !== null) {
      return NextResponse.json(
        { error: 'At least one field (name or image) is required' },
        { status: 400 }
      )
    }

    // 4. Update user di database
    const updateData: { name?: string; image?: string | null } = {}
    if (name !== undefined) updateData.name = name
    if (image !== undefined) updateData.image = image

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
