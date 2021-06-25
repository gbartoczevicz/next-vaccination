import { httpClient } from '@/services/http-client';
import { INotificationDTO } from '@/dtos/notification';

export const fetchNotifications = async (): Promise<INotificationDTO[]> => {
  try {
    const { data } = await httpClient.get<INotificationDTO[]>('/notifications');

    return data;
  } catch (err) {
    console.error('Fetch Notifications', err.message);

    return null;
  }
};
