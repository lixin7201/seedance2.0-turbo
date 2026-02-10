import { respData, respErr } from '@/shared/lib/resp';
import { markNotificationRead } from '@/shared/models/notification';
import { getUserInfo } from '@/shared/models/user';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return respErr('invalid params');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const result = await markNotificationRead(id, user.id);
    if (!result) {
      return respErr('notification not found');
    }

    return respData({ success: true });
  } catch (e: any) {
    console.log('mark notification read failed', e);
    return respErr(e.message);
  }
}
