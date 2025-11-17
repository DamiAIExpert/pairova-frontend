import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { JobsService, type Job, EmploymentType, JobPlacement } from "@/services/jobs.service";
import { useAuthStore } from "@/store/authStore";

interface Filters {
  jobTypes: string[];
  experience: string[];
  openToVolunteer: boolean;
  jobTimeline: string;
  salaryRange: string;
}

interface DisplayJob {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  location: string;
  employmentType: string;
  placement: string;
  experience: string;
  postedDate: string;
  applicants: number;
  salary: string;
  matchScore?: number;
}

const Finder = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("relevancy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Default to recommended if authenticated, otherwise all jobs
  const [viewMode, setViewMode] = useState<"recommended" | "all">("all");
  
  // Update viewMode when authentication status changes
  useEffect(() => {
    if (isAuthenticated && user?.role === 'applicant') {
      setViewMode("recommended");
    } else {
      setViewMode("all");
    }
  }, [isAuthenticated, user?.role]);
  
  const [filters, setFilters] = useState<Filters>({
    jobTypes: [],
    experience: [],
    openToVolunteer: false,
    jobTimeline: "",
    salaryRange: "",
  });

  const [filteredJobs, setFilteredJobs] = useState<DisplayJob[]>([]);

  // Helper function to format employment type
  const formatEmploymentType = (type?: EmploymentType): string => {
    if (!type) return "Full Time";
    const typeMap: Record<EmploymentType, string> = {
      [EmploymentType.FULL_TIME]: "Full Time",
      [EmploymentType.PART_TIME]: "Part Time",
      [EmploymentType.CONTRACT]: "Contract",
      [EmploymentType.INTERNSHIP]: "Internship",
      [EmploymentType.VOLUNTEER]: "Volunteer",
    };
    return typeMap[type] || type;
  };

  // Helper function to format placement
  const formatPlacement = (placement?: JobPlacement): string => {
    if (!placement) return "Onsite";
    const placementMap: Record<JobPlacement, string> = {
      [JobPlacement.ONSITE]: "Onsite",
      [JobPlacement.REMOTE]: "Remote",
      [JobPlacement.HYBRID]: "Hybrid",
    };
    return placementMap[placement] || placement;
  };

  // Helper function to format experience
  const formatExperience = (minYrs?: number | null): string => {
    if (minYrs == null || minYrs === undefined) return "Not specified";
    const years = Number(minYrs);
    if (isNaN(years)) return "Not specified";
    if (years === 0) return "Less than a year";
    if (years === 1) return "1 - 3 years";
    if (years === 3) return "3 - 5 years";
    if (years === 5) return "5 - 10 years";
    return `${years}+ years`;
  };

  // Helper function to format date
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return "Date not available";
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
      return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Date not available";
    }
  };

  // Helper function to format salary
  const formatSalary = (min?: number | null, max?: number | null, currency?: string | null): string => {
    const curr = currency || "USD";
    
    // Handle null/undefined values - convert null to undefined for easier checking
    const minValue = min != null ? Number(min) : null;
    const maxValue = max != null ? Number(max) : null;
    
    // If both min and max are valid numbers
    if (minValue != null && maxValue != null && !isNaN(minValue) && !isNaN(maxValue)) {
      return `${curr === "USD" ? "$" : curr} ${minValue.toLocaleString()} - ${maxValue.toLocaleString()} per month`;
    }
    
    // If only min is valid
    if (minValue != null && !isNaN(minValue)) {
      return `${curr === "USD" ? "$" : curr} ${minValue.toLocaleString()}+ per month`;
    }
    
    // If only max is valid (unlikely but handle it)
    if (maxValue != null && !isNaN(maxValue)) {
      return `Up to ${curr === "USD" ? "$" : curr} ${maxValue.toLocaleString()} per month`;
    }
    
    return "Salary not specified";
  };

  // Convert filter values to API parameters
  const _convertExperienceToMinYrs = (exp: string): number | undefined => {
    if (exp === "Less than a year") return 0;
    if (exp === "1 - 3 years") return 1;
    if (exp === "3 - 5 years") return 3;
    if (exp === "5 - 10 years") return 5;
    return undefined;
  };

  const convertJobTypeToEmploymentType = (type: string): EmploymentType | undefined => {
    const typeMap: Record<string, EmploymentType> = {
      "Full Time": EmploymentType.FULL_TIME,
      "Part Time": EmploymentType.PART_TIME,
      "Contract": EmploymentType.CONTRACT,
      "Internship": EmploymentType.INTERNSHIP,
      "Volunteer": EmploymentType.VOLUNTEER,
    };
    return typeMap[type];
  };

  // Convert API Job to DisplayJob
  // Handle both Job interface and JobSearchResultDto format
  const convertJobToDisplayJob = (job: any): DisplayJob => {
    // Check if it's JobSearchResultDto format (has orgName directly)
    const isSearchResultDto = 'orgName' in job;
    
    // Get organization name - check multiple possible sources
    let organizationName = "Organization";
    let organizationLogo: string | undefined = undefined;
    
    if (isSearchResultDto) {
      organizationName = job.orgName || "Organization";
      const rawLogoUrl = job.orgLogoUrl;
      // Handle both absolute URLs and relative paths for SearchResultDto
      if (rawLogoUrl) {
        if (rawLogoUrl.startsWith('http://') || rawLogoUrl.startsWith('https://')) {
          organizationLogo = rawLogoUrl;
        } else if (rawLogoUrl.startsWith('/')) {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
          organizationLogo = `${apiBaseUrl}${rawLogoUrl}`;
        } else {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
          organizationLogo = `${apiBaseUrl}/${rawLogoUrl}`;
        }
      }
    } else {
      // Try different sources for organization name and logo
      organizationName = 
        job.organization?.orgName ||
        job.nonprofit?.orgName ||
        job.postedBy?.nonprofitOrg?.orgName ||
        job.postedBy?.nonprofitProfile?.orgName ||
        "Organization";
      
      const rawLogoUrl = 
        job.organization?.logoUrl ||
        job.nonprofit?.logoUrl ||
        job.postedBy?.nonprofitOrg?.logoUrl ||
        job.postedBy?.nonprofitProfile?.logoUrl ||
        undefined;
      
      // Handle both absolute URLs and relative paths
      if (rawLogoUrl) {
        // If it's already a full URL (starts with http:// or https://), use it as-is
        if (rawLogoUrl.startsWith('http://') || rawLogoUrl.startsWith('https://')) {
          organizationLogo = rawLogoUrl;
        } else if (rawLogoUrl.startsWith('/')) {
          // If it starts with /, it's a relative path - prepend API base URL
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
          organizationLogo = `${apiBaseUrl}${rawLogoUrl}`;
        } else {
          // Otherwise, assume it's a relative path and prepend API base URL with /
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
          organizationLogo = `${apiBaseUrl}/${rawLogoUrl}`;
        }
      }
    }
    
    const location = isSearchResultDto
      ? (job.orgLocation || "Location not specified")
      : (() => {
          // Try to get location from job or organization
          const locationParts = [
            job.locationCity,
            job.locationState,
            job.locationCountry
          ].filter(Boolean);
          
          // If no location on job, try organization location
          if (locationParts.length === 0) {
            const orgLocationParts = [
              job.postedBy?.nonprofitOrg?.city,
              job.postedBy?.nonprofitOrg?.state,
              job.postedBy?.nonprofitOrg?.country,
              job.organization?.city,
              job.organization?.state,
              job.organization?.country,
            ].filter(Boolean);
            if (orgLocationParts.length > 0) {
              return orgLocationParts.join(", ");
            }
          }
          
          return locationParts.length > 0 
            ? locationParts.join(", ") 
            : "Location not specified";
        })();
    
    const employmentType = formatEmploymentType(job.employmentType);
    const placement = formatPlacement(job.placement);
    
    // Handle experience - could be experienceLevel (string) or experienceMinYrs (number)
    let experience: string;
    if (isSearchResultDto && job.experienceLevel) {
      // Map API experienceLevel format to display format
      const levelMap: Record<string, string> = {
        "0-1": "Less than a year",
        "1-3": "1 - 3 years",
        "3-5": "3 - 5 years",
        "5-10": "5 - 10 years",
      };
      experience = levelMap[job.experienceLevel] || job.experienceLevel;
    } else if (job.experienceLevel) {
      // Also handle if Job interface has experienceLevel
      const levelMap: Record<string, string> = {
        "0-1": "Less than a year",
        "1-3": "1 - 3 years",
        "3-5": "3 - 5 years",
        "5-10": "5 - 10 years",
      };
      experience = levelMap[job.experienceLevel] || job.experienceLevel;
    } else if (job.experienceMinYrs != null) {
      experience = formatExperience(job.experienceMinYrs);
    } else {
      experience = "Not specified";
    }
    
    // Handle date - could be postedAt or createdAt
    const dateString = isSearchResultDto 
      ? (job.postedAt || job.createdAt) 
      : (job.createdAt || job.updatedAt);
    const postedDate = formatDate(dateString);
    
    // Handle applicants - could be applicantCount or applications array
    const applicants = isSearchResultDto 
      ? (job.applicantCount || 0)
      : (job.applications?.length || 0);
    
    // Handle salary - could be salaryRange object or separate fields
    let salary: string;
    if (isSearchResultDto && job.salaryRange) {
      salary = formatSalary(
        job.salaryRange?.min ?? null, 
        job.salaryRange?.max ?? null, 
        job.salaryRange?.currency ?? null
      );
    } else {
      // Handle null/undefined values from backend
      const salaryMin = job.salaryMin != null ? Number(job.salaryMin) : null;
      const salaryMax = job.salaryMax != null ? Number(job.salaryMax) : null;
      salary = formatSalary(
        salaryMin, 
        salaryMax, 
        job.currency ?? null
      );
    }

    return {
      id: job.id,
      title: job.title,
      organization: organizationName,
      organizationLogo: organizationLogo,
      location: location,
      employmentType: employmentType,
      placement: placement,
      experience: experience,
      postedDate: postedDate,
      applicants: applicants,
      salary: salary,
      matchScore: job.matchScore,
    };
  };

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare location parts for client-side filtering
        const locationParts = [city, country].filter(Boolean);

        let jobsResponse: { jobs: Job[]; total?: number };
        
        // Use recommended jobs if authenticated and viewMode is "recommended"
        if (isAuthenticated && user?.role === 'applicant' && viewMode === "recommended") {
          try {
            jobsResponse = await JobsService.getRecommendedJobs({ page: 1, limit: 100 });
          } catch (recommendedError: any) {
            // If recommended jobs fail, fall back to all jobs
            console.warn("Failed to fetch recommended jobs, falling back to all jobs:", recommendedError);
            jobsResponse = await JobsService.getJobs({});
          }
        } else {
          // Fetch all jobs for unauthenticated users or when "All Jobs" is selected
          jobsResponse = await JobsService.getJobs({});
        }
        
        let allJobs: Job[] = jobsResponse.jobs || [];
        
        // Apply all filters client-side
    // Filter by search query
        if (searchQuery && searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          allJobs = allJobs.filter(job => 
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.organization?.orgName?.toLowerCase().includes(query) ||
            job.nonprofit?.orgName?.toLowerCase().includes(query)
          );
        }
        
        // Filter by location
        if (locationParts.length > 0) {
          const locationQuery = locationParts.join(", ").toLowerCase();
          allJobs = allJobs.filter(job => {
            const jobLocation = [
              job.locationCity,
              job.locationState,
              job.locationCountry
            ].filter(Boolean).join(", ").toLowerCase();
            return jobLocation.includes(locationQuery);
          });
        }
        
        // Filter by employment type
        if (filters.jobTypes.length > 0) {
          const allowedTypes = filters.jobTypes.map(convertJobTypeToEmploymentType).filter(Boolean) as EmploymentType[];
          allJobs = allJobs.filter(job => {
            return job.employmentType && allowedTypes.includes(job.employmentType);
          });
        }
        
        // Filter by volunteer option
        if (filters.openToVolunteer) {
          allJobs = allJobs.filter(job => job.employmentType === EmploymentType.VOLUNTEER);
        }
        
        // Filter by experience
        if (filters.experience.length > 0) {
          const experienceMap: Record<string, (minYrs?: number | null) => boolean> = {
            "Less than a year": (minYrs) => minYrs === 0 || minYrs == null,
            "1 - 3 years": (minYrs) => {
              if (minYrs == null) return false;
              const yrs = Number(minYrs);
              return !isNaN(yrs) && (yrs === 1 || (yrs >= 1 && yrs < 3));
            },
            "3 - 5 years": (minYrs) => {
              if (minYrs == null) return false;
              const yrs = Number(minYrs);
              return !isNaN(yrs) && (yrs === 3 || (yrs >= 3 && yrs < 5));
            },
            "5 - 10 years": (minYrs) => {
              if (minYrs == null) return false;
              const yrs = Number(minYrs);
              return !isNaN(yrs) && (yrs === 5 || (yrs >= 5 && yrs < 10));
            },
          };
          
          allJobs = allJobs.filter(job => {
            return filters.experience.some(exp => {
              const checkFn = experienceMap[exp];
              return checkFn ? checkFn(job.experienceMinYrs) : false;
            });
          });
        }
        
        // Create result object
        const result = {
          jobs: allJobs,
          total: allJobs.length,
          page: 1,
          limit: 100,
        };
        
        // Convert jobs to display format
        let jobs: DisplayJob[] = result.jobs.map(convertJobToDisplayJob);

        // Apply client-side filtering for multiple selections
        // Filter by job types (multiple) - filter by display format
        if (filters.jobTypes.length > 0) {
          jobs = jobs.filter((job) => filters.jobTypes.includes(job.employmentType));
        }

        // Filter by experience (multiple)
        if (filters.experience.length > 0) {
          jobs = jobs.filter((job) => filters.experience.includes(job.experience));
    }

    // Sort jobs
        if (sortBy === "relevancy" && jobs.some(j => j.matchScore !== undefined)) {
          jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === "recent") {
          jobs.sort((a, b) => {
            // Sort by date (most recent first) - handle both formats
            const jobA = result.jobs.find(j => j.id === a.id);
            const jobB = result.jobs.find(j => j.id === b.id);
            
            // Get date for jobA
            const dateStringA = (jobA as any)?.postedAt || 
                              (jobA as any)?.createdAt || 
                              jobA?.createdAt || 
                              jobA?.updatedAt;
            const dateA = dateStringA ? new Date(dateStringA).getTime() : 0;
            
            // Get date for jobB
            const dateStringB = (jobB as any)?.postedAt || 
                              (jobB as any)?.createdAt || 
                              jobB?.createdAt || 
                              jobB?.updatedAt;
            const dateB = dateStringB ? new Date(dateStringB).getTime() : 0;
            
            // Handle invalid dates
            const validDateA = isNaN(dateA) ? 0 : dateA;
            const validDateB = isNaN(dateB) ? 0 : dateB;
            
            return validDateB - validDateA;
          });
        } else if (sortBy === "salary") {
          jobs.sort((a, b) => {
            const jobA = result.jobs.find(j => j.id === a.id);
            const jobB = result.jobs.find(j => j.id === b.id);
            // Handle both salaryRange object and separate fields
            let salaryA = 0;
            let salaryB = 0;
            
            // Get salary for jobA
            if ((jobA as any)?.salaryRange) {
              const range = (jobA as any).salaryRange;
              salaryA = range?.max != null ? Number(range.max) : (range?.min != null ? Number(range.min) : 0);
            } else {
              const maxA = jobA?.salaryMax != null ? Number(jobA.salaryMax) : null;
              const minA = jobA?.salaryMin != null ? Number(jobA.salaryMin) : null;
              salaryA = maxA ?? minA ?? 0;
            }
            
            // Get salary for jobB
            if ((jobB as any)?.salaryRange) {
              const range = (jobB as any).salaryRange;
              salaryB = range?.max != null ? Number(range.max) : (range?.min != null ? Number(range.min) : 0);
            } else {
              const maxB = jobB?.salaryMax != null ? Number(jobB.salaryMax) : null;
              const minB = jobB?.salaryMin != null ? Number(jobB.salaryMin) : null;
              salaryB = maxB ?? minB ?? 0;
            }
            
            // Handle NaN cases
            if (isNaN(salaryA)) salaryA = 0;
            if (isNaN(salaryB)) salaryB = 0;
            
            return salaryB - salaryA;
          });
        }

        setFilteredJobs(jobs);
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.status,
          details: err.details,
          response: err.response,
        });
        
        // Extract more detailed error message
        let errorMessage = "Failed to load jobs. Please try again.";
        if (err.message) {
          errorMessage = err.message;
        } else if (err.details?.message) {
          errorMessage = err.details.message;
        } else if (err.details?.error) {
          errorMessage = err.details.error;
        }
        
        setError(errorMessage);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, searchQuery, city, country, sortBy, viewMode, isAuthenticated, user?.role]);

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
    setSearchQuery("");
    setCountry("");
    setCity("");
  };

  const handleSearch = () => {
    // Trigger search - filters are already applied via useEffect
    console.log("Searching with filters:", filters);
  };

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
                  id={type}
                  checked={filters.jobTypes.includes(type)}
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(type, checked as boolean)
                  }
                />
                <label htmlFor={type} className="text-sm cursor-pointer">
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
                  id={exp}
                  checked={filters.experience.includes(exp)}
                  onCheckedChange={(checked) =>
                    handleExperienceChange(exp, checked as boolean)
                  }
                />
                <label htmlFor={exp} className="text-sm cursor-pointer">
                  {exp}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Open to Volunteer */}
        <div className="px-5 py-5 border-b border-black/30">
          <div className="flex items-center justify-between">
            <label htmlFor="volunteer" className="text-sm font-medium">
              Open to volunteer
            </label>
            <Checkbox
              id="volunteer"
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
                <RadioGroupItem value={timeline} id={timeline} />
                <label htmlFor={timeline} className="text-sm cursor-pointer">
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
                  <RadioGroupItem value={range} id={range} />
                  <label htmlFor={range} className="text-sm cursor-pointer">
                    {range}
                  </label>
                </div>
              )
            )}
          </RadioGroup>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 md:px-[50px] py-[50px]">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 bg-white px-2 py-2 rounded-md w-full">
            <Icon icon="ri:search-line" className="text-xl" />
            <input
              type="text"
              className="bg-transparent focus:outline-none w-full"
              placeholder="Search all jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-[70%] hidden md:block">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md my-3 w-full bg-white">
                <SelectValue placeholder="Nigeria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Country</SelectLabel>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-white px-2 py-2 rounded-md">
            <Icon icon="akar-icons:location" className="text-xl" />
            <input
              type="text"
              className="bg-transparent focus:outline-none"
              placeholder="All City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 text-white rounded-md bg-[#3A3B3B] hover:bg-[#2A2B2B] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Header with View Mode Toggle */}
        {isAuthenticated && user?.role === 'applicant' && (
          <div className="px-5 py-3 border-b border-black/30 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <button
                  onClick={() => setViewMode("recommended")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "recommended"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-black/30 hover:bg-gray-100"
                  }`}
                >
                  Recommended
                </button>
                <button
                  onClick={() => setViewMode("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "all"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-black/30 hover:bg-gray-100"
                  }`}
                >
                  All Jobs
                </button>
              </div>
              {viewMode === "recommended" && (
                <span className="text-xs text-gray-500">
                  Based on your profile and privacy settings
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between my-3">
          <div>
            <p>
              Showing {filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm">Sort by </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border rounded-md px-3 py-1 w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancy">Relevancy</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004D40] mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Icon
              icon="mdi:alert-circle-outline"
              className="text-6xl text-red-400 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Error loading jobs
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Icon
              icon="mdi:briefcase-search-outline"
              className="text-6xl text-gray-400 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg px-5 py-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    {job.organizationLogo ? (
                      <>
                        <img
                          src={job.organizationLogo}
                          alt={job.organization}
                          className="w-16 h-16 rounded-md object-contain bg-gray-100 p-2"
                          onError={(e) => {
                            // If image fails to load, hide it and show fallback
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).parentElement?.querySelector('.logo-fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <h4 
                          className="logo-fallback text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40] flex items-center justify-center w-16 h-16 hidden"
                        >
                          {job.organization.charAt(0).toUpperCase()}
                        </h4>
                      </>
                    ) : (
                      <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40] flex items-center justify-center w-16 h-16">
                        {job.organization.charAt(0).toUpperCase()}
                    </h4>
                    )}

                    <div>
                      <Link to={`job/${job.id}`}>
                        <h5 className="text-lg text-[#4F4F4F] hover:text-[#004D40] transition-colors">
                          {job.title}
                        </h5>
                      </Link>
                      <p className="text-sm text-[#4F4F4F]">{job.organization}</p>
                    </div>
                  </div>

                  <div>
                    <Icon
                      icon="proicons:bookmark"
                      className="text-2xl text-[#646464] cursor-pointer hover:text-[#004D40] transition-colors"
                    />
                  </div>
                </div>

                {job.matchScore !== undefined && (
                <p className="text-[#4F4F4F] py-2">
                    Match with your profile ({Math.round(job.matchScore)}%)
                </p>
                )}

                <div className="flex flex-wrap my-3 items-center gap-3">
                  <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm text-xs">
                    {job.employmentType}
                  </p>
                  <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm text-xs">
                    {job.placement}
                  </p>
                  <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm text-xs">
                    {job.experience}
                  </p>
                </div>

                <p className="text-lg text-[#4F4F4F]">
                  {job.postedDate} • {job.applicants} applicants
                </p>

                <div className="flex items-center justify-between my-4">
                  <div>
                    <p>
                      <span className="font-semibold">{job.salary.split(" ")[0]}</span>{" "}
                      {job.salary.split(" ").slice(1).join(" ")}
                    </p>
                  </div>

                  <div>
                    <Link to={`job/${job.id}`}>
                      <button className="border border-[#58585866] rounded-md py-2 px-8 cursor-pointer hover:bg-black/80 hover:text-white ease-in duration-200">
                        Apply
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Finder;
