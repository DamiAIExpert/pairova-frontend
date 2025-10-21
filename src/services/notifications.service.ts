// src/services/notifications.service.ts
// Notification API services for job finder

import { apiClient, type PaginationParams } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  readAt?: string;
  createdAt: string;
}

export const NotificationType = {
  JOB_MATCH: 'JOB_MATCH',
  APPLICATION_UPDATE: 'APPLICATION_UPDATE',
  MESSAGE: 'MESSAGE',
  INTERVIEW: 'INTERVIEW',
  SYSTEM: 'SYSTEM',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminders: boolean;
  emailJobMatches: boolean;
  emailApplicationUpdates: boolean;
  emailInterviews: boolean;
  emailMessages: boolean;
  emailSystem: boolean;
  pushJobMatches: boolean;
  pushApplicationUpdates: boolean;
  pushInterviews: boolean;
  pushMessages: boolean;
  pushSystem: boolean;
  smsJobMatches: boolean;
  smsApplicationUpdates: boolean;
  smsInterviews: boolean;
  smsMessages: boolean;
  smsSystem: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

export class NotificationsService {
  // Get user notifications
  static async getNotifications(params: PaginationParams & { unreadOnly?: boolean } = {}): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  }> {
    const response = await apiClient.get<{
      notifications: Notification[];
      total: number;
      page: number;
      limit: number;
      unreadCount: number;
    }>('/notifications', params);
    return response.data;
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(`/notifications/${notificationId}/read`);
    return response.data;
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<{ message: string; count: number }> {
    const response = await apiClient.put<{ message: string; count: number }>('/notifications/read-all');
    return response.data;
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/notifications/${notificationId}`);
    return response.data;
  }

  // Get notification statistics
  static async getStats(): Promise<NotificationStats> {
    const response = await apiClient.get<NotificationStats>('/notifications/stats');
    return response.data;
  }

  // Get notification preferences
  static async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<NotificationPreferences>('/notifications/preferences');
    return response.data;
  }

  // Update notification preferences
  static async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>('/notifications/preferences', preferences);
    return response.data;
  }

  // Send email notification (for testing)
  static async sendEmail(emailData: {
    to: string;
    subject: string;
    template?: string;
    html?: string;
    data?: any;
  }): Promise<{ message: string; messageId?: string }> {
    const response = await apiClient.post<{ message: string; messageId?: string }>('/notifications/email', emailData);
    return response.data;
  }

  // Create reminder
  static async createReminder(reminderData: {
    title: string;
    description?: string;
    remindAt: string;
    type: string;
  }): Promise<{ message: string; reminderId: string }> {
    const response = await apiClient.post<{ message: string; reminderId: string }>('/notifications/reminders', reminderData);
    return response.data;
  }

  // Get reminders
  static async getReminders(params: PaginationParams & { status?: string } = {}): Promise<{
    reminders: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await apiClient.get<{
      reminders: any[];
      total: number;
      page: number;
      limit: number;
    }>('/notifications/reminders', params);
    return response.data;
  }

  // Update reminder
  static async updateReminder(reminderId: string, updateData: { status: string; completedAt?: string }): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(`/notifications/reminders/${reminderId}`, updateData);
    return response.data;
  }

  // Delete reminder
  static async deleteReminder(reminderId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/notifications/reminders/${reminderId}`);
    return response.data;
  }
}
