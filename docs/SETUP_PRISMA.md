# Setup Prisma untuk Archinara PM

## Step 1: Install Dependencies

```bash
cd /home/khoirul/dev/Archinara
pnpm add prisma @prisma/client
pnpm add -D prisma
```

## Step 2: Initialize Prisma

```bash
npx prisma init
```

Ini akan membuat:
- `prisma/schema.prisma` - File konfigurasi database
- `.env` - File environment variables

## Step 3: Setup Database (PostgreSQL)

Edit file `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/archinara_pm?schema=public"
```

**Alternatif: Gunakan SQLite untuk development**

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Dan edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"  // ganti dari postgresql
  url      = env("DATABASE_URL")
}
```

## Step 4: Buat Schema Database

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // atau "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  projects      ProjectMember[]
  tasks         Task[]
  comments      Comment[]
}

enum Role {
  USER
  ADMIN
  ARCHITECT
  CLIENT
}

model Project {
  id          String    @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(PLANNING)
  startDate   DateTime?
  endDate     DateTime?
  budget      Float?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  members     ProjectMember[]
  tasks       Task[]
  documents   Document[]
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

model ProjectMember {
  id        String   @id @default(cuid())
  role      String   // e.g., "Lead Architect", "Project Manager"
  joinedAt  DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@unique([userId, projectId])
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  assigneeId  String?
  assignee    User?      @relation(fields: [assigneeId], references: [id])
  
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  comments    Comment[]
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model Document {
  id          String   @id @default(cuid())
  name        String
  url         String
  type        String   // e.g., "pdf", "dwg", "jpg"
  size        Int      // in bytes
  uploadedAt  DateTime @default(now())
  
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
}
```

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

## Step 6: Run Migration

```bash
npx prisma migrate dev --name init
```

Ini akan:
- Membuat database tables
- Generate Prisma Client
- Apply migration

## Step 7: Buat Prisma Client Instance

Buat file `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Step 8: Install bcrypt untuk Hash Password

```bash
pnpm add bcrypt
pnpm add -D @types/bcrypt
```

## Step 9: Buat API Route untuk Register

Buat file `app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    return NextResponse.json(
      { message: 'User berhasil dibuat', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
```

## Step 10: Buat API Route untuk Login

Buat file `app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login berhasil',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
```

## Step 11: Prisma Studio (Database GUI)

Untuk melihat data di database:

```bash
npx prisma studio
```

Akan membuka browser di `http://localhost:5555`

## Step 12: Seed Data (Optional)

Buat file `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@archinara.com' },
    update: {},
    create: {
      email: 'admin@archinara.com',
      name: 'Admin Archinara',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Tambahkan di `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run seed:

```bash
npx prisma db seed
```

## Troubleshooting

### Error: Can't reach database server

- Pastikan PostgreSQL sudah running
- Check connection string di `.env`
- Atau gunakan SQLite untuk development

### Error: Environment variable not found

- Pastikan file `.env` ada di root project
- Restart development server setelah edit `.env`

### Migration Error

```bash
# Reset database (HATI-HATI: menghapus semua data)
npx prisma migrate reset

# Atau push schema tanpa migration
npx prisma db push
```

## Next Steps

1. Install NextAuth.js untuk session management
2. Implement JWT tokens
3. Add email verification
4. Add password reset functionality
5. Implement role-based access control (RBAC)
