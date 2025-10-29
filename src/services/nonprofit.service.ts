// src/services/nonprofit.service.ts
import { apiClient } from './api';

export interface NonprofitProfile {
  userId: string;
  orgName: string;
  firstName?: string;
  lastName?: string;
  logoUrl?: string;
  website?: string;
  mission?: string;
  missionStatement?: string;
  values?: string;
  phone?: string;
  postalCode?: string;
  sizeLabel?: string;
  orgType?: string;
  industry?: string;
  foundedOn?: Date;
  taxId?: string;
  country?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  bio?: string;
  position?: string;
  registrationNumber?: string;
  requiredSkills?: string[];
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateNonprofitProfileDto {
  orgName?: string;
  firstName?: string;
  lastName?: string;
  logoUrl?: string;
  website?: string;
  mission?: string;
  missionStatement?: string;
  values?: string;
  phone?: string;
  postalCode?: string;
  sizeLabel?: string;
  orgType?: string;
  industry?: string;
  foundedOn?: Date | string;
  taxId?: string;
  country?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  bio?: string;
  position?: string;
  registrationNumber?: string;
  requiredSkills?: string[];
  socialMediaLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

/**
 * Complete onboarding DTO - collects ALL data from all 7 steps
 */
export interface CompleteOnboardingDto {
  // Step 1: Account Info
  orgName: string;
  country: string;
  logoUrl?: string;

  // Step 2: Company Information
  contactEmail?: string;
  phone: string;
  foundedOn?: string;
  orgType: string;
  industry: string;
  sizeLabel: string;
  website?: string;
  registrationNumber?: string;

  // Step 3: Address
  addressCountry: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;

  // Step 4: Bio
  bio: string;

  // Step 5: Mission Statement
  missionStatement: string;

  // Step 6: Our Values
  values: string;

  // Step 7: Skills
  requiredSkills: string[];

  // Optional fields
  firstName?: string;
  lastName?: string;
  position?: string;
  socialMediaLinks?: Record<string, string>;
}

export class NonprofitService {
  /**
   * Get the current nonprofit organization's profile
   */
  static async getProfile(): Promise<NonprofitProfile> {
    const response = await apiClient.get<NonprofitProfile>('/profiles/nonprofit/me');
    return response.data;
  }

  /**
   * Update the current nonprofit organization's profile
   */
  static async updateProfile(data: UpdateNonprofitProfileDto): Promise<NonprofitProfile> {
    const response = await apiClient.put<NonprofitProfile>('/profiles/nonprofit/me', data);
    return response.data;
  }

  /**
   * Update a specific step in the onboarding process
   */
  static async updateProfileStep(data: Partial<UpdateNonprofitProfileDto>): Promise<NonprofitProfile> {
    return this.updateProfile(data);
  }

  /**
   * Complete onboarding - submit ALL data from all 7 steps at once
   * This is the recommended approach for the full onboarding flow
   */
  static async completeOnboarding(data: CompleteOnboardingDto): Promise<NonprofitProfile> {
    const response = await apiClient.post<NonprofitProfile>('/profiles/nonprofit/onboarding', data);
    return response.data;
  }

  /**
   * Helper: Save onboarding data to localStorage
   */
  static saveToLocalStorage(step: string, data: any): void {
    const key = `npo_onboarding_${step}`;
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`✅ Saved ${step} data to localStorage:`, data);
  }

  /**
   * Helper: Get onboarding data from localStorage
   */
  static getFromLocalStorage(step: string): any {
    const key = `npo_onboarding_${step}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Helper: Get ALL onboarding data from localStorage
   */
  static getAllOnboardingData(): Partial<CompleteOnboardingDto> {
    const steps = ['accountInfo', 'companyInfo', 'address', 'bio', 'missionStatement', 'values', 'skills'];
    const allData: any = {};

    steps.forEach(step => {
      const stepData = this.getFromLocalStorage(step);
      if (stepData) {
        Object.assign(allData, stepData);
      }
    });

    console.log('📦 Retrieved all onboarding data from localStorage:', allData);
    return allData;
  }

  /**
   * Helper: Clear all onboarding data from localStorage
   */
  static clearOnboardingData(): void {
    const steps = ['accountInfo', 'companyInfo', 'address', 'bio', 'missionStatement', 'values', 'skills'];
    steps.forEach(step => {
      const key = `npo_onboarding_${step}`;
      localStorage.removeItem(key);
      // Also remove completion flags
      localStorage.removeItem(`npo_${step}`);
    });
    console.log('🧹 Cleared all onboarding data from localStorage');
  }
}


