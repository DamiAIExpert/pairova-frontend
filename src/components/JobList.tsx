// src/components/JobList.tsx
// Example component showing how to fetch and display jobs

import React, { useEffect } from 'react';
import { JobCard } from './JobCard';
import { useJobsStore } from '../store/jobsStore';

export const JobList: React.FC = () => {
  const { 
    jobs, 
    isLoading, 
    error, 
    fetchJobs, 
    fetchFeaturedJobs,
    clearError 
  } = useJobsStore();

  useEffect(() => {
    // Fetch jobs when component mounts
    fetchJobs();
    fetchFeaturedJobs();
  }, [fetchJobs, fetchFeaturedJobs]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-red-800 font-medium">Error loading jobs</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-gray-600 text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Jobs ({jobs.length})
        </h2>
        <button
          onClick={() => fetchJobs()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
