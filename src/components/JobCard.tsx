// src/components/JobCard.tsx
// Example component showing how to use the API services

import React from 'react';
import type { Job } from '../services/jobs.service';
import { useJobsStore } from '../store/jobsStore';
import { useAuthStore } from '../store/authStore';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { saveJob, unsaveJob, applyForJob, savedJobs } = useJobsStore();
  const { isAuthenticated } = useAuthStore();

  const isSaved = savedJobs.some(savedJob => savedJob.id === job.id);
  const hasApplied = false; // You could track this in the store

  const handleSave = async () => {
    try {
      if (isSaved) {
        await unsaveJob(job.id);
      } else {
        await saveJob(job.id);
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      // Redirect to user role selection page
      window.location.href = `/user?redirect=/jobs/${job.id}`;
      return;
    }

    try {
      const orgName = job.nonprofit?.orgName || job.organization?.orgName || 'this organization';
      await applyForJob(job.id, `I am interested in the ${job.title} position at ${orgName}.`);
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  return (
    <div className="job-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.nonprofit?.orgName || job.organization?.orgName || 'Organization'}</p>
        </div>
        {(job.nonprofit?.logoUrl || job.organization?.logoUrl) && (
          <img 
            src={job.nonprofit?.logoUrl || job.organization?.logoUrl || ''} 
            alt={`${job.nonprofit?.orgName || job.organization?.orgName || 'Organization'} logo`}
            className="w-12 h-12 rounded object-cover"
          />
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.employmentType && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
            {job.employmentType.replace('_', ' ')}
          </span>
        )}
        {job.placement && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
            {job.placement}
          </span>
        )}
        {job.locationCity && (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
            {job.locationCity}, {job.locationState}
          </span>
        )}
      </div>

      {job.salaryMin && job.salaryMax && (
        <p className="text-gray-600 mb-4">
          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.currency}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isSaved
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {isSaved ? 'Unsave' : 'Save'}
        </button>
        
        <button
          onClick={handleApply}
          disabled={hasApplied || !isAuthenticated}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            hasApplied
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isAuthenticated
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          {hasApplied ? 'Applied' : isAuthenticated ? 'Apply' : 'Login to Apply'}
        </button>
      </div>
    </div>
  );
};
