import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get total counts
        const [totalUsers, totalProjects, totalTasks, totalComments] = await Promise.all([
            prisma.user.count(),
            prisma.project.count(),
            prisma.task.count(),
            prisma.comment.count()
        ]);

        // Get most active user (by tasks created)
        const mostActiveCreator = await prisma.user.findFirst({
            include: {
                _count: {
                    select: { tasksCreated: true }
                }
            },
            orderBy: {
                tasksCreated: {
                    _count: 'desc'
                }
            }
        });

        // Get most assigned user
        const mostAssignedUser = await prisma.user.findFirst({
            include: {
                _count: {
                    select: { tasksAssigned: true }
                }
            },
            orderBy: {
                tasksAssigned: {
                    _count: 'desc'
                }
            }
        });

        // Get task status distribution
        const tasksByStatus = await prisma.task.groupBy({
            by: ['status'],
            _count: true
        });

        // Get task priority distribution
        const tasksByPriority = await prisma.task.groupBy({
            by: ['priority'],
            _count: true
        });

        // Get most popular project (by member count)
        const mostPopularProject = await prisma.project.findFirst({
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: {
                members: {
                    _count: 'desc'
                }
            }
        });

        // Get busiest project (by task count)
        const busiestProject = await prisma.project.findFirst({
            include: {
                _count: {
                    select: { tasks: true }
                }
            },
            orderBy: {
                tasks: {
                    _count: 'desc'
                }
            }
        });

        // Calculate completion rate
        const completedTasks = tasksByStatus.find(s => s.status === 'COMPLETED')?._count || 0;
        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

        // Get most commented task
        const mostCommentedTask = await prisma.task.findFirst({
            include: {
                _count: {
                    select: { comments: true }
                },
                project: {
                    select: { name: true }
                }
            },
            orderBy: {
                comments: {
                    _count: 'desc'
                }
            }
        });

        // Fun stats array
        const stats = [
            {
                label: "Total Users",
                value: totalUsers,
                icon: "👥",
                color: "blue"
            },
            {
                label: "Total Projects",
                value: totalProjects,
                icon: "📁",
                color: "green"
            },
            {
                label: "Total Tasks",
                value: totalTasks,
                icon: "✅",
                color: "purple"
            },
            {
                label: "Total Comments",
                value: totalComments,
                icon: "💬",
                color: "orange"
            },
            {
                label: "Task Completion Rate",
                value: `${completionRate}%`,
                icon: "🎯",
                color: "cyan"
            },
            {
                label: "Most Active Creator",
                value: mostActiveCreator?.name || "N/A",
                subValue: `${mostActiveCreator?._count.tasksCreated || 0} tasks`,
                icon: "🏆",
                color: "yellow"
            },
            {
                label: "Most Assigned User",
                value: mostAssignedUser?.name || "N/A",
                subValue: `${mostAssignedUser?._count.tasksAssigned || 0} tasks`,
                icon: "🎖️",
                color: "red"
            },
            {
                label: "Most Popular Project",
                value: mostPopularProject?.name || "N/A",
                subValue: `${mostPopularProject?._count.members || 0} members`,
                icon: "⭐",
                color: "pink"
            },
            {
                label: "Busiest Project",
                value: busiestProject?.name || "N/A",
                subValue: `${busiestProject?._count.tasks || 0} tasks`,
                icon: "🔥",
                color: "indigo"
            },
            {
                label: "Most Discussed Task",
                value: mostCommentedTask?.title || "N/A",
                subValue: `${mostCommentedTask?._count.comments || 0} comments`,
                icon: "💭",
                color: "teal"
            }
        ];

        return NextResponse.json({
            stats,
            distributions: {
                byStatus: tasksByStatus,
                byPriority: tasksByPriority
            }
        });
    } catch (error) {
        console.error("Error fetching fun stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch fun stats" },
            { status: 500 }
        );
    }
}
