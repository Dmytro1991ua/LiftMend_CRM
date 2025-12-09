export type NotificationPayload = {
  jobId: string;
  category: string;
  message: string;
  priority: string;
  userId?: string | null;
};
