import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role

    // Get projects count based on user role
    let projectsCount = 0
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      // Admin and Manager can see all projects
      projectsCount = await prisma.project.count()
    } else {
      // Other users can only see their projects
      projectsCount = await prisma.projectMember.count({
        where: { userId },
      })
    }

    // Get team members count (only for ADMIN and MANAGER)
    let teamCount = 0
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      teamCount = await prisma.user.count()
    }

    // Get tasks count for user
    const tasksCount = await prisma.task.count({
      where: {
        OR: [
          { assignedToId: userId },
          { createdById: userId },
        ],
      },
    })

    // Get active projects (IN_PROGRESS)
    let activeProjectsCount = 0
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      activeProjectsCount = await prisma.project.count({
        where: { status: 'IN_PROGRESS' },
      })
    } else {
      activeProjectsCount = await prisma.projectMember.count({
        where: {
          userId,
          project: {
            status: 'IN_PROGRESS',
          },
        },
      })
    }

    // Get pending tasks
    const pendingTasksCount = await prisma.task.count({
      where: {
        assignedToId: userId,
        status: {
          in: ['TODO', 'IN_PROGRESS'],
        },
      },
    })

    // Get completed tasks this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const completedTasksThisMonth = await prisma.task.count({
      where: {
        assignedToId: userId,
        status: 'COMPLETED',
        updatedAt: {
          gte: startOfMonth,
        },
      },
    })

    // Get recent projects
    let recentProjects = []
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      recentProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
      })
    } else {
      const userProjectIds = await prisma.projectMember.findMany({
        where: { userId },
        select: { projectId: true },
      })

      recentProjects = await prisma.project.findMany({
        where: {
          id: {
            in: userProjectIds.map((p) => p.projectId),
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
      })
    }

    return NextResponse.json(
      {
        stats: {
          projects: projectsCount,
          team: teamCount,
          tasks: tasksCount,
          activeProjects: activeProjectsCount,
          pendingTasks: pendingTasksCount,
          completedTasksThisMonth,
        },
        recentProjects,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API /api/dashboard/stats] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
