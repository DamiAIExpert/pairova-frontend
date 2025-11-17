import { apiClient } from './api';

export const FeedbackCategory = {
  BUG_REPORT: 'BUG_REPORT',
  FEATURE_REQUEST: 'FEATURE_REQUEST',
  USER_EXPERIENCE: 'USER_EXPERIENCE',
  PERFORMANCE: 'PERFORMANCE',
  SECURITY: 'SECURITY',
  GENERAL: 'GENERAL',
} as const;

export type FeedbackCategory = typeof FeedbackCategory[keyof typeof FeedbackCategory];

export interface CreateContactRequest {
  fullName: string;
  email: string;
  phone: string;
  messageType: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  userEmail: string;
  userName: string;
  createdAt: string;
}

class SupportService {
  /**
   * Submit a contact form / support request
   */
  async submitContactForm(data: CreateContactRequest): Promise<ContactResponse> {
    // Map message type to feedback category
    const categoryMap: Record<string, FeedbackCategory> = {
      'General Support': FeedbackCategory.GENERAL,
      'Technical Issue': FeedbackCategory.BUG_REPORT,
      'Account Setup Help': FeedbackCategory.GENERAL,
      'Job Posting Question': FeedbackCategory.GENERAL,
      'Billing & Pricing': FeedbackCategory.GENERAL,
      'Feature Request': FeedbackCategory.FEATURE_REQUEST,
      'Report a Problem': FeedbackCategory.BUG_REPORT,
      'Partnership Inquiry': FeedbackCategory.GENERAL,
    };

    const category = categoryMap[data.messageType] || FeedbackCategory.GENERAL;

    const payload = {
      title: `${data.messageType || 'Support Request'} - ${data.fullName}`,
      description: data.message,
      category,
      userEmail: data.email,
      userName: data.fullName,
      metadata: {
        phone: data.phone,
        messageType: data.messageType,
        source: 'help-center',
        submittedAt: new Date().toISOString(),
      },
    };

    const response = await apiClient.post<ContactResponse>('/feedback', payload);
    return response.data;
  }
}

export const supportService = new SupportService();












