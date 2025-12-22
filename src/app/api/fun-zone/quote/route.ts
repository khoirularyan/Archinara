import { NextResponse } from "next/server";

const quotes = [
    {
        quote: "Code yang bagus adalah code yang bisa dibaca sambil ngopi ☕",
        author: "Anonymous Developer"
    },
    {
        quote: "Debugging is like being a detective in a crime movie where you are also the murderer 🔍",
        author: "Filipe Fortes"
    },
    {
        quote: "Jangan takut dengan bug, takutlah dengan developer yang tidak pernah ketemu bug 🐛",
        author: "Wise Programmer"
    },
    {
        quote: "Kopi adalah fuel untuk developer, bug adalah motivasi 💪",
        author: "Coffee Lover Dev"
    },
    {
        quote: "Kalau code-mu error, coba restart dulu. Kalau masih error, coba tidur dulu 😴",
        author: "Senior Developer"
    },
    {
        quote: "Git commit -m 'fix bug' adalah doa developer modern 🙏",
        author: "Git Master"
    },
    {
        quote: "Tidak ada code yang sempurna, yang ada hanya code yang sudah di-deploy 🚀",
        author: "DevOps Engineer"
    },
    {
        quote: "Dokumentasi adalah love letter untuk future you 💌",
        author: "Documentation Advocate"
    },
    {
        quote: "Meeting bisa di-email, email bisa di-chat, chat bisa di-ignore 📧",
        author: "Productivity Guru"
    },
    {
        quote: "Ctrl+C, Ctrl+V adalah skill fundamental developer 😎",
        author: "Stack Overflow User"
    },
    {
        quote: "Jangan lupa commit sebelum pulang, atau besok kamu akan menyesal 😱",
        author: "Git Survivor"
    },
    {
        quote: "Code review adalah seni memberikan kritik tanpa membuat orang nangis 🎨",
        author: "Team Lead"
    },
    {
        quote: "Kalau bisa dikerjakan besok, kenapa harus sekarang? Kalau deadline besok, kenapa baru sekarang? ⏰",
        author: "Procrastinator Dev"
    },
    {
        quote: "Refactoring adalah cara halus bilang 'code-mu jelek' 🔧",
        author: "Clean Code Enthusiast"
    },
    {
        quote: "Production error adalah cara universe bilang 'test dulu dong' ⚠️",
        author: "QA Engineer"
    }
];

export async function GET() {
    try {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        return NextResponse.json(randomQuote);
    } catch (error) {
        console.error("Error getting random quote:", error);
        return NextResponse.json(
            { error: "Failed to get random quote" },
            { status: 500 }
        );
    }
}
