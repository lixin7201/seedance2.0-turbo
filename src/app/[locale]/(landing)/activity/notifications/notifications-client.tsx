'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/core/i18n/navigation';
import { toast } from 'sonner';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string | null;
  taskId: string | null;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationsClient({
  initialNotifications,
  initialUnreadCount,
  translations,
}: {
  initialNotifications: Notification[];
  initialUnreadCount: number;
  translations: {
    title: string;
    mark_all_read: string;
    empty: string;
    view_task: string;
  };
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const markAsRead = async (id: string) => {
    try {
      const resp = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (resp.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, readAt: new Date().toISOString() } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      const resp = await fetch('/api/notifications', {
        method: 'PUT',
      });
      if (resp.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
        );
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{translations.title}</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:underline"
          >
            {translations.mark_all_read} ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {translations.empty}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 transition-colors cursor-pointer ${
                notification.readAt
                  ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                  : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
              }`}
              onClick={() => {
                if (!notification.readAt) {
                  markAsRead(notification.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!notification.readAt && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <h3 className="font-medium">
                      {notification.type === 'task_success' ? '✅ ' : '❌ '}
                      {notification.title}
                    </h3>
                  </div>
                  {notification.content && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {notification.content}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {notification.taskId && (
                  <Link
                    href="/activity/ai-tasks"
                    className="ml-4 text-sm text-blue-500 hover:underline"
                  >
                    {translations.view_task}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
