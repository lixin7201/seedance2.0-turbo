import { respData, respErr } from '@/shared/lib/resp';
import {
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsRead,
} from '@/shared/models/notification';
import { getUserInfo } from '@/shared/models/user';

export async function GET(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const [notifications, unreadCount] = await Promise.all([
      getNotifications({ userId: user.id, page, limit }),
      getUnreadNotificationsCount(user.id),
    ]);

    return respData({ notifications, unreadCount });
  } catch (e: any) {
    console.log('get notifications failed', e);
    return respErr(e.message);
  }
}

// Mark all notifications as read
export async function PUT(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    await markAllNotificationsRead(user.id);
    return respData({ success: true });
  } catch (e: any) {
    console.log('mark all read failed', e);
    return respErr(e.message);
  }
}
