import { prisma } from './prisma'

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type?: NotificationType
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

/**
 * Create notifications for multiple users
 */
export async function createNotifications(
  notifications: CreateNotificationParams[]
) {
  try {
    const result = await prisma.notification.createMany({
      data: notifications,
    })
    return result
  } catch (error) {
    console.error('Error creating notifications:', error)
    return null
  }
}

/**
 * Notify all admins and managers
 */
export async function notifyAdminsAndManagers(title: string, message: string, type: NotificationType = 'INFO') {
  try {
    console.log('[Notifications] Finding admins and managers...')
    const adminsAndManagers = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MANAGER'],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
    })

    console.log(`[Notifications] Found ${adminsAndManagers.length} admins/managers:`, 
      adminsAndManagers.map(u => `${u.name} (${u.role})`))

    if (adminsAndManagers.length === 0) {
      console.warn('[Notifications] No admins or managers found to notify')
      return null
    }

    const notifications = adminsAndManagers.map((user) => ({
      userId: user.id,
      title,
      message,
      type,
    }))

    console.log('[Notifications] Creating notifications:', notifications.length)
    const result = await createNotifications(notifications)
    console.log('[Notifications] Notifications created:', result)
    
    return result
  } catch (error) {
    console.error('[Notifications] Error notifying admins and managers:', error)
    return null
  }
}
