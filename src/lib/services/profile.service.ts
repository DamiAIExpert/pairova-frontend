// src/lib/services/profile.service.ts
// Profile management API services for job finder

import { apiClient, PaginationParams } from '../api';

export interface ApplicantProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dob?: string;
  bio?: string;
  country: string;
  state?: string;
  city: string;
  photoUrl?: string;
  portfolioUrl?: string;
  phone?: string;
  skills?: string[];
  experienceLevel?: string;
  preferredEmploymentType?: string;
  preferredPlacement?: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NonprofitProfile {
  id: string;
  userId: string;
  orgName: string;
  logoUrl?: string;
  website?: string;
  mission?: string;
  values?: string;
  sizeLabel?: string;
  orgType?: string;
  industry?: string;
  foundedOn?: string;
  taxId?: string;
  country: string;
  state?: string;
  city: string;
  addressLine1?: string;
  addressLine2?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  applicantId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  applicantId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  applicantId: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export class ProfileService {
  // Applicant profile management
  static async getApplicantProfile(): Promise<ApplicantProfile> {
    const response = await apiClient.get<ApplicantProfile>('/profiles/applicant/me');
    return response.data;
  }

  static async updateApplicantProfile(data: Partial<ApplicantProfile>): Promise<ApplicantProfile> {
    const response = await apiClient.put<ApplicantProfile>('/profiles/applicant/me', data);
    return response.data;
  }

  // Nonprofit profile management
  static async getNonprofitProfile(): Promise<NonprofitProfile> {
    const response = await apiClient.get<NonprofitProfile>('/profiles/nonprofit/me');
    return response.data;
  }

  static async updateNonprofitProfile(data: Partial<NonprofitProfile>): Promise<NonprofitProfile> {
    const response = await apiClient.put<NonprofitProfile>('/profiles/nonprofit/me', data);
    return response.data;
  }

  // Education management
  static async getEducation(): Promise<Education[]> {
    const response = await apiClient.get<Education[]>('/profiles/education');
    return response.data;
  }

  static async addEducation(data: Omit<Education, 'id' | 'applicantId' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    const response = await apiClient.post<Education>('/profiles/education', data);
    return response.data;
  }

  static async updateEducation(educationId: string, data: Partial<Education>): Promise<Education> {
    const response = await apiClient.put<Education>(`/profiles/education/${educationId}`, data);
    return response.data;
  }

  static async deleteEducation(educationId: string): Promise<void> {
    await apiClient.delete(`/profiles/education/${educationId}`);
  }

  // Experience management
  static async getExperience(): Promise<Experience[]> {
    const response = await apiClient.get<Experience[]>('/profiles/experience');
    return response.data;
  }

  static async addExperience(data: Omit<Experience, 'id' | 'applicantId' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
    const response = await apiClient.post<Experience>('/profiles/experience', data);
    return response.data;
  }

  static async updateExperience(experienceId: string, data: Partial<Experience>): Promise<Experience> {
    const response = await apiClient.put<Experience>(`/profiles/experience/${experienceId}`, data);
    return response.data;
  }

  static async deleteExperience(experienceId: string): Promise<void> {
    await apiClient.delete(`/profiles/experience/${experienceId}`);
  }

  // Certification management
  static async getCertifications(): Promise<Certification[]> {
    const response = await apiClient.get<Certification[]>('/profiles/certifications');
    return response.data;
  }

  static async addCertification(data: Omit<Certification, 'id' | 'applicantId' | 'createdAt' | 'updatedAt'>): Promise<Certification> {
    const response = await apiClient.post<Certification>('/profiles/certifications', data);
    return response.data;
  }

  static async updateCertification(certificationId: string, data: Partial<Certification>): Promise<Certification> {
    const response = await apiClient.put<Certification>(`/profiles/certifications/${certificationId}`, data);
    return response.data;
  }

  static async deleteCertification(certificationId: string): Promise<void> {
    await apiClient.delete(`/profiles/certifications/${certificationId}`);
  }

  // File upload for profile pictures, resumes, etc.
  static async uploadFile(file: File, type: 'profile' | 'resume' | 'logo'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${apiClient['baseURL']}/api/v1/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiClient['token']}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data;
  }

  // Profile completeness check
  static async getProfileCompleteness(): Promise<{
    percentage: number;
    missingFields: string[];
    recommendations: string[];
  }> {
    const response = await apiClient.get('/profiles/completeness');
    return response.data;
  }

  // Skills management
  static async updateSkills(skills: string[]): Promise<ApplicantProfile> {
    const response = await apiClient.put<ApplicantProfile>('/profiles/applicant/me', { skills });
    return response.data;
  }

  static async getSuggestedSkills(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/profiles/skills/suggestions');
    return response.data;
  }
}

