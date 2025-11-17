import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { JobsService, type Application, type Job } from "@/services/jobs.service";
import { useIsAuthenticated, useUser } from "@/store/authStore";

const JobReminder = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const [activeTab, setActiveTab] = useState<'track' | 'saved'>('track');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track Jobs (Applications) state
  const [applications, setApplications] = useState<Application[]>([]);
  const [_applicationsTotal, setApplicationsTotal] = useState(0);

  // Saved Jobs state
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [_savedJobsTotal, setSavedJobsTotal] = useState(0);

  // Fetch applications (Track Jobs)
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await JobsService.getMyApplications({ page: 1, limit: 100 });
      setApplications(response.applications || []);
      setApplicationsTotal(response.total || 0);
      
      console.log('📋 Fetched applications:', response.applications?.length || 0);
    } catch (err: any) {
      console.error('❌ Failed to fetch applications:', err);
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await JobsService.getSavedJobs({ page: 1, limit: 100 });
      setSavedJobs(response.jobs || []);
      setSavedJobsTotal(response.total || 0);
      
      console.log('💾 Fetched saved jobs:', response.jobs?.length || 0);
    } catch (err: any) {
      console.error('❌ Failed to fetch saved jobs:', err);
      setError(err.message || 'Failed to load saved jobs');
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/seeker/profile/job-reminder');
      return;
    }

    if (activeTab === 'track') {
      fetchApplications();
    } else {
      fetchSavedJobs();
    }
  }, [activeTab, isAuthenticated, navigate]);

  // Get status color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'bg-[#DFDF49]',
      REVIEWED: 'bg-blue-500',
      SHORTLISTED: 'bg-purple-500',
      INTERVIEWED: 'bg-indigo-500',
      ACCEPTED: 'bg-green-500',
      REJECTED: 'bg-red-500',
    };
    return statusMap[status] || 'bg-gray-500';
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Get organization name from job
  const getOrganizationName = (application: Application): string => {
    // Try to get from job.organization or job.nonprofit
    const job = (application as any).job;
    if (job?.organization?.orgName) return job.organization.orgName;
    if (job?.nonprofit?.orgName) return job.nonprofit.orgName;
    return 'Unknown Organization';
  };

  // Get organization logo from job
  const getOrganizationLogo = (application: Application): string | null => {
    const job = (application as any).job;
    if (job?.organization?.logoUrl) return job.organization.logoUrl;
    if (job?.nonprofit?.logoUrl) return job.nonprofit.logoUrl;
    return null;
  };

  // Get job location
  const getJobLocation = (application: Application): string => {
    const job = (application as any).job;
    if (!job) return 'Location not specified';
    
    const parts = [
      job.locationCity,
      job.locationState,
      job.locationCountry
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  // Get job title
  const getJobTitle = (application: Application): string => {
    const job = (application as any).job;
    return job?.title || 'Unknown Job';
  };

  // Get applicant email (from current user or application)
  const getApplicantEmail = (application: Application): string => {
    // For Track Jobs, show the current user's email
    if (user?.email) return user.email;
    // Fallback to application applicant email
    return (application as any).applicant?.email || 
           application.applicant?.email || 
           'Email not available';
  };

  // Get applicant phone (from current user profile or application)
  const getApplicantPhone = (application: Application): string => {
    // Try to get from application applicant profile first
    const applicant = (application as any).applicant;
    if (applicant?.applicantProfile?.phone) return applicant.applicantProfile.phone;
    // Could also try to get from user profile if available
    return 'Phone not available';
  };

  // Filter applications by search query
  const filteredApplications = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const jobTitle = getJobTitle(app).toLowerCase();
    const orgName = getOrganizationName(app).toLowerCase();
    const location = getJobLocation(app).toLowerCase();
    return jobTitle.includes(query) || orgName.includes(query) || location.includes(query);
  });

  // Filter saved jobs by search query
  const filteredSavedJobs = savedJobs.filter(job => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const title = job.title?.toLowerCase() || '';
    const orgName = job.organization?.orgName?.toLowerCase() || job.nonprofit?.orgName?.toLowerCase() || '';
    const location = `${job.locationCity || ''} ${job.locationState || ''} ${job.locationCountry || ''}`.toLowerCase();
    return title.includes(query) || orgName.includes(query) || location.includes(query);
  });

  // Get initials for logo
  const getInitials = (text: string): string => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div className="min-h-screen mx-5 my-5">
        <h2 className="text-2xl font-semibold py-5">Job Reminder</h2>

        <div className="flex items-center justify-between">
          <div className="flex bg-[#E3E3E3] rounded-[999px] py-1 px-1">
            <button
              onClick={() => setActiveTab('track')}
              className={`rounded-[999px] px-5 py-2 transition-colors ${
                activeTab === 'track'
                  ? 'bg-white text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Track Jobs
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`rounded-[999px] px-5 py-2 transition-colors ${
                activeTab === 'saved'
                  ? 'bg-white text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Saved Jobs
            </button>
          </div>

          <div className="md:flex items-center gap-3 bg-white px-5 py-2 rounded-[999px] hidden">
            <Icon icon="ri:search-line" className="text-xl" />
            <input
              type="text"
              className="bg-transparent focus:outline-none"
              placeholder="Search all jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="my-5 bg-red-50 border border-red-200 rounded-md px-5 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="my-5 flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="my-5">
            {activeTab === 'track' ? (
              // Track Jobs (Applications) Tab
              <div>
                {filteredApplications.length === 0 ? (
                  <div className="bg-white px-5 py-10 rounded-md text-center">
                    <p className="text-gray-500">No applications found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {searchQuery ? 'Try adjusting your search' : 'You haven\'t applied to any jobs yet'}
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((application) => {
                    const orgName = getOrganizationName(application);
                    const orgLogo = getOrganizationLogo(application);
                    const jobTitle = getJobTitle(application);
                    const location = getJobLocation(application);
                    const email = getApplicantEmail(application);
                    const phone = getApplicantPhone(application);
                    const initials = getInitials(orgName);

                    return (
                      <div key={application.id} className="bg-white px-5 md:px-[30px] py-10 rounded-md mb-4">
                        <div className="border border-black/30 rounded-xs px-5 py-5">
                          <div className="flex flex-col md:flex-row items-start gap-4">
                            {orgLogo ? (
                              <img
                                src={orgLogo}
                                alt={orgName}
                                className="w-16 h-16 rounded-md object-cover"
                              />
                            ) : (
                              <h4 className="text-4xl font-semibold text-white px-7 py-4 rounded-md bg-[#004D40] flex items-center justify-center min-w-[64px] min-h-[64px]">
                                {initials}
                              </h4>
                            )}

                            <div className="w-full">
                              <div>
                                <h5 className="text-xl font-semibold pb-1">{jobTitle}</h5>
                                <p className="text-sm text-[#808080]">{orgName}</p>
                                <p className="text-sm text-[#808080]">{location}</p>
                              </div>

                              <div className="flex flex-wrap gap-3 my-6 items-center justify-between">
                                <div>
                                  <h6 className="text-sm text-[#808080]">Email Address</h6>
                                  <p className="font-[500] underline">{email}</p>
                                </div>

                                <div>
                                  <h6 className="text-sm text-[#808080]">Phone</h6>
                                  <p className="font-[500]">{phone}</p>
                                </div>

                                <div>
                                  <button
                                    className={`px-5 py-2 rounded-md text-white ${getStatusColor(application.status)}`}
                                  >
                                    {getStatusLabel(application.status)}
                                  </button>
                                </div>
                              </div>

                              {application.appliedAt && (
                                <div className="text-xs text-gray-400 mt-2">
                                  Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              // Saved Jobs Tab
              <div>
                {filteredSavedJobs.length === 0 ? (
                  <div className="bg-white px-5 py-10 rounded-md text-center">
                    <p className="text-gray-500">No saved jobs found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {searchQuery ? 'Try adjusting your search' : 'You haven\'t saved any jobs yet'}
                    </p>
                  </div>
                ) : (
                  filteredSavedJobs.map((job) => {
                    const orgName = job.organization?.orgName || job.nonprofit?.orgName || 'Unknown Organization';
                    const orgLogo = job.organization?.logoUrl || job.nonprofit?.logoUrl;
                    const location = [
                      job.locationCity,
                      job.locationState,
                      job.locationCountry
                    ].filter(Boolean).join(', ') || 'Location not specified';
                    const initials = getInitials(orgName);

                    return (
                      <div key={job.id} className="bg-white px-5 md:px-[30px] py-10 rounded-md mb-4">
                        <div className="border border-black/30 rounded-xs px-5 py-5">
                          <div className="flex flex-col md:flex-row items-start gap-4">
                            {orgLogo ? (
                              <img
                                src={orgLogo}
                                alt={orgName}
                                className="w-16 h-16 rounded-md object-cover"
                              />
                            ) : (
                              <h4 className="text-4xl font-semibold text-white px-7 py-4 rounded-md bg-[#004D40] flex items-center justify-center min-w-[64px] min-h-[64px]">
                                {initials}
                              </h4>
                            )}

                            <div className="w-full">
                              <div>
                                <h5 className="text-xl font-semibold pb-1">{job.title}</h5>
                                <p className="text-sm text-[#808080]">{orgName}</p>
                                <p className="text-sm text-[#808080]">{location}</p>
                              </div>

                              <div className="flex flex-wrap gap-3 my-6 items-center justify-between">
                                <div>
                                  <button
                                    onClick={() => navigate(`/seeker/job/${job.id}`)}
                                    className="px-5 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                  >
                                    View Job
                                  </button>
                                </div>

                                <div>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await JobsService.unsaveJob(job.id);
                                        await fetchSavedJobs();
                                      } catch (err: any) {
                                        setError(err.message || 'Failed to unsave job');
                                      }
                                    }}
                                    className="px-5 py-2 rounded-md text-red-600 border border-red-600 hover:bg-red-50"
                                  >
                                    Unsave
                                  </button>
                                </div>
                              </div>

                              {job.createdAt && (
                                <div className="text-xs text-gray-400 mt-2">
                                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobReminder;
