// src/services/privacy.service.ts
import { apiClient } from './api';

/**
 * Privacy Settings Interface
 * Matches the backend PrivacySettingsResponseDto
 */
export interface PrivacySettings {
  userId: string;
  allowAiTraining: boolean;
  allowProfileIndexing: boolean;
  allowDataAnalytics: boolean;
  allowThirdPartySharing: boolean;
  privacyUpdatedAt: string | null;
  // Granular category settings
  allowPersonalInformation: boolean;
  allowGenderData: boolean;
  allowLocation: boolean;
  allowExperience: boolean;
  allowSkills: boolean;
  allowCertificates: boolean;
  allowBio: boolean;
}

/**
 * Update Privacy Settings DTO
 * All fields are optional for partial updates
 */
export interface UpdatePrivacySettings {
  allowAiTraining?: boolean;
  allowProfileIndexing?: boolean;
  allowDataAnalytics?: boolean;
  allowThirdPartySharing?: boolean;
  // Granular category settings
  allowPersonalInformation?: boolean;
  allowGenderData?: boolean;
  allowLocation?: boolean;
  allowExperience?: boolean;
  allowSkills?: boolean;
  allowCertificates?: boolean;
  allowBio?: boolean;
}

/**
 * Privacy Service
 * Handles all privacy-related API calls
 */
export class PrivacyService {
  /**
   * Get current privacy settings for the authenticated applicant
   * @returns Promise<PrivacySettings>
   */
  static async getPrivacySettings(): Promise<PrivacySettings> {
    const response = await apiClient.get<PrivacySettings>(
      '/profiles/applicant/privacy'
    );
    return response.data;
  }

  /**
   * Update privacy settings for the authenticated applicant
   * @param settings - Partial privacy settings to update
   * @returns Promise<PrivacySettings>
   */
  static async updatePrivacySettings(
    settings: UpdatePrivacySettings
  ): Promise<PrivacySettings> {
    const response = await apiClient.patch<PrivacySettings>(
      '/profiles/applicant/privacy',
      settings
    );
    return response.data;
  }
}

