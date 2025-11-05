import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/projects/[id]/members
 * Menambahkan member ke project
 * Permission: ADMIN, MANAGER, atau OWNER dari project
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Cek authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    const userId = session.user.id

    // Await params (Next.js 15+)
    const { id: projectId } = await params

    // Parse body
    const body = await req.json()
    const { userId: memberUserId, role: memberRole } = body

    // Validasi input
    if (!memberUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validasi member role
    const validMemberRoles = ['OWNER', 'MANAGER', 'MEMBER']
    if (memberRole && !validMemberRoles.includes(memberRole)) {
      return NextResponse.json(
        { error: 'Invalid member role. Must be OWNER, MANAGER, or MEMBER' },
        { status: 400 }
      )
    }

    // Cek apakah project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Cek permission: ADMIN, MANAGER, atau OWNER dari project
    const isProjectOwner = project.members.some(m => m.userId === userId && m.role === 'OWNER')
    const canAddMember = userRole === 'ADMIN' || userRole === 'MANAGER' || isProjectOwner

    if (!canAddMember) {
      return NextResponse.json(
        { error: 'Forbidden - Only ADMIN, MANAGER, or project OWNER can add members' },
        { status: 403 }
      )
    }

    // Cek apakah user yang akan ditambahkan exists
    const userToAdd = await prisma.user.findUnique({
      where: { id: memberUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true
      }
    })

    if (!userToAdd) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Cek apakah user sudah jadi member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId
        }
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      )
    }

    // Tambahkan member ke project
    const newMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId: memberUserId,
        role: memberRole || 'MEMBER'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true
          }
        }
      }
    })

    // Buat notifikasi untuk user yang ditambahkan
    try {
      await (prisma as any).notification.create({
        data: {
            userId: memberUserId,
            title: 'Ditambahkan ke Project',
            message: `Anda telah ditambahkan sebagai ${memberRole || 'MEMBER'} di project "${project.name}"`,
            type: 'INFO',
            read: false
        }
      })
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json(
      {
        message: 'Member added successfully',
        member: newMember
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API /api/projects/[id]/members] Error adding member:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/projects/[id]/members
 * Ambil semua members dari project
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Cek authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Await params (Next.js 15+)
    const { id: projectId } = await params

    // Cek apakah project exists dan user punya akses
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId: session.user.id }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Cek apakah user adalah member atau ADMIN/MANAGER
    const userRole = session.user.role
    const isMember = project.members.length > 0
    const canView = userRole === 'ADMIN' || userRole === 'MANAGER' || isMember

    if (!canView) {
      return NextResponse.json(
        { error: 'You do not have access to this project' },
        { status: 403 }
      )
    }

    // Ambil semua members
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true
          }
        }
      },
      orderBy: {
        joinedAt: 'asc'
      }
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('[API /api/projects/[id]/members] Error fetching members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/projects/[id]/members
 * Hapus member dari project
 * Permission: ADMIN, MANAGER, atau OWNER dari project
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Cek authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    const userId = session.user.id

    // Await params (Next.js 15+)
    const { id: projectId } = await params

    // Parse body
    const body = await req.json()
    const { userId: memberUserId } = body

    // Validasi input
    if (!memberUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Cek apakah project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Cek permission: ADMIN, MANAGER, atau OWNER dari project
    const isProjectOwner = project.members.some(m => m.userId === userId && m.role === 'OWNER')
    const canRemoveMember = userRole === 'ADMIN' || userRole === 'MANAGER' || isProjectOwner

    if (!canRemoveMember) {
      return NextResponse.json(
        { error: 'Forbidden - Only ADMIN, MANAGER, or project OWNER can remove members' },
        { status: 403 }
      )
    }

    // Cek apakah member exists
    const memberToRemove = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId
        }
      }
    })

    if (!memberToRemove) {
      return NextResponse.json(
        { error: 'Member not found in this project' },
        { status: 404 }
      )
    }

    // Tidak bisa hapus OWNER terakhir
    if (memberToRemove.role === 'OWNER') {
      const ownerCount = await prisma.projectMember.count({
        where: {
          projectId,
          role: 'OWNER'
        }
      })

      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last OWNER from project' },
          { status: 400 }
        )
      }
    }

    // Hapus member
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId
        }
      }
    })

    return NextResponse.json({
      message: 'Member removed successfully'
    })
  } catch (error) {
    console.error('[API /api/projects/[id]/members] Error removing member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
