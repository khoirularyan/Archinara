import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromSupabase } from '@/lib/supabase'

// DELETE /api/pm/documents/[id] - Delete document
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = params.id

    // Find document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check permission (only uploader, ADMIN, or MANAGER can delete)
    const userRole = session.user.role
    const isUploader = document.uploadedById === session.user.id
    const canDelete = isUploader || userRole === 'ADMIN' || userRole === 'MANAGER'

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have permission to delete this document' },
        { status: 403 }
      )
    }

    // Delete from Supabase Storage
    try {
      await deleteFromSupabase(document.url, 'documents')
    } catch (storageError) {
      console.error('[API /api/pm/documents/[id]] Error deleting from storage:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId },
    })

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API /api/pm/documents/[id]] Error deleting document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
