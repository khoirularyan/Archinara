"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RandomTask {
    title: string;
    description: string;
    priority: string;
    emoji: string;
    funFact: string;
}
//test saja
interface Quote {
    quote: string;
    author: string;
}

interface ProjectName {
    name: string;
    tagline: string;
    domain: string;
    available: boolean;
}

interface Stat {
    label: string;
    value: string | number;
    subValue?: string;
    icon: string;
    color: string;
}

interface LeaderboardUser {
    rank: number;
    name: string;
    email: string;
    medal: string | null;
    stats: {
        tasksCreated: number;
        tasksCompleted: number;
        completionRate: number;
        comments: number;
    };
    totalScore: number;
}

export default function FunZonePage() {
    const [randomTask, setRandomTask] = useState<RandomTask | null>(null);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [projectName, setProjectName] = useState<ProjectName | null>(null);
    const [stats, setStats] = useState<Stat[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        fetchQuote();
        fetchStats();
        fetchLeaderboard();
    }, []);

    const fetchRandomTask = async () => {
        try {
            const res = await fetch("/api/fun-zone/random-task");
            const data = await res.json();
            setRandomTask(data);
        } catch (error) {
            console.error("Error fetching random task:", error);
        }
    };

    const fetchQuote = async () => {
        try {
            const res = await fetch("/api/fun-zone/quote");
            const data = await res.json();
            setQuote(data);
        } catch (error) {
            console.error("Error fetching quote:", error);
        }
    };

    const fetchProjectName = async () => {
        try {
            const res = await fetch("/api/fun-zone/project-name");
            const data = await res.json();
            setProjectName(data);
        } catch (error) {
            console.error("Error fetching project name:", error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/fun-zone/stats");
            const data = await res.json();
            setStats(data.stats || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stats:", error);
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch("/api/fun-zone/leaderboard");
            const data = await res.json();
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            blue: "bg-blue-100 text-blue-700 border-blue-200",
            green: "bg-green-100 text-green-700 border-green-200",
            purple: "bg-purple-100 text-purple-700 border-purple-200",
            orange: "bg-orange-100 text-orange-700 border-orange-200",
            cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
            yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
            red: "bg-red-100 text-red-700 border-red-200",
            pink: "bg-pink-100 text-pink-700 border-pink-200",
            indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
            teal: "bg-teal-100 text-teal-700 border-teal-200",
        };
        return colors[color] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            LOW: "bg-gray-100 text-gray-700",
            MEDIUM: "bg-blue-100 text-blue-700",
            HIGH: "bg-orange-100 text-orange-700",
            URGENT: "bg-red-100 text-red-700",
        };
        return colors[priority] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                🎉 Fun Zone
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Tempat seru untuk lihat statistik dan generate hal-hal random!
                            </p>
                        </div>
                        <Link
                            href="/pm/dashboard"
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Motivational Quote */}
                {quote && (
                    <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="text-6xl opacity-50">"</div>
                            <div className="flex-1">
                                <p className="text-xl font-medium mb-3 leading-relaxed">
                                    {quote.quote}
                                </p>
                                <p className="text-purple-100 flex items-center gap-2">
                                    <span>—</span>
                                    <span className="font-semibold">{quote.author}</span>
                                </p>
                            </div>
                            <button
                                onClick={fetchQuote}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                title="Get new quote"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                )}

                {/* Generators Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Random Task Generator */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                🎲 Random Task Generator
                            </h2>
                            <button
                                onClick={fetchRandomTask}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                            >
                                Generate!
                            </button>
                        </div>

                        {randomTask ? (
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{randomTask.emoji}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {randomTask.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {randomTask.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(randomTask.priority)}`}>
                                                {randomTask.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                                    💡 {randomTask.funFact}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                Click "Generate!" untuk bikin task random yang lucu! 😄
                            </div>
                        )}
                    </div>

                    {/* Project Name Generator */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                ✨ Project Name Generator
                            </h2>
                            <button
                                onClick={fetchProjectName}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                            >
                                Generate!
                            </button>
                        </div>

                        {projectName ? (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-bold text-2xl text-gray-900 mb-2">
                                        {projectName.name}
                                    </h3>
                                    <p className="text-gray-600 italic mb-3">
                                        "{projectName.tagline}"
                                    </p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Domain:</span>
                                        <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                                            {projectName.domain}
                                        </code>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${projectName.available
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {projectName.available ? '✓ Available' : '✗ Taken'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                Click "Generate!" untuk bikin nama project yang keren! 🚀
                            </div>
                        )}
                    </div>
                </div>

                {/* Fun Statistics */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        📊 Fun Statistics
                    </h2>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl p-4 border-2 ${getColorClasses(stat.color)} transition-transform hover:scale-105`}
                                >
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-xs font-medium opacity-80">
                                        {stat.label}
                                    </div>
                                    {stat.subValue && (
                                        <div className="text-xs opacity-60 mt-1">{stat.subValue}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Team Leaderboard */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        🏆 Team Leaderboard
                    </h2>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Created</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Completed</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Rate</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Comments</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {leaderboard.slice(0, 10).map((user) => (
                                        <tr
                                            key={user.email}
                                            className={`hover:bg-gray-50 transition-colors ${user.rank <= 3 ? 'bg-yellow-50' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">#{user.rank}</span>
                                                    {user.medal && <span className="text-2xl">{user.medal}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                                    {user.stats.tasksCreated}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full font-semibold">
                                                    {user.stats.tasksCompleted}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {user.stats.completionRate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-700 rounded-full font-semibold">
                                                    {user.stats.comments}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                                    {user.totalScore}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {leaderboard.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No data available yet. Start creating tasks! 🚀
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        💡 Semua data di halaman ini adalah <strong>read-only</strong> dan tidak mengubah database apapun.
                    </p>
                    <p className="mt-1">
                        Refresh halaman untuk update data terbaru!
                    </p>
                </div>
            </div>
        </div>
    );
}
