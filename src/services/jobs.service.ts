// src/services/jobs.service.ts
// Jobs API services for job finder

import { apiClient, type PaginationParams } from './api';

// Types for jobs
export interface Job {
  id: string;
  title: string;
  description: string;
  placement?: JobPlacement;
  employmentType?: EmploymentType;
  experienceMinYrs?: number;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status: JobStatus;
  nonprofitId: string;
  nonprofit: {
    id: string;
    orgName: string;
    logoUrl?: string;
  };
  applications?: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  placement?: JobPlacement;
  employmentType?: EmploymentType;
  experienceMinYrs?: number;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
}

export interface JobSearchParams extends PaginationParams {
  search?: string;
  location?: string;
  employmentType?: EmploymentType;
  placement?: JobPlacement;
  experienceMinYrs?: number;
  salaryMin?: number;
  salaryMax?: number;
  nonprofitId?: string;
  status?: JobStatus;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  filters: {
    locations: string[];
    employmentTypes: EmploymentType[];
    placements: JobPlacement[];
    experienceRanges: { min: number; max: number }[];
    salaryRanges: { min: number; max: number }[];
  };
}

// Enums as const objects
export const JobPlacement = {
  ONSITE: 'ONSITE',
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
} as const;

export type JobPlacement = typeof JobPlacement[keyof typeof JobPlacement];

export const EmploymentType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP',
  VOLUNTEER: 'VOLUNTEER',
} as const;

export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];

export const JobStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUploadId?: string;
  matchScore?: number;
  appliedAt: string;
  updatedAt: string;
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const ApplicationStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEWED: 'INTERVIEWED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export class JobsService {
  // Job management endpoints
  static async getJobs(params: JobSearchParams = {}): Promise<JobSearchResult> {
    const response = await apiClient.get<JobSearchResult>('/jobs', params);
    return response.data;
  }

  static async getJob(jobId: string): Promise<Job> {
    const response = await apiClient.get<Job>(`/jobs/${jobId}`);
    return response.data;
  }

  static async createJob(jobData: CreateJobRequest): Promise<Job> {
    const response = await apiClient.post<Job>('/jobs', jobData);
    return response.data;
  }

  static async updateJob(jobId: string, jobData: Partial<CreateJobRequest>): Promise<Job> {
    const response = await apiClient.put<Job>(`/jobs/${jobId}`, jobData);
    return response.data;
  }

  static async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/jobs/${jobId}`);
  }

  static async publishJob(jobId: string): Promise<Job> {
    const response = await apiClient.patch<Job>(`/jobs/${jobId}/publish`);
    return response.data;
  }

  static async closeJob(jobId: string): Promise<Job> {
    const response = await apiClient.patch<Job>(`/jobs/${jobId}/close`);
    return response.data;
  }

  // Job search endpoints
  static async searchJobs(params: JobSearchParams = {}): Promise<JobSearchResult> {
    const response = await apiClient.get<JobSearchResult>('/jobs/search', params);
    return response.data;
  }

  static async getRecommendedJobs(params: PaginationParams = {}): Promise<Job[]> {
    const response = await apiClient.get<Job[]>('/jobs/recommended', params);
    return response.data;
  }

  static async getFeaturedJobs(params: PaginationParams = {}): Promise<Job[]> {
    const response = await apiClient.get<Job[]>('/jobs/featured', params);
    return response.data;
  }

  // Application endpoints
  static async applyForJob(applicationData: {
    jobId: string;
    coverLetter?: string;
    resumeUploadId?: string;
  }): Promise<Application> {
    const response = await apiClient.post<Application>('/applications', applicationData);
    return response.data;
  }

  static async getMyApplications(params: PaginationParams = {}): Promise<{
    applications: Application[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await apiClient.get<{
      applications: Application[];
      total: number;
      page: number;
      limit: number;
    }>('/applications', params);
    return response.data;
  }

  static async getApplication(applicationId: string): Promise<Application> {
    const response = await apiClient.get<Application>(`/applications/${applicationId}`);
    return response.data;
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<Application> {
    const response = await apiClient.patch<Application>(`/applications/${applicationId}/status`, {
      status,
      notes,
    });
    return response.data;
  }

  // Saved jobs endpoints
  static async getSavedJobs(params: PaginationParams = {}): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await apiClient.get<{
      jobs: Job[];
      total: number;
      page: number;
      limit: number;
    }>('/saved-jobs', params);
    return response.data;
  }

  static async saveJob(jobId: string): Promise<void> {
    await apiClient.post(`/saved-jobs/${jobId}`);
  }

  static async unsaveJob(jobId: string): Promise<void> {
    await apiClient.delete(`/saved-jobs/${jobId}`);
  }

  static async isJobSaved(jobId: string): Promise<boolean> {
    const response = await apiClient.get<{ isSaved: boolean }>(`/saved-jobs/${jobId}/status`);
    return response.data.isSaved;
  }
}
