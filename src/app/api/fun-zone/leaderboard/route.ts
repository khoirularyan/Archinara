import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get all users with their task counts
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        tasksCreated: true,
                        tasksAssigned: true,
                        comments: true,
                        projects: true
                    }
                },
                tasksAssigned: {
                    select: {
                        status: true
                    }
                }
            }
        });

        // Calculate stats for each user
        const leaderboard = users.map(user => {
            const completedTasks = user.tasksAssigned.filter(t => t.status === 'COMPLETED').length;
            const totalAssigned = user._count.tasksAssigned;
            const completionRate = totalAssigned > 0
                ? ((completedTasks / totalAssigned) * 100).toFixed(1)
                : 0;

            return {
                id: user.id,
                name: user.name || user.email,
                email: user.email,
                image: user.image,
                role: user.role,
                stats: {
                    tasksCreated: user._count.tasksCreated,
                    tasksAssigned: user._count.tasksAssigned,
                    tasksCompleted: completedTasks,
                    completionRate: parseFloat(completionRate as string),
                    comments: user._count.comments,
                    projects: user._count.projects
                },
                // Calculate total score for ranking
                totalScore:
                    (user._count.tasksCreated * 2) + // Creating tasks worth 2 points
                    (completedTasks * 3) +            // Completing tasks worth 3 points
                    (user._count.comments * 1) +      // Comments worth 1 point
                    (user._count.projects * 5)        // Project membership worth 5 points
            };
        });

        // Sort by total score
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        // Add rank and medals
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            ...user,
            rank: index + 1,
            medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null
        }));

        // Get top performers by category
        const topCreator = leaderboard.reduce((max, user) =>
            user.stats.tasksCreated > max.stats.tasksCreated ? user : max
            , leaderboard[0]);

        const topCompleter = leaderboard.reduce((max, user) =>
            user.stats.tasksCompleted > max.stats.tasksCompleted ? user : max
            , leaderboard[0]);

        const topCommenter = leaderboard.reduce((max, user) =>
            user.stats.comments > max.stats.comments ? user : max
            , leaderboard[0]);

        const topCollaborator = leaderboard.reduce((max, user) =>
            user.stats.projects > max.stats.projects ? user : max
            , leaderboard[0]);

        return NextResponse.json({
            leaderboard: rankedLeaderboard,
            highlights: {
                topCreator: {
                    name: topCreator.name,
                    count: topCreator.stats.tasksCreated,
                    title: "Task Creator Champion 🏆"
                },
                topCompleter: {
                    name: topCompleter.name,
                    count: topCompleter.stats.tasksCompleted,
                    title: "Task Completion Master ⚡"
                },
                topCommenter: {
                    name: topCommenter.name,
                    count: topCommenter.stats.comments,
                    title: "Most Talkative 💬"
                },
                topCollaborator: {
                    name: topCollaborator.name,
                    count: topCollaborator.stats.projects,
                    title: "Team Player 🤝"
                }
            }
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
