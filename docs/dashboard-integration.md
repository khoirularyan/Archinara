# 🎯 Dashboard & Notification Integration

## ✅ Yang Sudah Diimplementasikan

### 1. **Database Schema**
- ✅ Model `Notification` dengan enum `NotificationType`
- ✅ Relasi ke User model
- ✅ Indexes untuk performa query

### 2. **API Routes**

#### Notifications API
- **GET /api/notifications** - Fetch user notifications
- **DELETE /api/notifications** - Clear all notifications
- **PATCH /api/notifications/[id]** - Mark as read
- **DELETE /api/notifications/[id]** - Delete single notification

#### Dashboard Stats API
- **GET /api/dashboard/stats** - Get dashboard statistics
  - Total projects
  - Team count (ADMIN/MANAGER only)
  - Tasks count
  - Active projects
  - Pending tasks
  - Completed tasks this month
  - Recent projects

### 3. **Notification Helper Functions**
File: `/src/lib/notifications.ts`

```typescript
// Create single notification
createNotification({ userId, title, message, type })

// Create multiple notifications
createNotifications([...])

// Notify all admins and managers
notifyAdminsAndManagers(title, message, type)
```

### 4. **Auto Notifications**
Notifikasi otomatis dibuat saat:
- ✅ **Tambah anggota tim** → Notify admins & managers
- 🔄 **Tambah proyek** → TODO
- 🔄 **Task selesai** → TODO
- 🔄 **Deadline mendekat** → TODO
- 🔄 **Upload dokumen** → TODO

### 5. **Frontend Integration**
- ✅ NotificationDropdown fetch dari API
- ✅ Real-time badge counter
- ✅ Mark as read
- ✅ Delete per notification
- ✅ Clear all notifications
- ✅ Toast feedback

## 🚀 Cara Menjalankan

### Step 1: Run Migration

```bash
node run-notification-migration.js
```

**Expected Output:**
```
🚀 Starting notification migration...
✅ NotificationType enum created
✅ Notifications table created
✅ Foreign key constraint added
✅ Indexes created
✅ Verification results
🎉 Migration completed successfully!
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 4: Test Features

1. **Test Notification System:**
   - Login sebagai ADMIN/MANAGER
   - Tambah anggota tim baru
   - Klik icon bell → notifikasi muncul
   - Test mark as read, delete, clear all

2. **Test Dashboard Stats:**
   - Buka dashboard utama
   - Stats akan fetch dari database
   - Lihat total projects, team, tasks, dll

## 📊 Dashboard Stats Integration

### Update Dashboard Page

File yang perlu diupdate: `/src/app/(pm)/pm/dashboard/page.tsx`

```typescript
"use client"

import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard 
          title="Total Proyek" 
          value={stats.projects}
          icon="📁"
        />
        <StatsCard 
          title="Anggota Tim" 
          value={stats.team}
          icon="👥"
        />
        <StatsCard 
          title="Tasks" 
          value={stats.tasks}
          icon="✓"
        />
        <StatsCard 
          title="Proyek Aktif" 
          value={stats.activeProjects}
          icon="🚀"
        />
      </div>
    </div>
  )
}
```

## 🔔 Notification Examples

### Example 1: Notify on New Project

```typescript
// In /src/app/api/projects/route.ts
import { notifyAdminsAndManagers } from '@/lib/notifications'

export async function POST(req: Request) {
  // ... create project logic
  
  await notifyAdminsAndManagers(
    'Proyek Baru',
    `Proyek "${projectName}" telah dibuat`,
    'SUCCESS'
  )
}
```

### Example 2: Notify on Task Completion

```typescript
// In /src/app/api/tasks/[id]/route.ts
import { createNotification } from '@/lib/notifications'

export async function PATCH(req: Request) {
  // ... update task logic
  
  if (task.status === 'COMPLETED') {
    // Notify task creator
    await createNotification({
      userId: task.createdById,
      title: 'Task Selesai',
      message: `Task "${task.title}" telah diselesaikan`,
      type: 'SUCCESS'
    })
  }
}
```

### Example 3: Notify on Deadline

```typescript
// In a cron job or scheduled task
import { createNotifications } from '@/lib/notifications'

async function checkDeadlines() {
  const upcomingTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      },
      status: { not: 'COMPLETED' }
    }
  })

  const notifications = upcomingTasks.map(task => ({
    userId: task.assignedToId,
    title: 'Deadline Mendekat',
    message: `Task "${task.title}" akan deadline dalam 2 hari`,
    type: 'WARNING'
  }))

  await createNotifications(notifications)
}
```

## 🎨 Notification Types

| Type | Color | Use Case |
|------|-------|----------|
| INFO | Blue | General updates, new documents |
| SUCCESS | Green | Task completed, project created |
| WARNING | Yellow | Deadline approaching, pending approval |
| ERROR | Red | Failed actions, errors |

## 📝 Database Schema

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  title     String
  message   String
  type      NotificationType @default(INFO)
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, read])
  @@index([userId, createdAt])
  @@map("notifications")
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}
```

## 🔍 API Response Examples

### GET /api/notifications
```json
{
  "notifications": [
    {
      "id": "clx...",
      "userId": "cly...",
      "title": "Anggota Tim Baru",
      "message": "John Doe (john@email.com) telah ditambahkan ke tim sebagai ARCHITECT",
      "type": "SUCCESS",
      "read": false,
      "createdAt": "2025-01-03T10:30:00.000Z"
    }
  ]
}
```

### GET /api/dashboard/stats
```json
{
  "stats": {
    "projects": 12,
    "team": 8,
    "tasks": 45,
    "activeProjects": 5,
    "pendingTasks": 12,
    "completedTasksThisMonth": 23
  },
  "recentProjects": [...]
}
```

## ✅ Checklist

- [ ] Run notification migration
- [ ] Generate Prisma Client
- [ ] Restart dev server
- [ ] Test add team member → notification appears
- [ ] Test mark as read
- [ ] Test delete notification
- [ ] Test clear all
- [ ] Update dashboard page to use stats API
- [ ] Add notifications to other features (projects, tasks, etc.)

---

**Status:** ✅ **Backend Ready!**

Sistem notifikasi dan dashboard stats sudah terintegrasi dengan database. Tinggal jalankan migration dan test! 🚀
