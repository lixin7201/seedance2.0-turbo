import { and, count, desc, eq, isNull } from 'drizzle-orm';

import { db } from '@/core/db';
import { notification } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type Notification = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;

export enum NotificationType {
  TASK_SUCCESS = 'task_success',
  TASK_FAILED = 'task_failed',
}

// Create a notification
export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  content?: string;
  taskId?: string;
}) {
  const newNotification: NewNotification = {
    id: getUuid(),
    userId: data.userId,
    type: data.type,
    title: data.title,
    content: data.content,
    taskId: data.taskId,
  };

  const [result] = await db()
    .insert(notification)
    .values(newNotification)
    .returning();

  return result;
}

// Get notifications for a user
export async function getNotifications({
  userId,
  page = 1,
  limit = 30,
}: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<Notification[]> {
  const result = await db()
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return result;
}

// Get unread notifications count
export async function getUnreadNotificationsCount(
  userId: string
): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(notification)
    .where(
      and(
        eq(notification.userId, userId),
        isNull(notification.readAt)
      )
    );

  return result?.count || 0;
}

// Mark a single notification as read
export async function markNotificationRead(id: string, userId: string) {
  const [result] = await db()
    .update(notification)
    .set({ readAt: new Date() })
    .where(
      and(eq(notification.id, id), eq(notification.userId, userId))
    )
    .returning();

  return result;
}

// Mark all notifications as read for a user
export async function markAllNotificationsRead(userId: string) {
  await db()
    .update(notification)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notification.userId, userId),
        isNull(notification.readAt)
      )
    );
}
