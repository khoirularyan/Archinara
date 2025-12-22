import { NextResponse } from "next/server";

// Arrays untuk kombinasi random
const adjectives = [
    "Urgent", "Super Penting", "Gak Penting", "Misterius", "Rahasia",
    "Epic", "Legendary", "Absurd", "Aneh", "Lucu",
    "Gila", "Keren", "Ngaco", "Serius", "Santai"
];

const actions = [
    "Bikin", "Hapus", "Perbaiki", "Redesign", "Refactor",
    "Debug", "Test", "Deploy", "Migrate", "Optimize",
    "Review", "Approve", "Reject", "Cancel", "Restart"
];

const objects = [
    "Database", "API", "Frontend", "Backend", "UI/UX",
    "Logo", "Button", "Form", "Dashboard", "Report",
    "Email", "Notification", "Authentication", "Payment", "Chat",
    "Kopi", "Meeting", "Dokumentasi", "Bug", "Feature"
];

const reasons = [
    "karena bos minta", "karena deadline besok", "karena lagi gabut",
    "karena user komplain", "karena ada bug", "karena pengen aja",
    "karena lagi trend", "karena competitor punya", "karena keren",
    "karena biar cepet", "karena biar bagus", "karena biar gampang",
    "sebelum pulang", "sebelum makan siang", "sebelum weekend"
];

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const priorityEmojis: Record<string, string> = {
    LOW: "😴",
    MEDIUM: "🤔",
    HIGH: "🔥",
    URGENT: "🚨"
};

export async function GET() {
    try {
        // Generate random combinations
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const object = objects[Math.floor(Math.random() * objects.length)];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];

        const title = `${adjective}: ${action} ${object}`;
        const description = `Task ini harus dikerjakan ${reason}. Jangan lupa berdoa sebelum mulai! 🙏`;

        return NextResponse.json({
            title,
            description,
            priority,
            emoji: priorityEmojis[priority],
            funFact: `Fun fact: ${Math.floor(Math.random() * 100)}% developer setuju bahwa task ini ${Math.random() > 0.5 ? 'penting' : 'bisa ditunda'} 😄`
        });
    } catch (error) {
        console.error("Error generating random task:", error);
        return NextResponse.json(
            { error: "Failed to generate random task" },
            { status: 500 }
        );
    }
}
