// Service for retrieving global university data using the Hipolabs dataset/API

export interface University {
  alpha_two_code: string;
  country: string;
  domains: string[];
  name: string;
  state_province: string | null;
  web_pages: string[];
}

export interface UniversitySearchParams {
  country?: string;
  name?: string;
  signal?: AbortSignal;
}

const HIPOLABS_BASE_URL = 'https://universities.hipolabs.com';

export class UniversityService {
  private static cache = new Map<string, University[]>();

  private static getCacheKey(country?: string, name?: string) {
    return `${country ?? 'all'}::${name?.toLowerCase() ?? 'all'}`;
  }

  /**
   * Searches universities by country and/or name.
   * Uses in-memory caching to avoid repeated network requests for the same query.
   */
  static async searchUniversities(params: UniversitySearchParams = {}): Promise<University[]> {
    const { country, name, signal } = params;
    const cacheKey = this.getCacheKey(country, name);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const query = new URLSearchParams();
    if (country) query.append('country', country);
    if (name) query.append('name', name);

    const response = await fetch(
      `${HIPOLABS_BASE_URL}/search${query.toString() ? `?${query.toString()}` : ''}`,
      { signal },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }

    const data = (await response.json()) as University[];
    this.cache.set(cacheKey, data);
    return data;
  }
}







