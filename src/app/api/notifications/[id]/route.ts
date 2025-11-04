import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/notifications/[id] - Mark as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notification = await prisma.notification.update({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user owns this notification
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json({ notification }, { status: 200 })
  } catch (error) {
    console.error('[API /api/notifications/[id]] Error updating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications/[id] - Delete single notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.notification.delete({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user owns this notification
      },
    })

    return NextResponse.json({ message: 'Notification deleted' }, { status: 200 })
  } catch (error) {
    console.error('[API /api/notifications/[id]] Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
