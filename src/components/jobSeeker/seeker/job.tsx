import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { JobsService } from "@/services";
import { useIsAuthenticated } from "@/store/authStore";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Filters {
  jobTypes: string[];
  experience: string[];
  openToVolunteer: boolean;
  jobTimeline: string;
  salaryRange: string;
}

const Job = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAuthenticated = useIsAuthenticated();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    jobTypes: ["Full Time"],
    experience: ["1 - 3 years"],
    openToVolunteer: false,
    jobTimeline: "",
    salaryRange: "",
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        setError("No job ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if ID is a UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        
        if (!isUUID) {
          // For demo purposes, use mock data for non-UUID IDs
          const mockJob = {
            id: id,
            title: "Non-Profit Expert",
            description: `We are seeking a passionate Non-Profit Expert to join our team. This role involves working with various nonprofit organizations to help them achieve their mission and maximize their impact.

Key Responsibilities:
• Develop and implement strategic plans for nonprofit organizations
• Provide consultation on fundraising strategies and donor management
• Assist with grant writing and proposal development
• Conduct program evaluations and impact assessments
• Build partnerships with community stakeholders
• Mentor nonprofit leaders and staff members

Qualifications:
• Bachelor's degree in Nonprofit Management, Social Work, or related field
• 1-3 years of experience in the nonprofit sector
• Strong understanding of nonprofit operations and governance
• Excellent communication and interpersonal skills
• Ability to work independently and as part of a team
• Passion for social impact and community development`,
            organization: {
              name: "Shalom Health Abuja",
              logoUrl: null,
              size: "50-100 employees",
              industry: "Healthcare & Social Services",
              foundedOn: "2015-01-01",
              mission: "To provide accessible healthcare and social services to underserved communities in Abuja and surrounding areas."
            },
            location: {
              city: "Abuja",
              state: "FCT",
              country: "Nigeria"
            },
            employmentType: "FULL_TIME",
            placement: "HYBRID",
            experienceMinYrs: 1,
            experienceMaxYrs: 3,
            salaryMin: 100,
            salaryMax: 150,
            currency: "USD",
            requiredSkills: ["Nonprofit Management", "Fundraising", "Grant Writing", "Program Evaluation", "Community Engagement"],
            benefits: ["Health Insurance", "Professional Development", "Flexible Schedule", "Remote Work Options"],
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            applicantCount: 50,
            status: "OPEN"
          };
          
          setJob(mockJob);
          setError(null);
        } else {
          // Fetch real job data from API
          const jobData = await JobsService.getJobById(id);
          setJob(jobData);
          setError(null);
        }
      } catch (err: any) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Filter handlers
  const handleJobTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, type]
        : prev.jobTypes.filter((t) => t !== type),
    }));
  };

  const handleExperienceChange = (exp: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      experience: checked
        ? [...prev.experience, exp]
        : prev.experience.filter((e) => e !== exp),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      jobTypes: [],
      experience: [],
      openToVolunteer: false,
      jobTimeline: "",
      salaryRange: "",
    });
  };

  const handleApplyNow = () => {
    if (!isAuthenticated) {
      // Redirect to login, then back to job to apply
      navigate(`/login?redirect=/seeker/job/${id}/apply`);
      return;
    }

    // Navigate to the application page
    navigate(`/seeker/job/${id}/apply`);
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/seeker/job/${id}`);
      return;
    }

    try {
      setIsSaving(true);
      
      // Check if ID is a UUID (real job) or demo ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isUUID) {
        // Save real job via API
        // TODO: Implement save job API endpoint
        console.log('Saving job:', id);
        setIsSaved(true);
        setSuccessMessage('Job saved successfully!');
        setShowSuccessModal(true);
      } else {
        // Demo mode
        setIsSaved(true);
        setSuccessMessage('Demo Mode: Job saved to your profile!');
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error('Failed to save job:', err);
      alert(err.message || 'Failed to save job. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatEmploymentType = (type: string) => {
    if (!type) return "Full Time";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatPlacement = (placement: string) => {
    if (!placement) return "Onsite";
    return placement
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-red-500 text-lg mb-4">{error || "Job not found"}</div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/80"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar Filters */}
      <div className="w-[260px] border-r border-black/30 min-h-screen bg-white hidden md:block overflow-y-auto">
        <div className="px-5 py-5 border-b border-black/30 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-semibold">Filter</h3>
          <button
            onClick={clearAllFilters}
            className="font-semibold text-black hover:opacity-70 transition-opacity"
          >
            Clear all
          </button>
        </div>

        {/* Job Type */}
        <div className="px-5 py-5 border-b border-black/30">
          <h4 className="font-semibold mb-3">Job Type</h4>
          <div className="space-y-3">
            {["Contract", "Full Time", "Part Time", "Internship"].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`job-${type}`}
                  checked={filters.jobTypes.includes(type)}
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(type, checked as boolean)
                  }
                />
                <label htmlFor={`job-${type}`} className="text-sm cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* AI Model Button */}
        <div className="px-5 py-5 border-b border-black/30">
          <button className="w-full bg-gradient-to-r from-[#FFCBE8] to-[#CDE3FF] text-black py-3 px-4 rounded-md font-medium flex items-center justify-between hover:opacity-90 transition-opacity">
            AI Model
            <Icon icon="ph:arrow-right" className="text-xl" />
          </button>
        </div>

        {/* Experience */}
        <div className="px-5 py-5 border-b border-black/30">
          <h4 className="font-semibold mb-3">Experience</h4>
          <div className="space-y-3">
            {[
              "Less than a year",
              "1 - 3 years",
              "3 - 5 years",
              "5 - 10 years",
            ].map((exp) => (
              <div key={exp} className="flex items-center gap-2">
                <Checkbox
                  id={`exp-${exp}`}
                  checked={filters.experience.includes(exp)}
                  onCheckedChange={(checked) =>
                    handleExperienceChange(exp, checked as boolean)
                  }
                />
                <label htmlFor={`exp-${exp}`} className="text-sm cursor-pointer">
                  {exp}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Open to Volunteer */}
        <div className="px-5 py-5 border-b border-black/30">
          <div className="flex items-center justify-between">
            <label htmlFor="volunteer-job" className="text-sm font-medium">
              Open to volunteer
            </label>
            <Checkbox
              id="volunteer-job"
              checked={filters.openToVolunteer}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({
                  ...prev,
                  openToVolunteer: checked as boolean,
                }))
              }
            />
          </div>
        </div>

        {/* Job Timeline */}
        <div className="px-5 py-5 border-b border-black/30">
          <h4 className="font-semibold mb-3">Job Timeline</h4>
          <RadioGroup
            value={filters.jobTimeline}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, jobTimeline: value }))
            }
          >
            {[
              "Less than 24 hours",
              "1 - 3 weeks",
              "1 month",
              "2 - 10 months",
            ].map((timeline) => (
              <div key={timeline} className="flex items-center gap-2 my-2">
                <RadioGroupItem value={timeline} id={`timeline-${timeline}`} />
                <label htmlFor={`timeline-${timeline}`} className="text-sm cursor-pointer">
                  {timeline}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Expected Salary */}
        <div className="px-5 py-5">
          <h4 className="font-semibold mb-3">Expected Salary</h4>
          <RadioGroup
            value={filters.salaryRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, salaryRange: value }))
            }
          >
            {["Under $1000", "$1000 - $10000", "My own preference"].map(
              (range) => (
                <div key={range} className="flex items-center gap-2 my-2">
                  <RadioGroupItem value={range} id={`salary-${range}`} />
                  <label htmlFor={`salary-${range}`} className="text-sm cursor-pointer">
                    {range}
                  </label>
                </div>
              )
            )}
          </RadioGroup>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center gap-4 border-b border-black/30 px-5 py-5">
          <Icon
            icon="ph:caret-circle-left-light"
            className="text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="bg-white mx-5 my-2 px-10 py-10 rounded-md">
          <h1 className="text-3xl font-semibold">{job.title}</h1>

          <div className="flex flex-col lg:flex-row justify-between my-8 gap-5 lg:gap-0">
            <div className="flex flex-col md:flex-row items-start gap-4">
              {job.organization?.logoUrl ? (
                <>
                  <img
                    src={job.organization.logoUrl}
                    alt={job.organization.name}
                    className="w-16 h-16 rounded-md object-contain bg-gray-100 p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLElement).nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                  <h4 
                    className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40] hidden items-center justify-center w-16 h-16"
                  >
                    {job.organization?.name?.charAt(0) || 'N'}
                  </h4>
                </>
              ) : (
                <h4 
                  className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40] flex items-center justify-center w-16 h-16"
                >
                  {job.organization?.name?.charAt(0) || 'N'}
                </h4>
              )}

              <div className="">
                <div className="flex gap-3 flex-wrap items-center">
                  <p className="font-medium">{job.organization?.name || 'Organization'}</p>
                  <span>•</span>
                  <div className="flex items-center">
                    <Icon icon="tdesign:location" className="text-lg" />
                    <p>
                      {job.location?.city && job.location?.state
                        ? `${job.location.city}, ${job.location.state}`
                        : job.location?.country || 'Location not specified'}
                    </p>
                  </div>
                  <span>•</span>
                  <p>{formatPlacement(job.placement)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 my-2">
                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">
                    {formatEmploymentType(job.employmentType)}
                  </p>
                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">
                    {formatPlacement(job.placement)}
                  </p>
                  {job.experienceMinYrs !== undefined && (
                    <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">
                      {job.experienceMinYrs === 0
                        ? "Entry Level"
                        : `${job.experienceMinYrs}${job.experienceMaxYrs ? `-${job.experienceMaxYrs}` : '+'} years`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <span>•</span>
                  <p className="text-xs">{job.applicantCount || 0} Applicants</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleApplyNow}
                className="bg-[#004D40] text-white px-10 py-2 rounded-md w-full md:w-[300px] hover:bg-[#004D40]/90 transition-colors flex items-center justify-center gap-2"
              >
                {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
              </button>
              {isAuthenticated && (
                <button 
                  onClick={handleSaveJob}
                  disabled={isSaving || isSaved}
                  className={`border border-black/30 px-10 py-2 rounded-md w-full md:w-[300px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${
                    (isSaving || isSaved) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <Icon icon="mdi:check-circle" className="text-green-600" />
                      Saved
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="my-5">
            <h4 className="text-xl font-semibold">Salary</h4>
            <p className="my-2">
              {job.salaryMin && job.salaryMax ? (
                <span className="text-lg font-medium">
                  ${Number(job.salaryMin).toLocaleString()} - ${Number(job.salaryMax).toLocaleString()} {job.currency || 'USD'}
                </span>
              ) : (
                <span className="text-gray-500">Not specified</span>
              )}
            </p>
          </div>

          <div className="my-5">
            <h4 className="text-xl font-semibold">Job Description</h4>
            <p className="my-2 text-justify whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="my-5">
              <h4 className="text-xl font-semibold">Skills</h4>
              <div className="flex flex-wrap gap-2 my-2">
                {job.requiredSkills.map((skill: string, index: number) => (
                  <p key={index} className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-sm">
                    {skill}
                  </p>
                ))}
              </div>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="my-5">
              <h4 className="text-xl font-semibold">Benefits</h4>
              <ul className="my-2 list-disc list-inside">
                {job.benefits.map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {job.deadline && (
            <div className="my-5">
              <h4 className="text-xl font-semibold">Application Deadline</h4>
              <p className="my-2">
                {new Date(job.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Company Overview - if organization data is available */}
          {job.organization && (
            <div className="my-5">
              <h4 className="text-xl font-semibold">Company Overview</h4>
              <div className="my-2 grid md:grid-cols-2 gap-4">
                {job.organization.size && (
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p>{job.organization.size}</p>
                  </div>
                )}
                {job.organization.industry && (
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p>{job.organization.industry}</p>
                  </div>
                )}
                {job.organization.foundedOn && (
                  <div>
                    <p className="text-sm text-gray-600">Founded</p>
                    <p>{new Date(job.organization.foundedOn).getFullYear()}</p>
                  </div>
                )}
                {job.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p>{job.location.city}, {job.location.state}, {job.location.country}</p>
                  </div>
                )}
              </div>
              {job.organization.mission && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Mission Statement</p>
                  <p className="mt-1">{job.organization.mission}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Icon icon="mdi:check-circle" className="text-4xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-[#004D40] text-white px-8 py-2 rounded-md hover:bg-[#004D40]/90 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Job;
