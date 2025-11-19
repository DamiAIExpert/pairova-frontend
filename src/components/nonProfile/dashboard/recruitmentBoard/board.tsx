import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { applicationsService, type Application } from "@/services/applications.service";
import { JobsService, type Job } from "@/services/jobs.service";

const Board = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]); // Store all for counts
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [targetStatus, setTargetStatus] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [draggedApplication, setDraggedApplication] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [movingApplication, setMovingApplication] = useState<string | null>(null);
  
  // Fetch jobs created by this nonprofit
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch all applications for the job (not filtered by status) to show counts
  useEffect(() => {
    if (selectedJob) {
      fetchAllApplications();
    }
  }, [selectedJob]);

  // Fetch applications when status changes
  useEffect(() => {
    if (selectedJob) {
      fetchApplications();
    }
  }, [selectedJob, activeStatus]);

  const fetchAllApplications = async () => {
    if (!selectedJob) return;
    
    try {
      // Fetch all applications to get accurate counts
      const result = await applicationsService.getNonprofitApplications({
        jobId: selectedJob.id,
        page: 1,
        limit: 1000,
      });
      // Store all applications for status counts
      setAllApplications(result.applications || []);
    } catch (err: any) {
      console.error("❌ Failed to fetch all applications:", err);
    }
  };

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
    // Use allApplications for accurate counts across all statuses
    return {
      PENDING: allApplications.filter(app => app.status === 'PENDING').length,
      REVIEWED: allApplications.filter(app => app.status === 'REVIEWED').length,
      SHORTLISTED: allApplications.filter(app => app.status === 'SHORTLISTED').length,
      INTERVIEWED: allApplications.filter(app => app.status === 'INTERVIEWED').length,
      ACCEPTED: allApplications.filter(app => app.status === 'ACCEPTED').length,
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
    return allApplications.filter(app => 
      ['REVIEWED', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED'].includes(app.status)
    ).length;
  };

  const getDisqualifiedCount = () => {
    return allApplications.filter(app => app.status === 'REJECTED').length;
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedApplication(applicationId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('applicationId', applicationId);
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedApplication(null);
    setDragOverStatus(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  // Handle drag over status tab
  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  // Handle drop on status tab
  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverStatus(null);
    
    const applicationId = e.dataTransfer.getData('applicationId') || draggedApplication;
    if (!applicationId) return;

    const application = allApplications.find(app => app.id === applicationId) || 
                       applications.find(app => app.id === applicationId);
    if (!application || application.status === targetStatus) {
      setDraggedApplication(null);
      return;
    }

    try {
      setMovingApplication(applicationId);
      setError("");
      
      await applicationsService.updateApplicationStatus(applicationId, {
        status: targetStatus,
      });

      // Update allApplications for accurate counts
      setAllApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: targetStatus as any }
          : app
      ));

      // Update current view if application is visible
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: targetStatus as any }
          : app
      ));

      // Refresh applications for current status view
      await fetchApplications();
      
      // Refresh all applications to update counts
      await fetchAllApplications();

      // Switch to target status tab to show the moved application
      setActiveStatus(targetStatus);
      
    } catch (err: any) {
      console.error('❌ Failed to move application:', err);
      setError(err.message || 'Failed to move application');
      // Revert by refreshing
      await fetchAllApplications();
      await fetchApplications();
    } finally {
      setMovingApplication(null);
      setDraggedApplication(null);
    }
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedJob?.title || "Select a Job"}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedJob?.employmentType || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="mdi:map-marker-outline" className="text-base" />
                {selectedJob?.locationCountry || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="mdi:account-group-outline" className="text-base" />
                {allApplications.length} {allApplications.length === 1 ? 'application' : 'applications'}
              </span>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 text-white bg-gray-900 hover:bg-gray-800 px-6 py-2.5 rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
            <Icon icon="ci:share-ios-export" className="text-lg" />
              Export
            </button>
        </div>

        {/* Job Selector & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="inline-flex bg-gray-200 rounded-full p-1 shadow-inner">
            <button className="bg-white rounded-full px-6 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md">
              Qualified Jobs {getQualifiedCount()}
            </button>
            <button className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Disqualified {getDisqualifiedCount()}
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="iconamoon:search-light" className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter */}
            <button className="inline-flex items-center justify-center border border-gray-300 rounded-lg px-3.5 py-2.5 hover:bg-gray-50 bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <Icon icon="mynaui:filter-solid" className="text-xl text-gray-700" />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-8">
          {[
            { key: "PENDING", label: "Pending", count: statusCounts.PENDING },
            { key: "REVIEWED", label: "Reviewed", count: statusCounts.REVIEWED },
            { key: "SHORTLISTED", label: "Shortlisted", count: statusCounts.SHORTLISTED },
            { key: "INTERVIEWED", label: "Interviewed", count: statusCounts.INTERVIEWED },
            { key: "ACCEPTED", label: "Accepted", count: statusCounts.ACCEPTED },
          ].map((status) => (
            <div
              key={status.key}
              onDragOver={(e) => handleDragOver(e, status.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.key)}
              className={`flex-1 min-w-[140px] rounded-lg transition-all duration-200 ${
                dragOverStatus === status.key 
                  ? "bg-blue-100 ring-2 ring-blue-400 ring-offset-2" 
                  : ""
              }`}
            >
          <button
                onClick={() => setActiveStatus(status.key)}
                className={`flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 w-full ${
                  activeStatus === status.key
                    ? "bg-gray-900 text-white shadow-md"
                    : dragOverStatus === status.key
                    ? "bg-blue-200 text-blue-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>
                  {status.label} ({status.count})
                </span>
            <Icon
              icon="material-symbols-light:add-box"
                  className={`text-xl cursor-pointer transition-transform duration-200 hover:scale-110 ${
                    activeStatus === status.key ? "text-white" : dragOverStatus === status.key ? "text-blue-900" : "text-gray-400"
                  }`}
              onClick={(e) => {
                e.stopPropagation();
                setTargetStatus(status.key);
                setShowAddCandidate(true);
                setSelectedCandidates(new Set());
                setCandidateSearchQuery("");
              }}
            />
          </button>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:alert-circle" className="text-xl" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-300 text-7xl mb-6">📭</div>
            <h3 className="text-gray-700 text-xl font-semibold mb-2">
              No {activeStatus.toLowerCase().replace('_', ' ')} applications
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery ? "Try adjusting your search criteria" : "Applications will appear here when candidates apply for this position"}
            </p>
          </div>
        )}

        {/* Applications Grid */}
        {!loading && filteredApplications.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <Icon icon="mdi:information-outline" className="text-base" />
              <span>Drag and drop candidates to move them between stages</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApplications.map((application) => {
              const profile = application.applicant?.applicantProfile;
              const fullName = profile
                ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                : 'Anonymous';
              
              const isDragging = draggedApplication === application.id;
              const isMoving = movingApplication === application.id;
              
              return (
                <div 
                  key={application.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, application.id)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    // Don't navigate if clicking on buttons or drag handle
                    const target = e.target as HTMLElement;
                    if (
                      target.closest('button') ||
                      target.closest('[class*="drag"]') ||
                      target.closest('a')
                    ) {
                      return;
                    }
                    navigate(`/non-profit/recruitment-board/${application.jobId}/${application.id}`);
                  }}
                  className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all duration-200 group cursor-pointer relative ${
                    isDragging 
                      ? "opacity-50 border-blue-400 shadow-lg scale-95 z-50" 
                      : isMoving
                      ? "opacity-60 border-gray-300"
                      : "border-gray-200 hover:shadow-lg hover:border-gray-300 hover:border-blue-200"
                  }`}
                  title="Click to view details or drag to move between stages"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative group/drag">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                        {profile?.photoUrl ? (
                          <img 
                            src={profile.photoUrl} 
                            alt={fullName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                        )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover/drag:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <Icon icon="mdi:drag" className="text-white text-xs" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 truncate mb-1">
                          {fullName || 'Anonymous'}
                        </h5>
                        <a 
                          href={`mailto:${application.applicant?.email}`}
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block"
                        >
                          {application.applicant?.email || 'No email'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                        <Icon icon="mdi:drag-vertical" className="text-lg" />
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reject this application?')) {
                            applicationsService.updateApplicationStatus(application.id, {
                              status: 'REJECTED',
                            }).then(() => {
                              fetchApplications();
                              fetchAllApplications();
                            }).catch(err => {
                              console.error('Failed to reject application:', err);
                            });
                          }
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                        title="Reject application"
                      >
                        <Icon icon="mynaui:x-circle" className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 line-clamp-2">
                      {application.job?.title || 'Position'}
                    </p>
                    {isMoving && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                        <span>Moving...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1.5">
                      <Icon icon="bx:file" className="text-base" />
                      <span>{profile?.education?.length || 0} Files</span>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 ${
                      application.matchScore 
                        ? application.matchScore >= 80 
                          ? 'bg-green-100 text-green-700'
                          : application.matchScore >= 60
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon icon="octicon:thumbsup-16" className="text-base" />
                      <span>{application.matchScore ? `${Math.round(application.matchScore)}%` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Add Candidate Modal */}
        {showAddCandidate && targetStatus && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[80vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Move Candidates</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select candidates to move to <span className="font-semibold">{[
                      { key: "PENDING", label: "Pending" },
                      { key: "REVIEWED", label: "Reviewed" },
                      { key: "SHORTLISTED", label: "Shortlisted" },
                      { key: "INTERVIEWED", label: "Interviewed" },
                      { key: "ACCEPTED", label: "Accepted" },
                    ].find(s => s.key === targetStatus)?.label || targetStatus}</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowAddCandidate(false);
                    setTargetStatus(null);
                    setSelectedCandidates(new Set());
                    setCandidateSearchQuery("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <Icon icon="material-symbols:close" className="text-2xl" />
                </button>
              </div>

              {/* Search and Actions */}
              <div className="p-6 border-b border-gray-200 space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon="iconamoon:search-light" className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Search candidates..."
                    value={candidateSearchQuery}
                    onChange={(e) => setCandidateSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      const availableCandidates = allApplications
                        .filter(app => app.status !== targetStatus)
                        .filter(app => {
                          if (!candidateSearchQuery.trim()) return true;
                          const searchLower = candidateSearchQuery.toLowerCase();
                          const profile = app.applicant?.applicantProfile;
                          const fullName = profile
                            ? `${profile.firstName || ''} ${profile.lastName || ''}`.toLowerCase()
                            : '';
                          const email = app.applicant?.email?.toLowerCase() || '';
                          return fullName.includes(searchLower) || email.includes(searchLower);
                        })
                        .map(app => app.id);
                      
                      if (selectedCandidates.size === availableCandidates.length) {
                        setSelectedCandidates(new Set());
                      } else {
                        setSelectedCandidates(new Set(availableCandidates));
                      }
                    }}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {selectedCandidates.size > 0 ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedCandidates.size} selected
                  </span>
                </div>
              </div>

              {/* Candidates List */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const availableCandidates = allApplications
                    .filter(app => app.status !== targetStatus)
                    .filter(app => {
                      if (!candidateSearchQuery.trim()) return true;
                      const searchLower = candidateSearchQuery.toLowerCase();
                      const profile = app.applicant?.applicantProfile;
                      const fullName = profile
                        ? `${profile.firstName || ''} ${profile.lastName || ''}`.toLowerCase()
                        : '';
                      const email = app.applicant?.email?.toLowerCase() || '';
                      return fullName.includes(searchLower) || email.includes(searchLower);
                    });

                  if (availableCandidates.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div className="text-gray-300 text-6xl mb-4">👥</div>
                        <p className="text-gray-600">
                          {candidateSearchQuery ? 'No candidates found' : 'No candidates available to move'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {availableCandidates.map((application) => {
                        const profile = application.applicant?.applicantProfile;
                        const fullName = profile
                          ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                          : 'Anonymous';
                        const isSelected = selectedCandidates.has(application.id);
                        const currentStatus = [
                          { key: "PENDING", label: "Pending" },
                          { key: "REVIEWED", label: "Reviewed" },
                          { key: "SHORTLISTED", label: "Shortlisted" },
                          { key: "INTERVIEWED", label: "Interviewed" },
                          { key: "ACCEPTED", label: "Accepted" },
                          { key: "REJECTED", label: "Rejected" },
                        ].find(s => s.key === application.status)?.label || application.status;

                        return (
                          <div
                            key={application.id}
                            onClick={() => {
                              const newSelected = new Set(selectedCandidates);
                              if (isSelected) {
                                newSelected.delete(application.id);
                              } else {
                                newSelected.add(application.id);
                              }
                              setSelectedCandidates(newSelected);
                            }}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <Icon icon="mdi:check" className="text-white text-sm" />
                              )}
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                              {profile?.photoUrl ? (
                                <img 
                                  src={profile.photoUrl} 
                                  alt={fullName} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 truncate">
                                {fullName || 'Anonymous'}
                              </h5>
                              <p className="text-sm text-gray-600 truncate">
                                {application.applicant?.email || 'No email'}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {currentStatus}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddCandidate(false);
                    setTargetStatus(null);
                    setSelectedCandidates(new Set());
                    setCandidateSearchQuery("");
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedCandidates.size === 0) {
                      setShowAddCandidate(false);
                      setTargetStatus(null);
                      return;
                    }

                    try {
                      setError("");
                      const candidateIds = Array.from(selectedCandidates);
                      
                      // Move all selected candidates
                      await Promise.all(
                        candidateIds.map(id =>
                          applicationsService.updateApplicationStatus(id, {
                            status: targetStatus,
                          })
                        )
                      );

                      // Refresh data
                      await fetchAllApplications();
                      await fetchApplications();
                      
                      // Switch to target status to show moved candidates
                      setActiveStatus(targetStatus);
                      
                      // Close modal
                      setShowAddCandidate(false);
                      setTargetStatus(null);
                      setSelectedCandidates(new Set());
                      setCandidateSearchQuery("");
                    } catch (err: any) {
                      console.error('❌ Failed to move candidates:', err);
                      setError(err.message || 'Failed to move candidates');
                    }
                  }}
                  disabled={selectedCandidates.size === 0}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Move {selectedCandidates.size > 0 ? `${selectedCandidates.size} ` : ''}Candidate{selectedCandidates.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
