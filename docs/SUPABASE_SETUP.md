# 📦 Supabase Storage Setup untuk Dokumen

## Overview

Aplikasi Archinara PM menggunakan **Supabase Storage** untuk menyimpan dokumen proyek seperti:
- Desain arsitektur (PDF, DWG, AutoCAD)
- RAB dan budget (Excel, CSV)
- Kontrak dan legal documents (PDF, Word)
- Foto progress (JPG, PNG, ZIP)
- Spesifikasi material (Word, PDF)

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Buka [https://supabase.com](https://supabase.com)
2. Sign in atau create account
3. Klik **"New Project"**
4. Isi detail project:
   - **Name**: `archinara-pm`
   - **Database Password**: Generate strong password
   - **Region**: Singapore (closest to Indonesia)
5. Tunggu project selesai dibuat (~2 menit)

### 2. Create Storage Bucket

1. Di Supabase Dashboard, buka **Storage** di sidebar
2. Klik **"New bucket"**
3. Isi detail bucket:
   - **Name**: `documents`
   - **Public bucket**: ✅ **Checked** (agar file bisa diakses via URL)
4. Klik **"Create bucket"**

### 3. Setup Storage Policies (RLS)

Untuk keamanan, kita perlu setup Row Level Security policies:

#### Policy 1: Allow Authenticated Users to Upload

```sql
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');
```

#### Policy 2: Allow Public Read Access

```sql
CREATE POLICY "Allow public read access to documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');
```

#### Policy 3: Allow Users to Delete Their Own Files

```sql
CREATE POLICY "Allow users to delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
```

**Cara menjalankan SQL:**
1. Buka **SQL Editor** di Supabase Dashboard
2. Copy-paste policy di atas
3. Klik **"Run"**

### 4. Get API Credentials

1. Di Supabase Dashboard, buka **Settings** → **API**
2. Copy credentials berikut:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (untuk backend)

### 5. Update Environment Variables

Tambahkan ke file `.env`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ PENTING:**
- `NEXT_PUBLIC_*` = Bisa diakses dari frontend
- `SUPABASE_SERVICE_ROLE_KEY` = **RAHASIA**, hanya untuk backend/API routes

### 6. Restart Development Server

```bash
npm run dev
```

## 📝 Testing Upload

1. Login ke aplikasi
2. Buka halaman **Dokumen** (`/pm/documents`)
3. Klik **"Upload Dokumen"**
4. Pilih proyek dan file
5. Klik **"Upload"**

File akan diupload ke Supabase Storage dan URL-nya disimpan di database PostgreSQL.

## 🔧 Storage Configuration

### File Size Limits

Default Supabase limit: **50 MB per file**

Untuk mengubah limit di aplikasi, edit `/src/app/api/pm/documents/route.ts`:

```typescript
// Check file size (max 50MB)
const maxSize = 50 * 1024 * 1024 // 50MB
if (file.size > maxSize) {
  return NextResponse.json(
    { error: 'File size exceeds 50MB limit' },
    { status: 400 }
  )
}
```

### Supported File Types

Aplikasi mendukung semua file types, tapi UI menampilkan icon khusus untuk:
- **PDF** → Red icon
- **Excel/Spreadsheet** → Green icon
- **Word/Document** → Blue icon
- **ZIP/Compressed** → Purple icon
- **AutoCAD/DWG** → Orange icon
- **Images** → Image icon
- **Others** → Gray icon

### Storage Structure

Files disimpan dengan struktur:

```
documents/
  └── {projectId}/
      ├── 1730000000-abc123.pdf
      ├── 1730000001-def456.xlsx
      └── 1730000002-ghi789.dwg
```

## 🎯 Features

### ✅ Upload Documents
- Multi-format support (PDF, Excel, Word, AutoCAD, ZIP, Images, etc.)
- Auto-generate unique filename
- Store metadata in PostgreSQL
- File stored in Supabase Storage

### ✅ View Documents
- List all documents
- Filter by project
- Show file info (size, uploader, date)
- Display uploader avatar

### ✅ Download Documents
- Direct download via Supabase public URL
- Open in new tab

### ✅ Delete Documents
- Only uploader, ADMIN, or MANAGER can delete
- Removes from both Supabase Storage and database

## 📊 Supabase Free Tier Limits

| Resource | Free Tier Limit |
|----------|----------------|
| Storage | 1 GB |
| Bandwidth | 2 GB/month |
| Database | 500 MB |
| API Requests | Unlimited |

**Untuk production dengan traffic tinggi**, pertimbangkan upgrade ke Pro plan ($25/month).

## 🔐 Security Best Practices

1. **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to Git
2. Use **RLS policies** untuk kontrol akses
3. Validate file types di backend
4. Limit file size untuk prevent abuse
5. Scan uploaded files untuk malware (optional, gunakan service seperti VirusTotal)

## 🐛 Troubleshooting

### Error: "Failed to upload to Supabase"

**Penyebab:**
- Bucket `documents` belum dibuat
- RLS policies belum disetup
- Credentials salah

**Solusi:**
1. Cek bucket exists di Supabase Dashboard
2. Verify RLS policies
3. Double-check `.env` credentials

### Error: "File size exceeds limit"

**Solusi:**
- Compress file sebelum upload
- Atau increase limit di code (max 50MB recommended)

### Files tidak bisa diakses (404)

**Penyebab:**
- Bucket tidak public
- RLS policy untuk SELECT tidak ada

**Solusi:**
1. Set bucket sebagai public
2. Add RLS policy untuk public read access

## 📚 Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## ✅ Production Checklist

- [ ] Supabase project created
- [ ] `documents` bucket created and set to public
- [ ] RLS policies configured
- [ ] Environment variables set in `.env`
- [ ] Test upload/download/delete functionality
- [ ] Monitor storage usage
- [ ] Setup backup strategy (Supabase auto-backup included)

---

**Need Help?** Check Supabase Dashboard → **Logs** untuk error details.
