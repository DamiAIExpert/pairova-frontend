// src/lib/services/job.service.ts
// Job finder API services

import { apiClient, PaginationParams } from '../api';

// Types for job finder
export interface JobSearchFilters {
  search?: string;
  location?: string;
  employmentType?: string;
  placement?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  ngoId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface JobSearchResult {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  placement: string;
  status: string;
  postedAt: string;
  deadline?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel?: string;
  requiredSkills: string[];
  benefits?: string[];
  ngoId: string;
  orgName: string;
  orgLogoUrl?: string;
  orgLocation: string;
  orgSize?: string;
  applicantCount: number;
  daysSincePosted: number;
  isBookmarked?: boolean;
  matchScore?: number;
  applicationStatus?: string;
}

export interface JobSearchResponse {
  data: JobSearchResult[];
  total: number;
  page: number;
  limit: number;
  query: string;
  filters: JobSearchFilters;
  metadata: {
    searchTime: number;
    hasMore: boolean;
    totalPages: number;
  };
}

export interface JobDetail extends JobSearchResult {
  fullDescription: string;
  qualifications: string[];
  responsibilities: string[];
  companyOverview: {
    size: string;
    type: string;
    sector: string;
    founded: string;
    industry: string;
    location: string;
    mission: string;
  };
  requiredSkills: {
    hardSkills: string[];
    softSkills: string[];
    technicalSkills: string[];
  };
}

export interface MatchScore {
  score: number;
  breakdown: {
    skills: {
      score: number;
      matched: string[];
      missing: string[];
    };
    experience: {
      score: number;
      level: string;
      years: number;
    };
    location: {
      score: number;
      match: boolean;
      distance?: number;
    };
    preferences: {
      score: number;
      employmentType: boolean;
      placement: boolean;
    };
  };
  explanations: string[];
  recommendations: string[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  calculatedAt: string;
}

export interface JobRecommendation {
  jobId: string;
  title: string;
  orgName: string;
  matchScore: number;
  reasoning: string[];
  matchingFactors: {
    skills: string[];
    location: boolean;
    experience: boolean;
    preferences: boolean;
  };
  concerns: string[];
  location: string;
  employmentType: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
}

export interface JobRecommendations {
  applicantId: string;
  recommendations: JobRecommendation[];
  total: number;
  algorithm: string;
  generatedAt: string;
  personalizationLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class JobService {
  // Job search endpoints
  static async searchJobs(params: PaginationParams & JobSearchFilters = {}): Promise<JobSearchResponse> {
    const response = await apiClient.get<JobSearchResponse>('/jobs/search', params);
    return response.data;
  }

  static async getRecommendedJobs(applicantId: string, limit: number = 10): Promise<JobRecommendations> {
    const response = await apiClient.get<JobRecommendations>(`/ai/recommendations/${applicantId}`, { limit });
    return response.data;
  }

  static async getTrendingJobs(params: PaginationParams = {}): Promise<JobSearchResponse> {
    const response = await apiClient.get<JobSearchResponse>('/jobs/search/trending', params);
    return response.data;
  }

  static async getSearchFilters() {
    const response = await apiClient.get('/jobs/search/filters');
    return response.data;
  }

  static async getSimilarJobs(jobId: string, params: PaginationParams = {}): Promise<JobSearchResponse> {
    const response = await apiClient.get<JobSearchResponse>(`/jobs/search/similar/${jobId}`, params);
    return response.data;
  }

  static async getNearbyJobs(params: PaginationParams & { 
    latitude: number; 
    longitude: number; 
    radius?: number; 
  }): Promise<JobSearchResponse> {
    const response = await apiClient.get<JobSearchResponse>('/jobs/search/nearby', params);
    return response.data;
  }

  // Job details
  static async getJobDetails(jobId: string): Promise<JobDetail> {
    const response = await apiClient.get<JobDetail>(`/jobs/${jobId}`);
    return response.data;
  }

  // AI Match scoring
  static async calculateMatchScore(applicantId: string, jobId: string): Promise<MatchScore> {
    const response = await apiClient.post<MatchScore>('/ai/calculate-score', {
      applicantId,
      jobId,
    });
    return response.data;
  }

  static async getMatchInsights(applicantId: string) {
    const response = await apiClient.get(`/ai/match-insights/${applicantId}`);
    return response.data;
  }

  // Job applications
  static async applyToJob(jobId: string, applicationData: {
    coverLetter?: string;
    resumeUrl?: string;
  }) {
    const response = await apiClient.post(`/applications`, {
      jobId,
      ...applicationData,
    });
    return response.data;
  }

  static async getMyApplications(params: PaginationParams = {}) {
    const response = await apiClient.get('/applications', params);
    return response.data;
  }

  static async getApplication(applicationId: string) {
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data;
  }

  static async withdrawApplication(applicationId: string) {
    const response = await apiClient.delete(`/applications/${applicationId}`);
    return response.data;
  }

  // Bookmarking (if implemented)
  static async bookmarkJob(jobId: string) {
    const response = await apiClient.post(`/jobs/${jobId}/bookmark`);
    return response.data;
  }

  static async unbookmarkJob(jobId: string) {
    const response = await apiClient.delete(`/jobs/${jobId}/bookmark`);
    return response.data;
  }

  static async getBookmarkedJobs(params: PaginationParams = {}) {
    const response = await apiClient.get('/jobs/bookmarked', params);
    return response.data;
  }
}

