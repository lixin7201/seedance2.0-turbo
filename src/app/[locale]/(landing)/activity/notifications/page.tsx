import { getTranslations } from 'next-intl/server';

import { getNotifications, getUnreadNotificationsCount } from '@/shared/models/notification';
import { getUserInfo } from '@/shared/models/user';
import { Empty } from '@/shared/blocks/common';
import NotificationsClient from './notifications-client';

export default async function NotificationsPage() {
  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const t = await getTranslations('activity.notifications');

  const [notifications, unreadCount] = await Promise.all([
    getNotifications({ userId: user.id, limit: 50 }),
    getUnreadNotificationsCount(user.id),
  ]);

  return (
    <NotificationsClient
      initialNotifications={JSON.parse(JSON.stringify(notifications))}
      initialUnreadCount={unreadCount}
      translations={{
        title: t('title'),
        mark_all_read: t('mark_all_read'),
        empty: t('empty'),
        view_task: t('view_task'),
      }}
    />
  );
}
