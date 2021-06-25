export interface INotificationDTO {
  id: string;
  content: string;
  type: NotificationType;
}

export type NotificationCollectionDTO = Array<INotificationDTO>;

export type NotificationType = 'FIRST_ACCESS' | 'LOW_STOCK' | 'MEDIUM_STOCK' | 'APPOINTMENT_CANCELLED';
