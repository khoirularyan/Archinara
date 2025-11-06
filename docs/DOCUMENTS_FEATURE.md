# 📄 Document Management Feature

## Overview

Fitur Document Management memungkinkan tim untuk:
- **Upload** dokumen proyek ke Supabase Storage
- **View** semua dokumen dengan filter per proyek
- **Download** dokumen langsung dari cloud
- **Delete** dokumen (dengan permission control)

## 🎯 Use Cases

### 1. Architect
- Upload desain arsitektur (PDF, DWG, AutoCAD)
- Share drawing dengan team
- Version control manual via filename

### 2. Manager
- Upload RAB dan budget (Excel)
- Upload kontrak klien (PDF, Word)
- Monitor semua dokumen proyek

### 3. Drafter
- Upload hasil drafting (DWG, PDF)
- Download reference drawings
- Update progress drawings

### 4. Field Worker
- Upload foto progress (JPG, PNG, ZIP)
- Download spesifikasi material
- View construction drawings

## 🏗️ Architecture

```
Frontend (Next.js)
    ↓
API Routes (/api/pm/documents)
    ↓
Supabase Storage (Cloud Storage)
    ↓
PostgreSQL (Metadata)
```

### Data Flow

**Upload:**
1. User selects file + project
2. Frontend sends FormData to API
3. API uploads file to Supabase Storage
4. Supabase returns public URL
5. API saves metadata (name, size, URL, etc.) to PostgreSQL
6. Frontend updates UI

**Download:**
1. User clicks download button
2. Opens Supabase public URL in new tab
3. Browser downloads file directly from Supabase

**Delete:**
1. User clicks delete (with confirmation)
2. API checks permission (uploader/ADMIN/MANAGER)
3. API deletes from Supabase Storage
4. API deletes metadata from PostgreSQL
5. Frontend updates UI

## 📁 File Structure

```
src/
├── app/
│   ├── (pm)/pm/documents/
│   │   └── page.tsx                    # Document management UI
│   └── api/pm/documents/
│       ├── route.ts                    # GET (list) & POST (upload)
│       └── [id]/route.ts               # DELETE (remove)
├── lib/
│   └── supabase.ts                     # Supabase client & helpers
└── prisma/
    └── schema.prisma                   # Document model
```

## 🗄️ Database Schema

```prisma
model Document {
  id           String   @id @default(cuid())
  name         String                    // Display name
  fileName     String                    // Original filename
  fileSize     Int                       // Size in bytes
  mimeType     String                    // MIME type
  url          String                    // Supabase public URL
  projectId    String                    // Related project
  uploadedById String                    // Uploader user ID
  uploadedAt   DateTime @default(now())  // Upload timestamp

  project    Project @relation(...)
  uploadedBy User    @relation(...)
}
```

## 🔌 API Endpoints

### GET /api/pm/documents

**Query Parameters:**
- `projectId` (optional) - Filter by project

**Response:**
```json
{
  "documents": [
    {
      "id": "clxxx",
      "name": "Desain Villa.pdf",
      "fileName": "villa-design-v2.pdf",
      "fileSize": 2621440,
      "mimeType": "application/pdf",
      "url": "https://xxx.supabase.co/storage/v1/object/public/documents/...",
      "projectId": "clyyy",
      "uploadedAt": "2025-01-05T10:30:00Z",
      "uploadedBy": {
        "id": "clzzz",
        "name": "Siti Nurhaliza",
        "email": "siti@example.com",
        "image": "https://..."
      },
      "project": {
        "id": "clyyy",
        "name": "Renovasi Villa Bali"
      }
    }
  ]
}
```

### POST /api/pm/documents

**Content-Type:** `multipart/form-data`

**Body:**
- `file` (File) - File to upload
- `projectId` (string) - Project ID
- `name` (string, optional) - Display name (defaults to filename)

**Response:**
```json
{
  "document": {
    "id": "clxxx",
    "name": "Desain Villa.pdf",
    ...
  }
}
```

**Errors:**
- `400` - Missing file or projectId
- `400` - File size exceeds 50MB
- `404` - Project not found
- `500` - Upload failed

### DELETE /api/pm/documents/[id]

**Permission:** Uploader, ADMIN, or MANAGER only

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (no permission)
- `404` - Document not found
- `500` - Delete failed

## 🎨 UI Components

### Document List
- Card-based layout
- File type icon (PDF, Excel, Word, etc.)
- File metadata (size, uploader, date)
- Project filter buttons
- Download & delete actions

### Upload Dialog
- Project selector
- File input with preview
- Optional custom name
- Upload progress indicator

### File Type Icons
- **PDF** → Red document icon
- **Excel** → Green spreadsheet icon
- **Word** → Blue document icon
- **ZIP** → Purple folder icon
- **AutoCAD** → Orange grid icon
- **Image** → Image icon
- **Others** → Gray document icon

## 🔐 Permissions

| Action | USER | DRAFTER | ARCHITECT | MANAGER | ADMIN |
|--------|------|---------|-----------|---------|-------|
| View documents | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload documents | ✅ | ✅ | ✅ | ✅ | ✅ |
| Download documents | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete own documents | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete any documents | ❌ | ❌ | ❌ | ✅ | ✅ |

## 🚀 Usage Examples

### Upload Document (Frontend)

```typescript
const handleUpload = async (file: File, projectId: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('projectId', projectId)
  formData.append('name', 'Custom Name')

  const res = await fetch('/api/pm/documents', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (res.ok) {
    console.log('Uploaded:', data.document)
  }
}
```

### Delete Document (Frontend)

```typescript
const handleDelete = async (documentId: string) => {
  if (!confirm('Delete this document?')) return

  const res = await fetch(`/api/pm/documents/${documentId}`, {
    method: 'DELETE',
  })

  if (res.ok) {
    console.log('Deleted successfully')
  }
}
```

## 📊 Storage Limits

### Supabase Free Tier
- **Storage:** 1 GB
- **Bandwidth:** 2 GB/month
- **File size:** 50 MB per file (configurable)

### Recommendations
- Compress large files before upload
- Use ZIP for multiple files
- Monitor storage usage in Supabase Dashboard
- Upgrade to Pro ($25/month) for production

## 🔧 Configuration

### Change File Size Limit

Edit `/src/app/api/pm/documents/route.ts`:

```typescript
const maxSize = 100 * 1024 * 1024 // 100MB
```

### Add File Type Restrictions

```typescript
const allowedTypes = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
]

if (!allowedTypes.includes(file.type)) {
  return NextResponse.json(
    { error: 'File type not allowed' },
    { status: 400 }
  )
}
```

## 🐛 Common Issues

### Upload fails with "Failed to upload to Supabase"

**Solution:**
1. Check Supabase credentials in `.env`
2. Verify `documents` bucket exists
3. Check RLS policies are configured

### Files return 404 when accessed

**Solution:**
1. Make sure bucket is set to **public**
2. Add RLS policy for public SELECT access

### "Permission denied" when deleting

**Solution:**
- Only uploader, ADMIN, or MANAGER can delete
- Check user role in session

## 📈 Future Enhancements

- [ ] **File versioning** - Track document versions
- [ ] **Preview** - In-app PDF/image preview
- [ ] **Search** - Full-text search in documents
- [ ] **Categories** - Tag documents (Design, Budget, Legal, etc.)
- [ ] **Comments** - Add comments to documents
- [ ] **Notifications** - Notify team when new document uploaded
- [ ] **Bulk upload** - Upload multiple files at once
- [ ] **Folder structure** - Organize documents in folders
- [ ] **Share links** - Generate temporary share links
- [ ] **OCR** - Extract text from scanned documents

## 📚 Related Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Database Schema](../prisma/schema.prisma)
- [API Documentation](./API.md)

---

**Questions?** Contact the development team or check Supabase Dashboard logs for errors.
