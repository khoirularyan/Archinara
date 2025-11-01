import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client untuk frontend (dengan RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client untuk backend (bypass RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase // Fallback ke client biasa jika tidak ada service key

/**
 * Upload file to Supabase Storage
 * @param file File to upload
 * @param bucket Bucket name (default: 'avatars')
 * @param folder Folder path (optional)
 * @returns Public URL of uploaded file
 */
export async function uploadToSupabase(
  file: File,
  bucket: string = 'avatars',
  folder?: string
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate unique filename
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(7)
  const ext = file.name.split('.').pop()
  const filename = `${timestamp}-${randomStr}.${ext}`
  
  const path = folder ? `${folder}/${filename}` : filename

  // Upload to Supabase Storage (gunakan admin client untuk bypass RLS)
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete file from Supabase Storage
 * @param url Public URL of the file
 * @param bucket Bucket name (default: 'avatars')
 */
export async function deleteFromSupabase(
  url: string,
  bucket: string = 'avatars'
): Promise<void> {
  // Extract path from URL
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/')
  const bucketIndex = pathParts.indexOf(bucket)
  
  if (bucketIndex === -1) {
    throw new Error('Invalid Supabase URL')
  }

  const path = pathParts.slice(bucketIndex + 1).join('/')

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path])

  if (error) {
    throw new Error(`Failed to delete from Supabase: ${error.message}`)
  }
}
