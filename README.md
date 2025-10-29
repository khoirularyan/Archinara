Archinara — Modern Architecture Studio

Studio arsitektur modern dengan tiga area utama: Marketing site, Archinara PM (manajemen proyek), dan Archinara Work (mobile/PWA untuk lapangan).

<p align="left"> <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs" /> <img alt="React" src="https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=fff" /> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff" /> <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=fff" /> <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn/ui-%20-111827" /> <img alt="pnpm" src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=fff" /> </p>

🚀 Quick Start

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

    Requirements: Node.js ≥ 18.17, pnpm ≥ 9.
    Catatan: Proyek ini menggunakan App Router (Next 16) + Tailwind v4.

📁 Project Structure

src/app
├─ (marketing)/           # landing/portfolio
│  ├─ layout.tsx
│  └─ page.tsx
├─ (pm)/                  # Archinara PM (URL: /pm)
│  ├─ layout.tsx
│  └─ pm/
│     ├─ page.tsx
│     ├─ dashboard/...
│     ├─ schedule/...
│     └─ team/...
├─ (work)/                # Archinara Work (URL: /work)
│  ├─ layout.tsx
│  └─ work/
│     ├─ page.tsx
│     ├─ schedule/...
│     ├─ tasks/...
│     └─ attendance/...
└─ api/                   # API routes/handlers (pm, work)

Lihat docs/APP_STRUCTURE.md

🎯 Features
Marketing Site (/)

🎨 Modern & responsif

⚡ Performa dioptimalkan

📱 Mobile-first

♿ Aksesibilitas dasar

🎭 Animasi halus

Archinara PM (/pm)

📊 Dashboard proyek

👥 Kolaborasi tim

📁 Manajemen dokumen

💰 Budget/BoQ (roadmap)

📈 Laporan & analytics

Archinara Work (/work)

📅 Jadwal harian/mingguan

✅ Tugas hari ini (progress, foto)

👤 Absen (GPS/QR)*

📝 Laporan harian
* Validasi lokasi & QR direncanakan tahap berikutnya.

🛠️ Tech Stack

Frontend: Next.js 16 (React 19), TypeScript 5, Tailwind CSS 4, shadcn/ui, Sonner (toast)

Backend: Next.js API Routes / Route Handlers

Tooling: pnpm, ESLint

Catatan UI: Komponen toast shadcn lama sudah deprecated—gunakan Sonner (<Toaster /> di layout + toast.* di client).

🔗 Routes
Route	Deskripsi
/	Homepage (Marketing)
/pm	PM Landing Page
/pm/dashboard	PM Dashboard
/pm/projects	Daftar Proyek
/pm/projects/:id	Detail Proyek
/pm/team	Manajemen Tim
/pm/settings	Pengaturan
/work	Work Dashboard
/work/schedule	Jadwal
/work/tasks	Tugas
/work/attendance	Absen
/work/report	Laporan

🧩 Catatan Deployment (Vercel)

Gunakan Framework Preset: Next.js.

Build Command & Output Directory biarkan default (kosong).

Jika repo dipakai dalam monorepo, set Root Directory ke folder app yang benar (mis. web/).

Pastikan domain (apex & www) di-attach ke project (bukan ke deployment), set Primary + Redirect 301.

🗺️ Roadmap Singkat