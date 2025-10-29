// Profile service for updating applicant profile data

import { apiClient } from './api';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  dob?: string; // YYYY-MM-DD format
  bio?: string;
  country?: string;
  state?: string;
  city?: string;
  photoUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  experienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  preferredEmploymentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'VOLUNTEER' | 'INTERNSHIP';
}

export interface ApplicantProfile {
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
  bio: string;
  country: string;
  state: string;
  city: string;
  photoUrl: string;
  portfolioUrl: string;
  skills: string[];
  experienceLevel: string;
  preferredEmploymentType: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileService {
  /**
   * Get current user's profile
   */
  static async getProfile(): Promise<ApplicantProfile> {
    const response = await apiClient.get<ApplicantProfile>('/profiles/applicant/me');
    return response.data;
  }

  /**
   * Update current user's profile
   */
  static async updateProfile(data: UpdateProfileData): Promise<ApplicantProfile> {
    const response = await apiClient.put<ApplicantProfile>('/profiles/applicant/me', data);
    return response.data;
  }

  /**
   * Update profile partially (for onboarding steps)
   */
  static async updateProfileStep(data: Partial<UpdateProfileData>): Promise<ApplicantProfile> {
    return this.updateProfile(data);
  }

  /**
   * Mark onboarding as complete
   */
  static async completeOnboarding(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/complete-onboarding', {});
    return response.data;
  }
}



