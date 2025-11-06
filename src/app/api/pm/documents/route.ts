import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToSupabase } from '@/lib/supabase'

// GET /api/pm/documents - Fetch documents (optionally filtered by projectId)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    // Build query
    const where: any = {}
    if (projectId) {
      where.projectId = projectId
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    })

    return NextResponse.json({ documents }, { status: 200 })
  } catch (error) {
    console.error('[API /api/pm/documents] Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/pm/documents - Upload new document
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const name = formData.get('name') as string

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    console.log('[API /api/pm/documents] Uploading file to Supabase:', {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      projectId,
    })

    // Upload to Supabase Storage
    let url: string
    try {
      url = await uploadToSupabase(file, 'documents', projectId)
      console.log('[API /api/pm/documents] File uploaded successfully:', url)
    } catch (uploadError) {
      console.error('[API /api/pm/documents] Supabase upload failed:', uploadError)
      return NextResponse.json(
        { 
          error: 'Failed to upload file to storage',
          details: uploadError instanceof Error ? uploadError.message : 'Unknown storage error'
        },
        { status: 500 }
      )
    }

    // Save to database
    console.log('[API /api/pm/documents] Saving document metadata to database...')
    const document = await prisma.document.create({
      data: {
        name: name || file.name,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url,
        projectId,
        uploadedById: session.user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    console.error('[API /api/pm/documents] Error uploading document:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
