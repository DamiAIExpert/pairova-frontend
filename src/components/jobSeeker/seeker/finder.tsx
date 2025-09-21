import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";
import { JobService } from "@/lib/services/job.service";
import { useApi } from "@/hooks/useApi";
import { JobSearchResult, JobSearchFilters } from "@/lib/services/job.service";

const Finder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [placement, setPlacement] = useState("");
  const [filters, setFilters] = useState<JobSearchFilters>({});

  // Fetch job search results
  const { 
    data: searchResults, 
    loading, 
    error, 
    refetch 
  } = useApi(
    () => JobService.searchJobs({ 
      page: 1, 
      limit: 12, 
      ...filters 
    }),
    [filters],
    { immediate: true }
  );

  // Fetch search filters
  const { data: searchFilters } = useApi(
    () => JobService.getSearchFilters(),
    [],
    { immediate: true }
  );

  const handleSearch = () => {
    const newFilters: JobSearchFilters = {
      search: searchTerm || undefined,
      location: location || undefined,
      employmentType: employmentType || undefined,
      placement: placement || undefined,
    };
    setFilters(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="px-5 md:px-[50px] py-[50px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 bg-white px-2 py-2 rounded-md w-full">
          <Icon icon="ri:search-line" className="text-xl" />
          <input
            type="text"
            className="bg-transparent focus:outline-none w-full"
            placeholder="Search all jobs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="w-[70%] hidden md:block">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md my-3 w-full bg-white">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Location</SelectLabel>
                {searchFilters?.locations?.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-white px-2 py-2 rounded-md">
          <Icon icon="akar-icons:location" className="text-xl" />
          <Select value={employmentType} onValueChange={setEmploymentType}>
            <SelectTrigger className="bg-transparent focus:outline-none border-none">
              <SelectValue placeholder="Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Employment Type</SelectLabel>
                {searchFilters?.employmentTypes?.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <button 
            onClick={handleSearch}
            className="px-6 py-2 text-white rounded-md bg-[#3A3B3B] hover:bg-[#2A2B2B]"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between my-3">
        <div>
          <p>
            {loading 
              ? 'Loading...' 
              : `Showing ${searchResults?.data?.length || 0} of ${searchResults?.total || 0} results`
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm">
            Sort by{" "}
            <span className="border rounded-md px-1 py-1">Relevancy</span>
          </p>
          <Icon icon="mynaui:filter" className="text-2xl" />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">⚠️ Search Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => refetch()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Retry Search
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg px-5 py-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
            </div>
          ))}
            </div>
      )}

      {/* Jobs */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {searchResults?.data?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          </div>
      )}

      {/* No Results */}
      {!loading && !error && searchResults?.data?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job }: { job: JobSearchResult }) => {
  return (
        <div className="bg-white rounded-lg px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
            {job.orgName.charAt(0).toUpperCase()}
              </h4>

              <div>
            <Link to={`job/${job.id}`}>
              <h5 className="text-lg text-[#4F4F4F] hover:text-[#004D40] transition-colors">
                {job.title}
              </h5>
                </Link>
            <p className="text-sm text-[#4F4F4F]">{job.orgName}</p>
              </div>
            </div>

            <div>
              <Icon
                icon="proicons:bookmark"
            className="text-2xl text-[#646464] cursor-pointer hover:text-[#004D40] transition-colors"
              />
            </div>
          </div>

      {job.matchScore && (
        <p className="text-[#4F4F4F] py-2">
          <span className="text-[#004D40] font-semibold">{job.matchScore}%</span> match with your profile
        </p>
      )}

          <div className="flex flex-wrap my-3 items-center gap-3">
        <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">{job.employmentType}</p>
        <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">{job.placement}</p>
        {job.experienceLevel && (
          <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">{job.experienceLevel}</p>
        )}
          </div>

      <p className="text-lg text-[#4F4F4F]">
        {job.daysSincePosted} day{job.daysSincePosted !== 1 ? 's' : ''} ago • {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
      </p>

      {job.salaryRange && (
          <div className="flex items-center justify-between my-4">
            <div>
              <p>
              <span className="font-semibold">${job.salaryRange.min}</span> - <span className="font-semibold">${job.salaryRange.max}</span> {job.salaryRange.currency}
            </p>
          </div>
        </div>
      )}

          <div className="flex items-center justify-between my-4">
            <div>
          <p className="text-sm text-gray-500">{job.orgLocation}</p>
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
  );
};

export default Finder;