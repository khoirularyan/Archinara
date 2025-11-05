import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/pm/dashboard - Aggregated dashboard data endpoint
 * 
 * Optimizations:
 * - Single endpoint with Promise.all for parallel queries
 * - Specific column selection (no SELECT *)
 * - Indexed queries with LIMIT
 * - Server-side caching with revalidation
 */

// Force dynamic rendering (required for getServerSession)
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role

    // Parallel execution of all queries
    const [
      projectsCount,
      teamCount,
      tasksCount,
      activeProjectsCount,
      pendingTasksCount,
      completedTasksThisMonth,
      recentProjects,
      notifications,
    ] = await Promise.all([
      // 1. Projects count (USER cannot see projects)
      userRole === 'USER'
        ? Promise.resolve(0)
        : userRole === 'ADMIN' || userRole === 'MANAGER'
        ? prisma.project.count()
        : prisma.projectMember.count({ where: { userId } }),

      // 2. Team count (USER cannot see team, DRAFTER/ARCHITECT can see)
      userRole === 'USER'
        ? Promise.resolve(0)
        : userRole === 'ADMIN' || userRole === 'MANAGER'
        ? prisma.user.count()
        : prisma.user.count(),

      // 3. Tasks count
      prisma.task.count({
        where: {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
          ],
        },
      }),

      // 4. Active projects count (USER cannot see projects)
      userRole === 'USER'
        ? Promise.resolve(0)
        : userRole === 'ADMIN' || userRole === 'MANAGER'
        ? prisma.project.count({ where: { status: 'IN_PROGRESS' } })
        : prisma.projectMember.count({
            where: {
              userId,
              project: { status: 'IN_PROGRESS' },
            },
          }),

      // 5. Pending tasks count
      prisma.task.count({
        where: {
          assignedToId: userId,
          status: { in: ['TODO', 'IN_PROGRESS'] },
        },
      }),

      // 6. Completed tasks this month
      prisma.task.count({
        where: {
          assignedToId: userId,
          status: 'COMPLETED',
          updatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // 7. Recent projects (USER cannot see projects)
      userRole === 'USER'
        ? Promise.resolve([])
        : userRole === 'ADMIN' || userRole === 'MANAGER'
        ? prisma.project.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              description: true,
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
        : prisma.projectMember
            .findMany({
              where: { userId },
              select: { projectId: true },
              take: 100, // Reasonable limit
            })
            .then((members) =>
              prisma.project.findMany({
                where: {
                  id: { in: members.map((m) => m.projectId) },
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                  id: true,
                  name: true,
                  description: true,
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
            ),

      // 8. Recent notifications (top 15)
      (prisma as any).notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          read: true,
          createdAt: true,
        },
      }).catch(() => []),
    ])

    const response = {
      stats: {
        projects: projectsCount,
        team: teamCount,
        tasks: tasksCount,
        activeProjects: activeProjectsCount,
        pendingTasks: pendingTasksCount,
        completedTasksThisMonth,
      },
      recentProjects,
      notifications,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[API /api/pm/dashboard] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Enable Edge Runtime for faster cold starts (optional)
// export const runtime = 'edge'

// Revalidate every 60 seconds
export const revalidate = 60
