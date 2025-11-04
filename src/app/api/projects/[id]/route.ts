import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/projects/[id]
 * Ambil detail project by ID
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

    // Ambil project dari database
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
              }
            }
          }
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        documents: {
          orderBy: {
            uploadedAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Cek apakah user adalah member dari project ini
    const isMember = project.members.some(
      member => member.userId === session.user.id
    )

    if (!isMember) {
      return NextResponse.json(
        { error: 'You do not have access to this project' },
        { status: 403 }
      )
    }

    // Hitung progress dari tasks
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED').length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Transform data untuk frontend
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      members: project.members.map(m => ({
        id: m.id,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.user
      })),
      tasks: project.tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo,
        createdBy: t.createdBy,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      })),
      documents: project.documents,
      progress,
      teamCount: project.members.length,
      taskCount: totalTasks,
      completedTaskCount: completedTasks,
      documentCount: project.documents.length
    }

    return NextResponse.json({ project: transformedProject })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
