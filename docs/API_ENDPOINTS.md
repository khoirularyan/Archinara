# 📚 API Endpoints Documentation

Dokumentasi lengkap semua API endpoints di Archinara Project Management System.

---

## 🔐 Authentication

### 1. NextAuth Endpoints
**Base URL:** `/api/auth/[...nextauth]`

Handled by NextAuth.js untuk session management:
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token
- `GET /api/auth/providers` - Get available providers

---

### 2. Login (Custom)
**Endpoint:** `POST /api/auth/login`

**Status:** ⚠️ Not Implemented (menggunakan NextAuth)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "error": "Database belum disetup. Silakan setup Prisma terlebih dahulu.",
  "message": "Login endpoint siap, tinggal integrasikan dengan database"
}
```

---

### 3. Signup
**Endpoint:** `POST /api/auth/signup`

**Status:** ✅ Active

**Description:** Register user baru

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- Semua field required
- Password minimal 6 karakter
- Email harus unique

**Response Success (201):**
```json
{
  "message": "Pendaftaran berhasil",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-01-03T10:00:00.000Z"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Email sudah terdaftar"
}
```

---

### 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Status:** ✅ Active

**Description:** Request reset password link via email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Jika email terdaftar, link reset password akan dikirim"
}
```

**Email Content:**
- Reset link valid 1 jam
- Format: `{NEXTAUTH_URL}/pm/reset-password?token={resetToken}`

**Environment Variables Required:**
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`
- `NEXTAUTH_URL`

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Status:** ✅ Active

**Description:** Reset password dengan token

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Validation:**
- Token harus valid dan belum expired
- Password minimal 6 karakter

**Response Success (200):**
```json
{
  "message": "Password berhasil direset"
}
```

**Response Error (400):**
```json
{
  "error": "Token tidak valid atau sudah kadaluarsa"
}
```

---

## 👥 Team Management

### 6. Get Team Members
**Endpoint:** `GET /api/pm/team`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Authorization:** ADMIN or MANAGER only

**Description:** Fetch all team members

**Response (200):**
```json
{
  "users": [
    {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "role": "ARCHITECT",
      "image": "https://...",
      "isTempPassword": false,
      "createdAt": "2025-01-03T10:00:00.000Z",
      "updatedAt": "2025-01-03T10:00:00.000Z",
      "_count": {
        "projects": 5
      }
    }
  ]
}
```

**Response Error (403):**
```json
{
  "error": "Forbidden"
}
```

---

### 7. Add Team Member
**Endpoint:** `POST /api/pm/team`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Authorization:** ADMIN or MANAGER only

**Description:** Add new team member dengan auto-generate password

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "username": "janesmith",
  "role": "ARCHITECT",
  "password": "optional",
  "autoGeneratePassword": true
}
```

**Valid Roles:**
- `ADMIN`
- `MANAGER`
- `ARCHITECT`
- `USER`

**Auto-Generate Password Format:**
- Format: `{firstName}{4digits}`
- Example: `Jane1234`

**Response Success (201):**
```json
{
  "user": {
    "id": "clx...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "username": "janesmith",
    "role": "ARCHITECT",
    "image": null,
    "isTempPassword": true,
    "createdAt": "2025-01-03T10:00:00.000Z"
  },
  "generatedPassword": "Jane1234"
}
```

**Side Effects:**
- ✅ Creates notification for all ADMIN & MANAGER users

**Response Error (400):**
```json
{
  "error": "Email already exists"
}
```

---

## 👤 Profile Management

### 8. Get Profile
**Endpoint:** `GET /api/profile`

**Status:** ✅ Active

**Authentication:** Session OR Bearer Token

**Description:** Get user profile data

**Option 1: Session-based**
```bash
# Uses session cookie
GET /api/profile
```

**Option 2: Bearer Token**
```bash
GET /api/profile?userId=clx...
Authorization: Bearer {DASHBOARD_TOKEN}
```

**Response (200):**
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ARCHITECT",
    "image": "https://...",
    "createdAt": "2025-01-03T10:00:00.000Z",
    "updatedAt": "2025-01-03T10:00:00.000Z"
  }
}
```

---

### 9. Update Profile
**Endpoint:** `PATCH /api/profile`

**Status:** ✅ Active

**Authentication:** Session OR Bearer Token

**Description:** Update user profile (name, image)

**Request Body:**
```json
{
  "name": "John Updated",
  "image": "https://..."
}
```

**Note:** Email dan role TIDAK bisa diubah dari endpoint ini

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "clx...",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "ARCHITECT",
    "image": "https://...",
    "updatedAt": "2025-01-03T10:30:00.000Z"
  }
}
```

---

### 10. Upload Profile Picture
**Endpoint:** `POST /api/profile/upload`

**Status:** ✅ Active

**Authentication:** Session OR Bearer Token

**Description:** Upload profile picture to Supabase Storage

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: [File]
```

**Validation:**
- Allowed types: JPEG, JPG, PNG, WebP, GIF
- Max size: 5MB

**Response (200):**
```json
{
  "message": "File uploaded successfully to Supabase",
  "url": "https://supabase.co/storage/v1/...",
  "filename": "avatar.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

**Response Error (400):**
```json
{
  "error": "File too large. Maximum size is 5MB"
}
```

---

## 📁 Project Management

### 11. Get Projects
**Endpoint:** `GET /api/projects`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Get all projects where user is a member

**Response (200):**
```json
{
  "projects": [
    {
      "id": "clx...",
      "name": "Villa Bali Renovation",
      "description": "Renovasi villa di Bali",
      "status": "IN_PROGRESS",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-06-30T00:00:00.000Z",
      "budget": 500000000,
      "createdAt": "2025-01-03T10:00:00.000Z",
      "updatedAt": "2025-01-03T10:00:00.000Z",
      "members": [...],
      "teamCount": 5,
      "taskCount": 20,
      "documentCount": 10,
      "progress": 45
    }
  ]
}
```

**Progress Calculation:**
- `progress = (completedTasks / totalTasks) * 100`

---

### 12. Create Project
**Endpoint:** `POST /api/projects`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Create new project

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "budget": 1000000000
}
```

**Validation:**
- `name` is required

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "clx...",
    "name": "New Project",
    "description": "Project description",
    "status": "PLANNING",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-12-31T00:00:00.000Z",
    "budget": 1000000000,
    "members": [
      {
        "id": "clx...",
        "role": "OWNER",
        "joinedAt": "2025-01-03T10:00:00.000Z",
        "user": {...}
      }
    ]
  }
}
```

**Side Effects:**
- Creator automatically added as OWNER member

---

### 13. Get Project Detail
**Endpoint:** `GET /api/projects/[id]`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Authorization:** Must be project member

**Description:** Get detailed project information

**Response (200):**
```json
{
  "project": {
    "id": "clx...",
    "name": "Villa Bali Renovation",
    "description": "Renovasi villa di Bali",
    "status": "IN_PROGRESS",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-06-30T00:00:00.000Z",
    "budget": 500000000,
    "createdAt": "2025-01-03T10:00:00.000Z",
    "updatedAt": "2025-01-03T10:00:00.000Z",
    "members": [
      {
        "id": "clx...",
        "role": "OWNER",
        "joinedAt": "2025-01-03T10:00:00.000Z",
        "user": {
          "id": "clx...",
          "name": "John Doe",
          "email": "john@example.com",
          "image": "https://...",
          "role": "ARCHITECT"
        }
      }
    ],
    "tasks": [
      {
        "id": "clx...",
        "title": "Design Floor Plan",
        "description": "Create detailed floor plan",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "dueDate": "2025-02-01T00:00:00.000Z",
        "assignedTo": {...},
        "createdBy": {...},
        "createdAt": "2025-01-03T10:00:00.000Z",
        "updatedAt": "2025-01-03T10:00:00.000Z"
      }
    ],
    "documents": [...],
    "progress": 45,
    "teamCount": 5,
    "taskCount": 20,
    "completedTaskCount": 9,
    "documentCount": 10
  }
}
```

**Response Error (403):**
```json
{
  "error": "You do not have access to this project"
}
```

**Response Error (404):**
```json
{
  "error": "Project not found"
}
```

---

## 🔔 Notifications

### 14. Get Notifications
**Endpoint:** `GET /api/notifications`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Get all notifications for current user

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "clx...",
      "userId": "clx...",
      "title": "Anggota Tim Baru",
      "message": "Jane Smith (jane@example.com) telah ditambahkan ke tim sebagai ARCHITECT",
      "type": "SUCCESS",
      "read": false,
      "createdAt": "2025-01-03T10:00:00.000Z"
    }
  ]
}
```

**Notification Types:**
- `INFO` - General information
- `SUCCESS` - Success actions
- `WARNING` - Warnings
- `ERROR` - Error messages

---

### 15. Delete All Notifications
**Endpoint:** `DELETE /api/notifications`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Delete all notifications for current user

**Response (200):**
```json
{
  "message": "All notifications deleted"
}
```

---

### 16. Mark Notification as Read
**Endpoint:** `PATCH /api/notifications/[id]`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Mark single notification as read

**Response (200):**
```json
{
  "notification": {
    "id": "clx...",
    "userId": "clx...",
    "title": "Anggota Tim Baru",
    "message": "Jane Smith telah ditambahkan",
    "type": "SUCCESS",
    "read": true,
    "createdAt": "2025-01-03T10:00:00.000Z"
  }
}
```

---

### 17. Delete Single Notification
**Endpoint:** `DELETE /api/notifications/[id]`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Delete single notification

**Response (200):**
```json
{
  "message": "Notification deleted"
}
```

---

## 📊 Dashboard

### 18. Get Dashboard Stats
**Endpoint:** `GET /api/dashboard/stats`

**Status:** ✅ Active

**Authentication:** Required (Session)

**Description:** Get dashboard statistics based on user role

**Response (200):**
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
  "recentProjects": [
    {
      "id": "clx...",
      "name": "Villa Bali",
      "status": "IN_PROGRESS",
      "createdAt": "2025-01-03T10:00:00.000Z",
      "_count": {
        "tasks": 20,
        "members": 5
      }
    }
  ]
}
```

**Role-based Access:**

**ADMIN / MANAGER:**
- `projects` - All projects count
- `team` - All users count
- `activeProjects` - All IN_PROGRESS projects
- `recentProjects` - Last 5 projects

**USER / ARCHITECT:**
- `projects` - Only their projects count
- `team` - Not shown (0)
- `activeProjects` - Only their IN_PROGRESS projects
- `recentProjects` - Last 5 of their projects

**Stats Definitions:**
- `tasks` - Total tasks assigned to or created by user
- `pendingTasks` - Tasks with status TODO or IN_PROGRESS
- `completedTasksThisMonth` - Tasks completed in current month

---

## 🚧 Coming Soon

### 19. PM API
**Endpoint:** `GET /api/pm`

**Status:** 🔄 Coming Soon

**Response:**
```json
{
  "message": "PM API - Coming soon"
}
```

---

### 20. Work API
**Endpoint:** `GET /api/work`

**Status:** 🔄 Coming Soon

**Response:**
```json
{
  "message": "Work API - Coming soon"
}
```

---

## 🔒 Authentication Methods

### 1. Session-based (NextAuth)
```bash
# Login via NextAuth
POST /api/auth/signin

# Subsequent requests use session cookie
GET /api/profile
Cookie: next-auth.session-token=...
```

### 2. Bearer Token (Dashboard)
```bash
GET /api/profile?userId=clx...
Authorization: Bearer {DASHBOARD_TOKEN}
```

**Environment Variable:**
```env
DASHBOARD_TOKEN=your-secret-token
```

---

## 📝 Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - No permission |
| 404 | Not Found |
| 500 | Internal Server Error |
| 501 | Not Implemented |

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Email (for password reset)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@archinara.com

# Dashboard Token
DASHBOARD_TOKEN=your-dashboard-token

# Supabase (for file upload)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📊 Database Models

### User
```prisma
model User {
  id                String    @id @default(cuid())
  name              String
  email             String    @unique
  username          String?   @unique
  password          String
  role              UserRole  @default(USER)
  image             String?
  isTempPassword    Boolean   @default(false)
  resetToken        String?
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### Project
```prisma
model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(PLANNING)
  startDate   DateTime
  endDate     DateTime?
  budget      Float?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

### Notification
```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  title     String
  message   String
  type      NotificationType @default(INFO)
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
}
```

---

## 🎯 Quick Reference

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password

### Team
- `GET /api/pm/team` - List members (ADMIN/MANAGER)
- `POST /api/pm/team` - Add member (ADMIN/MANAGER)

### Profile
- `GET /api/profile` - Get profile
- `PATCH /api/profile` - Update profile
- `POST /api/profile/upload` - Upload avatar

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Project detail

### Notifications
- `GET /api/notifications` - List notifications
- `DELETE /api/notifications` - Clear all
- `PATCH /api/notifications/[id]` - Mark as read
- `DELETE /api/notifications/[id]` - Delete one

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

---

**Last Updated:** 4 November 2025  
**Version:** 1.0.0  
**Total Endpoints:** 20 (18 active, 2 coming soon)
