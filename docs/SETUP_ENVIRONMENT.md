# 🔧 Environment Variables Setup

## Required Environment Variables

Tambahkan variabel berikut ke file `.env` di root project:

```bash
# ==========================
# Database
# ==========================
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# ==========================
# NextAuth
# ==========================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate dengan: openssl rand -base64 32

# ==========================
# Supabase Storage (untuk upload dokumen)
# ==========================
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==========================
# Gmail SMTP (untuk email verifikasi)
# ==========================
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"  # Gmail App Password
EMAIL_FROM="Archinara PM <your-email@gmail.com>"

# ==========================
# App Configuration
# ==========================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Setup Steps

### 1. Database (Neon/Vercel Postgres)
Sudah dikonfigurasi ✅

### 2. NextAuth Secret
```bash
# Generate secret key
openssl rand -base64 32

# Tambahkan ke .env
NEXTAUTH_SECRET="hasil-generate-di-atas"
```

### 3. Supabase Storage (untuk Upload Dokumen)

**⚠️ PENTING:** Tanpa Supabase, fitur upload dokumen tidak akan berfungsi!

#### Langkah Setup:
1. Buka [https://supabase.com](https://supabase.com) dan buat project baru
2. Di dashboard, buka **Settings** → **API**
3. Copy credentials:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

4. Buat Storage Bucket:
   - Buka **Storage** di sidebar
   - Klik **"New bucket"**
   - Name: `documents`
   - Public bucket: ✅ **Checked**
   - Klik **"Create bucket"**

5. Setup RLS Policies (di SQL Editor):
```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow public read access
CREATE POLICY "Allow public read access to documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
```

**Dokumentasi lengkap:** `docs/SUPABASE_SETUP.md`

### 4. Gmail SMTP (untuk Email Verifikasi)

#### Langkah Setup:
1. Enable 2FA di Gmail account
2. Generate App Password:
   - Buka [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - App: Mail
   - Device: Other (Custom name) → "Archinara PM"
   - Copy 16-digit password

3. Update `.env`:
```bash
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="xxxx xxxx xxxx xxxx"  # App Password dari step 2
EMAIL_FROM="Archinara PM <your-email@gmail.com>"
```

**Dokumentasi lengkap:** `SETUP_EMAIL.md`

## Verification

### Test Supabase Connection
```bash
# Check console saat dev server start
npm run dev

# Jika Supabase tidak dikonfigurasi, akan muncul warning:
# ⚠️ Supabase credentials not configured. Document upload will not work.
```

### Test Email
```bash
npm run test:email
```

### Test Upload Dokumen
1. Login ke aplikasi
2. Buka `/pm/documents`
3. Klik "Upload Dokumen"
4. Pilih proyek dan file
5. Upload

**Expected:**
- ✅ File uploaded successfully
- ✅ Dokumen muncul di list
- ✅ File tersimpan di Supabase Storage

**Jika error:**
- ❌ "Supabase is not configured" → Setup Supabase credentials
- ❌ "Failed to upload to storage" → Check bucket 'documents' exists
- ❌ "Project not found" → Buat proyek terlebih dahulu

## Troubleshooting

### Error: "Supabase is not configured"
**Solusi:**
1. Pastikan semua 3 environment variables Supabase sudah diset
2. Restart dev server: `npm run dev`
3. Check console untuk warning

### Error: "Failed to upload to Supabase"
**Solusi:**
1. Verify bucket `documents` exists di Supabase Dashboard
2. Check bucket is set to **public**
3. Verify RLS policies configured
4. Check service_role key is correct

### Upload button tidak muncul
**Solusi:**
- Pastikan user sudah login
- Check user role (semua role bisa upload)

### Dropdown proyek kosong
**Solusi:**
- Buat proyek terlebih dahulu di halaman Projects
- Pastikan user jadi member di proyek

## Production Checklist

- [ ] Database connected
- [ ] NextAuth secret generated
- [ ] Supabase project created
- [ ] Supabase bucket `documents` created & public
- [ ] Supabase RLS policies configured
- [ ] Gmail SMTP configured with App Password
- [ ] All environment variables set
- [ ] Test upload/download/delete documents
- [ ] Test email verification
- [ ] Monitor Supabase storage usage

## Security Notes

⚠️ **NEVER commit `.env` file to Git!**

- `NEXT_PUBLIC_*` variables are exposed to browser
- `SUPABASE_SERVICE_ROLE_KEY` is **SECRET** - only for backend
- `EMAIL_SERVER_PASSWORD` is **SECRET** - use App Password, not real password
- `NEXTAUTH_SECRET` is **SECRET** - generate unique per environment

---

**Need Help?**
- Supabase Setup: `docs/SUPABASE_SETUP.md`
- Email Setup: `SETUP_EMAIL.md`
- Document Feature: `docs/DOCUMENTS_FEATURE.md`
