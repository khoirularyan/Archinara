import { NextResponse } from "next/server";

const prefixes = [
    "Super", "Mega", "Ultra", "Hyper", "Turbo",
    "Smart", "Quick", "Fast", "Easy", "Simple",
    "Pro", "Max", "Plus", "Premium", "Elite",
    "Next", "Future", "Modern", "Digital", "Cloud"
];

const cores = [
    "Build", "Arch", "Design", "Plan", "Construct",
    "Create", "Manage", "Track", "Monitor", "Control",
    "Flow", "Hub", "Space", "Zone", "Lab",
    "Studio", "Works", "Craft", "Forge", "Factory"
];

const suffixes = [
    "Pro", "X", "AI", "360", "Plus",
    "Suite", "Platform", "System", "Engine", "Tool",
    "App", "Software", "Solution", "Service", "Cloud",
    "Hub", "Central", "Master", "Expert", "Genius"
];

const taglines = [
    "Bikin proyek jadi gampang",
    "Arsitektur masa depan dimulai di sini",
    "Kelola proyek dengan style",
    "Dari blueprint sampai building",
    "Proyek selesai, client happy",
    "Design today, build tomorrow",
    "Arsitektur yang bikin wow",
    "Proyek lancar, hati senang",
    "Manajemen proyek tanpa drama",
    "Kerjaan beres, pulang on time",
    "Proyek sukses, bonus naik",
    "Dari konsep sampai kunci",
    "Bikin proyek jadi masterpiece",
    "Arsitektur keren, client puas",
    "Proyek cepat, hasil mantap"
];

export async function GET() {
    try {
        // Generate random project name
        const usePrefix = Math.random() > 0.3;
        const useSuffix = Math.random() > 0.3;

        let name = "";

        if (usePrefix) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            name += prefix;
        }

        const core = cores[Math.floor(Math.random() * cores.length)];
        name += (name ? "" : "") + core;

        if (useSuffix) {
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            name += suffix;
        }

        const tagline = taglines[Math.floor(Math.random() * taglines.length)];

        return NextResponse.json({
            name,
            tagline,
            domain: `${name.toLowerCase()}.com`,
            available: Math.random() > 0.5 // Random domain availability 😄
        });
    } catch (error) {
        console.error("Error generating project name:", error);
        return NextResponse.json(
            { error: "Failed to generate project name" },
            { status: 500 }
        );
    }
}
