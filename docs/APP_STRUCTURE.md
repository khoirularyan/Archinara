# App Structure - Route Groups

Struktur aplikasi menggunakan Next.js 16 Route Groups untuk memisahkan concerns dan memudahkan maintenance.

## Struktur Folder

```
src/app/
├── (marketing)/              # Landing page & portfolio (URL: /)
│   ├── layout.tsx           # Header + Footer marketing
│   └── page.tsx             # Homepage
│
├── (pm)/                    # Archinara PM (URL: /pm/*)
│   ├── layout.tsx           # PM Header + Footer
│   └── pm/                  # URL path
│       ├── page.tsx         # /pm (landing page PM)
│       ├── dashboard/
│       │   └── page.tsx     # /pm/dashboard
│       ├── projects/
│       │   ├── page.tsx     # /pm/projects
│       │   └── [id]/page.tsx # /pm/projects/:id
│       ├── team/page.tsx    # /pm/team
│       └── settings/page.tsx # /pm/settings
│
├── (work)/                  # Archinara Work (URL: /work/*)
│   ├── layout.tsx           # Work-specific layout
│   └── work/                # URL path
│       ├── page.tsx         # /work (daily dashboard)
│       ├── schedule/page.tsx # /work/schedule
│       ├── tasks/page.tsx   # /work/tasks
│       ├── attendance/page.tsx # /work/attendance
│       └── report/page.tsx  # /work/report
│
├── api/                     # API Routes
│   ├── pm/route.ts          # PM API endpoints
│   └── work/route.ts        # Work API endpoints
│
└── layout.tsx               # Root layout (font, theme, Toaster)
```

## Route Groups Explained

Route groups menggunakan folder `(name)` yang **tidak mempengaruhi URL**:

- `(marketing)` → URL tetap `/`
- `(pm)` → URL tetap `/pm/*`
- `(work)` → URL tetap `/work/*`

## Benefits

1. **Separation of Concerns** - Setiap section punya layout sendiri
2. **Scalability** - Mudah menambah fitur baru tanpa conflict
3. **Code Organization** - Struktur lebih jelas dan maintainable
4. **Layout Flexibility** - Setiap route group bisa punya layout berbeda

## URL Mapping

| File Path | URL |
|-----------|-----|
| `(marketing)/page.tsx` | `/` |
| `(pm)/pm/page.tsx` | `/pm` |
| `(pm)/pm/dashboard/page.tsx` | `/pm/dashboard` |
| `(pm)/pm/projects/[id]/page.tsx` | `/pm/projects/:id` |
| `(work)/work/page.tsx` | `/work` |
| `(work)/work/schedule/page.tsx` | `/work/schedule` |

## Next Steps

1. Implement authentication for PM and Work sections
2. Create shared components for each section
3. Add middleware for route protection
4. Implement API endpoints for data fetching
