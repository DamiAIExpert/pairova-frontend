// src/store/index.ts
// Export all stores

export { useAuthStore, useUser, useIsAuthenticated, useIsLoading, useAuthError, useIsAdmin, useIsApplicant, useIsNonprofit } from './authStore';
export { useJobsStore, useJobs, useFeaturedJobs, useRecommendedJobs, useSavedJobs, useApplications, useCurrentJob, useSearchResults, useJobsLoading, useJobsError, useJobsFilters } from './jobsStore';
