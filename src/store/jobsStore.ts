// src/store/jobsStore.ts
// Jobs store using Zustand

import { create } from 'zustand';
import { JobsService, type Job, type JobSearchParams, type JobSearchResult, type Application } from '../services/jobs.service';

interface JobsState {
  jobs: Job[];
  featuredJobs: Job[];
  recommendedJobs: Job[];
  savedJobs: Job[];
  applications: Application[];
  currentJob: Job | null;
  searchResults: JobSearchResult | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  filters: JobSearchParams;
}

interface JobsActions {
  // Job fetching
  fetchJobs: (params?: JobSearchParams) => Promise<void>;
  fetchFeaturedJobs: () => Promise<void>;
  fetchRecommendedJobs: () => Promise<void>;
  fetchJob: (jobId: string) => Promise<void>;
  
  // Job management
  createJob: (jobData: any) => Promise<void>;
  updateJob: (jobId: string, jobData: any) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  publishJob: (jobId: string) => Promise<void>;
  closeJob: (jobId: string) => Promise<void>;
  
  // Job search
  searchJobs: (params: JobSearchParams) => Promise<void>;
  setFilters: (filters: JobSearchParams) => void;
  clearFilters: () => void;
  
  // Saved jobs
  fetchSavedJobs: () => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  
  // Applications
  fetchApplications: () => Promise<void>;
  applyForJob: (jobId: string, coverLetter?: string, resumeUploadId?: string) => Promise<void>;
  
  // State management
  setCurrentJob: (job: Job | null) => void;
  clearError: () => void;
  clearJobs: () => void;
}

type JobsStore = JobsState & JobsActions;

export const useJobsStore = create<JobsStore>((set) => ({
  // State
  jobs: [],
  featuredJobs: [],
  recommendedJobs: [],
  savedJobs: [],
  applications: [],
  currentJob: null,
  searchResults: null,
  isLoading: false,
  isSearching: false,
  error: null,
  filters: {},

  // Actions
  fetchJobs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await JobsService.getJobs(params);
      set({
        jobs: result.jobs,
        searchResults: result,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch jobs',
      });
    }
  },

  fetchFeaturedJobs: async () => {
    try {
      const jobs = await JobsService.getFeaturedJobs();
      set({ featuredJobs: jobs });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch featured jobs' });
    }
  },

  fetchRecommendedJobs: async () => {
    try {
      const jobs = await JobsService.getRecommendedJobs();
      set({ recommendedJobs: jobs });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch recommended jobs' });
    }
  },

  fetchJob: async (jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      const job = await JobsService.getJob(jobId);
      set({
        currentJob: job,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch job',
      });
    }
  },

  createJob: async (jobData: any) => {
    set({ isLoading: true, error: null });
    try {
      const newJob = await JobsService.createJob(jobData);
      set((state) => ({
        jobs: [newJob, ...state.jobs],
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create job',
      });
    }
  },

  updateJob: async (jobId: string, jobData: any) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJob = await JobsService.updateJob(jobId, jobData);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === jobId ? updatedJob : job)),
        currentJob: state.currentJob?.id === jobId ? updatedJob : state.currentJob,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update job',
      });
    }
  },

  deleteJob: async (jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      await JobsService.deleteJob(jobId);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== jobId),
        currentJob: state.currentJob?.id === jobId ? null : state.currentJob,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to delete job',
      });
    }
  },

  publishJob: async (jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJob = await JobsService.publishJob(jobId);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === jobId ? updatedJob : job)),
        currentJob: state.currentJob?.id === jobId ? updatedJob : state.currentJob,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to publish job',
      });
    }
  },

  closeJob: async (jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJob = await JobsService.closeJob(jobId);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === jobId ? updatedJob : job)),
        currentJob: state.currentJob?.id === jobId ? updatedJob : state.currentJob,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to close job',
      });
    }
  },

  searchJobs: async (params: JobSearchParams) => {
    set({ isSearching: true, error: null });
    try {
      const result = await JobsService.searchJobs(params);
      set({
        searchResults: result,
        isSearching: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isSearching: false,
        error: error.message || 'Failed to search jobs',
      });
    }
  },

  setFilters: (filters: JobSearchParams) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  fetchSavedJobs: async () => {
    try {
      const result = await JobsService.getSavedJobs();
      set({ savedJobs: result.jobs });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch saved jobs' });
    }
  },

  saveJob: async (jobId: string) => {
    try {
      await JobsService.saveJob(jobId);
      // Add to saved jobs if not already there
      set((state) => {
        const job = state.jobs.find((j) => j.id === jobId);
        if (job && !state.savedJobs.find((sj) => sj.id === jobId)) {
          return { savedJobs: [...state.savedJobs, job] };
        }
        return {};
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to save job' });
    }
  },

  unsaveJob: async (jobId: string) => {
    try {
      await JobsService.unsaveJob(jobId);
      set((state) => ({
        savedJobs: state.savedJobs.filter((job) => job.id !== jobId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to unsave job' });
    }
  },

  fetchApplications: async () => {
    try {
      const result = await JobsService.getMyApplications();
      set({ applications: result.applications });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch applications' });
    }
  },

  applyForJob: async (jobId: string, coverLetter?: string, resumeUploadId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const application = await JobsService.applyForJob({
        jobId,
        coverLetter,
        resumeUploadId,
      });
      set((state) => ({
        applications: [application, ...state.applications],
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to apply for job',
      });
    }
  },

  setCurrentJob: (job: Job | null) => {
    set({ currentJob: job });
  },

  clearError: () => {
    set({ error: null });
  },

  clearJobs: () => {
    set({
      jobs: [],
      featuredJobs: [],
      recommendedJobs: [],
      savedJobs: [],
      applications: [],
      currentJob: null,
      searchResults: null,
    });
  },
}));

// Selectors
export const useJobs = () => useJobsStore((state) => state.jobs);
export const useFeaturedJobs = () => useJobsStore((state) => state.featuredJobs);
export const useRecommendedJobs = () => useJobsStore((state) => state.recommendedJobs);
export const useSavedJobs = () => useJobsStore((state) => state.savedJobs);
export const useApplications = () => useJobsStore((state) => state.applications);
export const useCurrentJob = () => useJobsStore((state) => state.currentJob);
export const useSearchResults = () => useJobsStore((state) => state.searchResults);
export const useJobsLoading = () => useJobsStore((state) => state.isLoading);
export const useJobsError = () => useJobsStore((state) => state.error);
export const useJobsFilters = () => useJobsStore((state) => state.filters);
