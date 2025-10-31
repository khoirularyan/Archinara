# Archinara — Modern Architecture Studio Platform

Platform terintegrasi untuk studio arsitektur modern dengan tiga area utama:
- **Marketing Site** (/) - Landing page & portfolio
- **Archinara PM** (/pm) - Project Management untuk arsitek & manajer
- **Archinara Work** (/work) - Mobile-first dashboard untuk pekerja lapangan

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=fff" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=fff" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=fff" />
</p>

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.17
- pnpm ≥ 9
- PostgreSQL (atau SQLite untuk development)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Archinara

# Install dependencies
pnpm install

# Setup environment variables
cp env.example .env
# Edit .env dan sesuaikan DATABASE_URL

# Setup database (opsional, jika sudah ada Prisma schema)
npx prisma generate
npx prisma db push

# Run development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

> **Note:** Proyek ini menggunakan Next.js 16 App Router + Tailwind CSS v4

## 📁 Project Structure

```
Archinara/
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Marketing site (URL: /)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (pm)/             # PM Section (URL: /pm/*)
│   │   │   ├── layout.tsx
│   │   │   └── pm/
│   │   │       ├── page.tsx
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       ├── team/
│   │   │       ├── settings/
│   │   │       ├── login/
│   │   │       └── signup/
│   │   ├── (work)/           # Work Section (URL: /work/*)
│   │   │   ├── layout.tsx
│   │   │   └── work/
│   │   │       ├── page.tsx
│   │   │       ├── schedule/
│   │   │       ├── tasks/
│   │   │       ├── attendance/
│   │   │       └── report/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/
│   │   │   ├── pm/
│   │   │   └── work/
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities & helpers
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
├── docs/                     # Documentation
├── public/                   # Static assets
└── package.json
```

> **Lihat dokumentasi lengkap:** [docs/APP_STRUCTURE.md](docs/APP_STRUCTURE.md)

## 🎯 Features

### Marketing Site (`/`)
- 🎨 Modern & responsive design
- ⚡ Optimized performance
- 📱 Mobile-first approach
- ♿ Accessibility compliant
- 🎭 Smooth animations & transitions
- 📸 Portfolio showcase
- 💬 Testimonials & FAQ

### Archinara PM (`/pm`)
- 📊 **Project Dashboard** - Overview semua proyek
- 👥 **Team Collaboration** - Manajemen tim & roles
- 📁 **Document Management** - Upload & organize files
- 💰 **Budget Tracking** - Monitor pengeluaran proyek
- 📈 **Reports & Analytics** - Insight performa proyek
- 🔐 **Authentication** - Login/Signup system
- ⚙️ **Settings** - Konfigurasi project & user

### Archinara Work (`/work`)
- 📅 **Schedule** - Jadwal harian/mingguan
- ✅ **Tasks** - Daftar tugas dengan progress tracking
- 👤 **Attendance** - Absensi dengan GPS/QR (roadmap)
- 📝 **Daily Report** - Laporan harian pekerjaan
- 📱 **Mobile-Optimized** - PWA-ready untuk field workers

> **Status:** Marketing site & PM landing sudah live. Dashboard & Work masih dalam development.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Animations:** tw-animate-css

### Backend
- **API:** Next.js Route Handlers
- **Database ORM:** Prisma
- **Database:** PostgreSQL (production) / SQLite (dev)
- **Authentication:** NextAuth.js (planned)

### Development
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Type Checking:** TypeScript strict mode

> **Lihat detail lengkap:** [docs/TECH_STACK.md](docs/TECH_STACK.md)

## 🔗 Routes

### Marketing
| Route | Description |
|-------|-------------|
| `/` | Homepage & Portfolio |

### Archinara PM
| Route | Description |
|-------|-------------|
| `/pm` | PM Landing Page |
| `/pm/login` | Login Page |
| `/pm/signup` | Sign Up Page |
| `/pm/dashboard` | PM Dashboard |
| `/pm/projects` | Project List |
| `/pm/projects/:id` | Project Detail |
| `/pm/team` | Team Management |
| `/pm/settings` | Settings |

### Archinara Work
| Route | Description |
|-------|-------------|
| `/work` | Work Dashboard |
| `/work/schedule` | Schedule View |
| `/work/tasks` | Task List |
| `/work/attendance` | Attendance Check-in |
| `/work/report` | Daily Report |

## 🚀 Deployment

### Vercel (Recommended)

1. **Framework Preset:** Next.js
2. **Build Command:** `pnpm build` (atau biarkan default)
3. **Output Directory:** Biarkan default
4. **Environment Variables:** Set `DATABASE_URL` dan variabel lainnya
5. **Domain:** Attach domain ke project, set Primary + Redirect 301

### Environment Variables

Pastikan set variabel berikut di Vercel/hosting:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

## 📚 Documentation

- [App Structure](docs/APP_STRUCTURE.md) - Penjelasan route groups & struktur
- [Tech Stack](docs/TECH_STACK.md) - Detail teknologi yang digunakan
- [Folder Structure](docs/FOLDER_STRUCTURE.md) - Penjelasan setiap folder
- [Prisma Setup](docs/SETUP_PRISMA.md) - Setup database
- [Auth Setup](docs/AUTH_SETUP.md) - Setup authentication
- [Quick Reference](docs/QUICK_REFERENCE.md) - Command cheat sheet

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Marketing site
- [x] PM landing page
- [x] Basic routing structure
- [ ] Authentication system
- [ ] Database setup & models

### Phase 2
- [ ] PM Dashboard implementation
- [ ] Project management features
- [ ] Team collaboration
- [ ] Document upload

### Phase 3
- [ ] Work dashboard
- [ ] Schedule & tasks
- [ ] Attendance system (GPS/QR)
- [ ] Daily reports

### Phase 4
- [ ] Budget tracking & BoQ
- [ ] Analytics & reporting
- [ ] Mobile app (PWA)
- [ ] Advanced features

## 🤝 Contributing

Silakan baca dokumentasi di folder `docs/` sebelum contribute.

## 📄 License

Private project - All rights reserved.