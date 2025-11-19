// Service for fetching country/state/city data from CountriesNow API with in-memory caching

interface CountriesNowResponse<T> {
  error: boolean;
  msg: string;
  data: T;
}

interface StatesResponse {
  name: string;
  iso3: string;
  states: { name: string }[];
}

const API_BASE = 'https://countriesnow.space/api/v0.1';

export class LocationService {
  private static stateCache = new Map<string, string[]>();
  private static cityCache = new Map<string, string[]>();

  static async getStates(countryName: string, signal?: AbortSignal): Promise<string[]> {
    if (!countryName) return [];

    if (this.stateCache.has(countryName)) {
      return this.stateCache.get(countryName)!;
    }

    const response = await fetch(`${API_BASE}/countries/states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryName }),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }

    const result = (await response.json()) as CountriesNowResponse<StatesResponse>;
    if (result.error) {
      throw new Error(result.msg || 'Failed to fetch states');
    }

    const states = (result.data.states || []).map((state) => state.name).filter(Boolean);
    this.stateCache.set(countryName, states);
    return states;
  }

  static async getCities(countryName: string, stateName: string, signal?: AbortSignal): Promise<string[]> {
    if (!countryName || !stateName) return [];

    const cacheKey = `${countryName}::${stateName}`;
    if (this.cityCache.has(cacheKey)) {
      return this.cityCache.get(cacheKey)!;
    }

    const response = await fetch(`${API_BASE}/countries/state/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryName, state: stateName }),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const result = (await response.json()) as CountriesNowResponse<string[]>;
    if (result.error) {
      throw new Error(result.msg || 'Failed to fetch cities');
    }

    const cities = Array.from(new Set(result.data || [])).filter(Boolean);
    this.cityCache.set(cacheKey, cities);
    return cities;
  }
}












