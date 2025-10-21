// src/services/index.ts
// Export all API services

export { apiClient, authUtils, handleApiError, type ApiResponse, type PaginationParams, type ApiError } from './api';
export { AuthService, type AuthResponse, type LoginRequest, type RegisterRequest, type UserProfile, Role } from './auth.service';
export { JobsService, type Job, type CreateJobRequest, type JobSearchParams, type JobSearchResult, type Application, JobPlacement, EmploymentType, JobStatus, ApplicationStatus } from './jobs.service';
export { NotificationsService, type Notification, type NotificationPreferences, type NotificationStats, NotificationType } from './notifications.service';
