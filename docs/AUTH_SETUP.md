# Setup Authentication - Panduan Lengkap

Panduan step-by-step untuk mengimplementasikan authentication dengan Prisma + PostgreSQL.

---

## 📋 Yang Sudah Dibuat

✅ **UI Pages:**
- `/pm/login` - Halaman login
- `/pm/signup` - Halaman pendaftaran

✅ **API Routes:**
- `/api/auth/login` - Endpoint login (placeholder)
- `/api/auth/signup` - Endpoint signup (placeholder)

✅ **Database Schema:**
- `prisma/schema.prisma` - User model

✅ **Prisma Client:**
- `src/lib/prisma.ts` - Prisma instance

---

## 🚀 Step 1: Install Dependencies

```bash
# Install Prisma
pnpm add prisma @prisma/client

# Install bcrypt untuk hash password
pnpm add bcrypt
pnpm add -D @types/bcrypt
```

---

## 🗄️ Step 2: Setup Database

### Option A: PostgreSQL (Production)

1. **Install PostgreSQL** (jika belum ada)
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Buat database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE archinara_pm;
   CREATE USER archinara WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE archinara_pm TO archinara;
   \q
   ```

3. **Buat file `.env`**
   ```bash
   cp env.example .env
   ```

4. **Edit `.env`**
   ```env
   DATABASE_URL="postgresql://archinara:your_password@localhost:5432/archinara_pm?schema=public"
   ```

### Option B: SQLite (Development - Lebih Mudah)

1. **Edit `prisma/schema.prisma`**
   ```prisma
   datasource db {
     provider = "sqlite"  // ganti dari postgresql
     url      = env("DATABASE_URL")
   }
   ```

2. **Buat file `.env`**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

---

## 🔧 Step 3: Generate Prisma Client

```bash
# Generate Prisma Client
npx prisma generate
```

---

## 📊 Step 4: Run Migration

```bash
# Buat migration pertama
npx prisma migrate dev --name init

# Prisma akan:
# 1. Membuat tabel di database
# 2. Generate Prisma Client
# 3. Apply migration
```

---

## 🔐 Step 5: Implementasi Login API

Edit file `src/app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Cari user di database
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

    // Return user data (tanpa password)
    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
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

---

## 📝 Step 6: Implementasi Signup API

Edit file `src/app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

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
      }
    });

    return NextResponse.json(
      { 
        message: 'Pendaftaran berhasil',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Step 7: Testing

### Test Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 🔍 Step 8: Prisma Studio (Database GUI)

Untuk melihat data di database:

```bash
npx prisma studio
```

Akan membuka browser di `http://localhost:5555`

---

## 📱 Step 9: Test di Browser

1. **Jalankan dev server**
   ```bash
   npm run dev
   ```

2. **Buka halaman signup**
   ```
   http://localhost:3000/pm/signup
   ```

3. **Daftar akun baru**
   - Isi form
   - Klik "Daftar"
   - Jika berhasil, akan muncul success message

4. **Login**
   ```
   http://localhost:3000/pm/login
   ```

---

## 🎯 Next Steps (Opsional)

### 1. Session Management dengan NextAuth.js

```bash
pnpm add next-auth
```

### 2. JWT Tokens

```bash
pnpm add jsonwebtoken
pnpm add -D @types/jsonwebtoken
```

### 3. Email Verification

```bash
pnpm add nodemailer
```

### 4. Password Reset

Buat endpoint `/api/auth/forgot-password`

### 5. Protected Routes

Buat middleware untuk check authentication

---

## 🐛 Troubleshooting

### Error: Can't reach database server

**Solusi:**
- Pastikan PostgreSQL running: `sudo service postgresql status`
- Check connection string di `.env`
- Atau gunakan SQLite untuk development

### Error: Environment variable not found

**Solusi:**
- Pastikan file `.env` ada di root project
- Restart development server setelah edit `.env`

### Error: Prisma Client not generated

**Solusi:**
```bash
npx prisma generate
```

### Migration Error

**Solusi:**
```bash
# Reset database (HATI-HATI: menghapus semua data)
npx prisma migrate reset

# Atau push schema tanpa migration
npx prisma db push
```

---

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [NextAuth.js](https://next-auth.js.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

## 🎓 Learning Path

1. ✅ Buat UI (Login & Signup) - **DONE**
2. ✅ Buat API Routes - **DONE**
3. ✅ Setup Prisma Schema - **DONE**
4. ⏳ Install dependencies
5. ⏳ Setup database
6. ⏳ Run migration
7. ⏳ Implement API logic
8. ⏳ Test authentication
9. ⏳ Add session management
10. ⏳ Protect routes

---

**Status:** Ready to implement! Tinggal ikuti step-by-step di atas. 🚀
