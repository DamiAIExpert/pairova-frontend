import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { applicationsService, type Application } from "@/services/applications.service";
import { JobsService, type Job } from "@/services/jobs.service";

const Board = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  
  // Fetch jobs created by this nonprofit
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch applications when job or status changes
  useEffect(() => {
    if (selectedJob) {
      fetchApplications();
    }
  }, [selectedJob, activeStatus]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const result = await JobsService.getJobs({ page: 1, limit: 100 });
      setJobs(result?.jobs || []);
      
      // Auto-select first job if available
      if (result?.jobs && result.jobs.length > 0) {
        setSelectedJob(result.jobs[0]);
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!selectedJob) return;
    
    try {
      setLoading(true);
      setError("");
      const result = await applicationsService.getNonprofitApplications({
        jobId: selectedJob.id,
        status: activeStatus,
        page: 1,
        limit: 100,
      });
      setApplications(result.applications || []);
    } catch (err: any) {
      console.error("❌ Failed to fetch applications:", err);
      setError(err.message || "Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    // In a real implementation, you'd fetch these counts from the backend
    return {
      PENDING: applications.filter(app => app.status === 'PENDING').length,
      REVIEWED: applications.filter(app => app.status === 'REVIEWED').length,
      SHORTLISTED: applications.filter(app => app.status === 'SHORTLISTED').length,
      INTERVIEWED: applications.filter(app => app.status === 'INTERVIEWED').length,
      ACCEPTED: applications.filter(app => app.status === 'ACCEPTED').length,
    };
  };

  const statusCounts = getStatusCounts();

  const filteredApplications = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${app.applicant?.applicantProfile?.firstName || ''} ${app.applicant?.applicantProfile?.lastName || ''}`.toLowerCase();
    const email = app.applicant?.email?.toLowerCase() || '';
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const getQualifiedCount = () => {
    return applications.filter(app => 
      ['REVIEWED', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED'].includes(app.status)
    ).length;
  };

  const getDisqualifiedCount = () => {
    return applications.filter(app => app.status === 'REJECTED').length;
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen px-5 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recruitment board...</p>
        </div>
      </div>
    );
  }

  if (!selectedJob && jobs.length === 0) {
    return (
      <div className="min-h-screen px-5 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-gray-600 text-lg font-medium mb-2">No jobs created yet</h3>
          <p className="text-gray-500">Create a job to start receiving applications</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen px-5 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold pb-2">
              {selectedJob?.title || "Select a Job"}
            </h3>
            <p className="text-xs">
              {selectedJob?.employmentType} • {selectedJob?.locationCountry} • {applications.length} applications
            </p>
          </div>

          <div>
            <button className="flex items-center gap-3 text-white bg-black px-5 py-2 rounded-[999px]">
              <Icon icon="ci:share-ios-export" />
              Export
            </button>
          </div>
        </div>

        {/* Job Selector & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between my-10">
          <div className="flex bg-[#E3E3E3] max-w-[320px] lg:max-w-auto rounded-[999px] py-1 px-1 mb-4 lg:mb-0">
            <button className="bg-white rounded-[999px] px-5 py-3">
              Qualified Jobs {getQualifiedCount()}
            </button>
            <button className="px-5 cursor-pointer">
              Disqualified {getDisqualifiedCount()}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Job Selector */}
            {jobs.length > 1 && (
              <select
                value={selectedJob?.id || ""}
                onChange={(e) => {
                  const job = jobs.find(j => j.id === e.target.value);
                  setSelectedJob(job || null);
                }}
                className="py-2 px-3 border border-black/30 rounded-md bg-white focus:outline-none"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            )}

            {/* Search */}
            <div className="flex items-center gap-3 py-2 px-3 border border-black/30 rounded-[999px] bg-white w-full lg:w-auto">
              <Icon icon="iconamoon:search-light" className="text-lg" />
              <input
                type="text"
                className="focus:outline-none bg-transparent"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter */}
            <button className="border border-black/30 rounded-md px-3 py-2 hover:bg-black/10 bg-white">
              <Icon icon="mynaui:filter-solid" className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap lg:flex-nowrap gap-4 bg-white py-1 px-1 rounded-md">
          <button
            onClick={() => setActiveStatus("PENDING")}
            className={`flex items-center justify-between rounded-md px-3 py-2 w-full ${
              activeStatus === "PENDING"
                ? "bg-black text-white"
                : "text-[#C1C1C1]"
            }`}
          >
            Pending ({statusCounts.PENDING}){" "}
            <Icon
              icon="material-symbols-light:add-box"
              className="text-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddCandidate(true);
              }}
            />
          </button>

          <button
            onClick={() => setActiveStatus("REVIEWED")}
            className={`flex items-center justify-between rounded-md px-3 py-2 w-full ${
              activeStatus === "REVIEWED"
                ? "bg-black text-white"
                : "text-[#C1C1C1]"
            }`}
          >
            Reviewed ({statusCounts.REVIEWED}){" "}
            <Icon
              icon="material-symbols-light:add-box"
              className="text-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddCandidate(true);
              }}
            />
          </button>

          <button
            onClick={() => setActiveStatus("SHORTLISTED")}
            className={`flex items-center justify-between rounded-md px-3 py-2 w-full ${
              activeStatus === "SHORTLISTED"
                ? "bg-black text-white"
                : "text-[#C1C1C1]"
            }`}
          >
            Shortlisted ({statusCounts.SHORTLISTED}){" "}
            <Icon
              icon="material-symbols-light:add-box"
              className="text-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddCandidate(true);
              }}
            />
          </button>

          <button
            onClick={() => setActiveStatus("INTERVIEWED")}
            className={`flex items-center justify-between rounded-md px-3 py-2 w-full ${
              activeStatus === "INTERVIEWED"
                ? "bg-black text-white"
                : "text-[#C1C1C1]"
            }`}
          >
            Interviewed ({statusCounts.INTERVIEWED}){" "}
            <Icon
              icon="material-symbols-light:add-box"
              className="text-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddCandidate(true);
              }}
            />
          </button>

          <button
            onClick={() => setActiveStatus("ACCEPTED")}
            className={`flex items-center justify-between rounded-md px-3 py-2 w-full ${
              activeStatus === "ACCEPTED"
                ? "bg-black text-white"
                : "text-[#C1C1C1]"
            }`}
          >
            Accepted ({statusCounts.ACCEPTED}){" "}
            <Icon
              icon="material-symbols-light:add-box"
              className="text-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddCandidate(true);
              }}
            />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-5">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 mt-5">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && (
          <div className="text-center py-12 mt-5 bg-white rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-gray-600 text-lg font-medium mb-2">
              No {activeStatus.toLowerCase().replace('_', ' ')} applications
            </h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search" : "Applications will appear here when candidates apply"}
            </p>
          </div>
        )}

        {/* Applications Grid */}
        {!loading && filteredApplications.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-5">
            {filteredApplications.map((application) => {
              const profile = application.applicant?.applicantProfile;
              const fullName = profile
                ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                : 'Anonymous';
              
              return (
                <div key={application.id} className="bg-white rounded-md px-3 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profile?.photoUrl ? (
                          <img src={profile.photoUrl} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                        )}
                      </div>

                      <div>
                        <h5>{fullName || 'Anonymous'}</h5>
                        <p className="text-sm underline text-[#2093FF] cursor-pointer">
                          {application.applicant?.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Icon
                        icon="mynaui:x-circle"
                        className="text-[#B3B3B3] cursor-pointer hover:text-red-500"
                        onClick={() => {
                          // Handle reject application
                          if (confirm('Are you sure you want to reject this application?')) {
                            applicationsService.updateApplicationStatus(application.id, {
                              status: 'REJECTED',
                            }).then(() => {
                              fetchApplications();
                            }).catch(err => {
                              console.error('Failed to reject application:', err);
                            });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <h4 className="my-4">{application.job?.title || 'Position'}</h4>

                  <div className="flex items-center justify-between mt-6 py-2 border-t border-black/30">
                    <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                      <Icon icon="bx:file" />
                      <span>{profile?.education?.length || 0} Files</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                      <Icon icon="octicon:thumbsup-16" />
                      <span>{application.matchScore ? `${Math.round(application.matchScore)}%` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Candidate Modal (Placeholder) */}
        {showAddCandidate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add Candidate</h2>
                <button onClick={() => setShowAddCandidate(false)}>
                  <Icon icon="material-symbols:close" className="text-2xl" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                This feature will allow you to manually add candidates to this stage.
              </p>
              <button
                onClick={() => setShowAddCandidate(false)}
                className="bg-black text-white px-4 py-2 rounded-md w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
