import { apiClient } from './api';

export interface ApplicationStatus {
  PENDING: 'PENDING';
  REVIEWED: 'REVIEWED';
  SHORTLISTED: 'SHORTLISTED';
  INTERVIEWED: 'INTERVIEWED';
  ACCEPTED: 'ACCEPTED';
  REJECTED: 'REJECTED';
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status: keyof ApplicationStatus;
  coverLetter: string | null;
  resumeUrl: string | null;
  matchScore: number | null;
  notes: string | null;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  applicant: {
    id: string;
    email: string;
    applicantProfile?: {
      firstName: string;
      lastName: string;
      photoUrl?: string;
      phone?: string;
      city?: string;
      state?: string;
      country?: string;
      bio?: string;
      skills?: string[];
      experience?: any[];
      education?: any[];
    };
  };
  job: {
    id: string;
    title: string;
    description: string;
    employmentType: string;
    locationCity: string;
    locationState: string;
    locationCountry: string;
  };
}

export interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}

export interface ApplicationStatistics {
  totalApplications: number;
  pendingApplications: number;
  reviewedApplications: number;
  shortlistedApplications: number;
  interviewedApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  applicationsThisMonth: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ApplicationPipeline {
  stages: PipelineStage[];
  recentActivity: any[];
  topPerformingJobs: any[];
}

class ApplicationsService {
  /**
   * Get all applications for the current nonprofit's jobs
   */
  async getNonprofitApplications(
    params?: {
      status?: string;
      jobId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApplicationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.jobId) queryParams.append('jobId', params.jobId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get<ApplicationsResponse>(
      `/ngos/me/applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    return response.data;
  }

  /**
   * Get a specific application by ID
   */
  async getApplication(applicationId: string): Promise<Application> {
    const response = await apiClient.get<Application>(
      `/ngos/me/applications/${applicationId}`
    );
    return response.data;
  }

  /**
   * Update an application status
   */
  async updateApplicationStatus(
    applicationId: string,
    data: {
      status: string;
      notes?: string;
      interviewDate?: Date;
      rejectionReason?: string;
    }
  ): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `/ngos/me/applications/${applicationId}/status`,
      data
    );
    return response.data || { message: response.message || 'Status updated successfully' };
  }

  /**
   * Get application statistics
   */
  async getApplicationStatistics(): Promise<ApplicationStatistics> {
    const response = await apiClient.get<ApplicationStatistics>(
      '/ngos/me/applications/statistics'
    );
    return response.data;
  }

  /**
   * Get application pipeline overview
   */
  async getApplicationPipeline(): Promise<ApplicationPipeline> {
    const response = await apiClient.get<ApplicationPipeline>(
      '/ngos/me/applications/pipeline'
    );
    return response.data;
  }

  /**
   * Bulk update application statuses
   */
  async bulkUpdateApplicationStatus(
    applicationIds: string[],
    status: string,
    notes?: string
  ): Promise<{ message: string; updatedCount: number }> {
    const response = await apiClient.put<{ message: string; updatedCount: number }>(
      '/ngos/me/applications/bulk-status',
      { applicationIds, status, notes }
    );
    return response.data || { message: response.message || 'Statuses updated successfully', updatedCount: 0 };
  }
}

export const applicationsService = new ApplicationsService();

