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

interface Filters {
  jobTypes: string[];
  experience: string[];
  openToVolunteer: boolean;
  jobTimeline: string;
  salaryRange: string;
}

const Finder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("relevancy");
  
  const [filters, setFilters] = useState<Filters>({
    jobTypes: ["Full Time"],
    experience: ["1 - 3 years"],
    openToVolunteer: false,
    jobTimeline: "",
    salaryRange: "",
  });

  // Mock jobs data - in production, this would come from API
  const allJobs = [
    {
      id: "1",
      title: "Non-Profit Expert",
      organization: "Shalom Health Abuja",
      location: "Abuja, FCT",
      employmentType: "Full Time",
      placement: "Hybrid",
      experience: "1 - 3 years",
      postedDate: "1 day ago",
      applicants: 50,
      salary: "$100 per month",
      matchScore: 95,
    },
    {
      id: "2",
      title: "Non-Profit Expert",
      organization: "Shalom Health Abuja",
      location: "Abuja, FCT",
      employmentType: "Full Time",
      placement: "Hybrid",
      experience: "1 - 3 years",
      postedDate: "1 day ago",
      applicants: 50,
      salary: "$100 per month",
      matchScore: 92,
    },
    {
      id: "3",
      title: "Non-Profit Expert",
      organization: "Shalom Health Abuja",
      location: "Abuja, FCT",
      employmentType: "Full Time",
      placement: "Hybrid",
      experience: "1 - 3 years",
      postedDate: "1 day ago",
      applicants: 50,
      salary: "$100 per month",
      matchScore: 88,
    },
    {
      id: "4",
      title: "Non-Profit Expert",
      organization: "Shalom Health Abuja",
      location: "Abuja, FCT",
      employmentType: "Part Time",
      placement: "Remote",
      experience: "3 - 5 years",
      postedDate: "2 days ago",
      applicants: 35,
      salary: "$150 per month",
      matchScore: 85,
    },
    {
      id: "5",
      title: "Non-Profit Expert",
      organization: "Shalom Health Abuja",
      location: "Abuja, FCT",
      employmentType: "Contract",
      placement: "Onsite",
      experience: "Less than a year",
      postedDate: "3 days ago",
      applicants: 28,
      salary: "$200 per month",
      matchScore: 80,
    },
  ];

  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  // Filter jobs based on selected filters
  useEffect(() => {
    let filtered = [...allJobs];

    // Filter by job types
    if (filters.jobTypes.length > 0) {
      filtered = filtered.filter((job) =>
        filters.jobTypes.includes(job.employmentType)
      );
    }

    // Filter by experience
    if (filters.experience.length > 0) {
      filtered = filtered.filter((job) =>
        filters.experience.includes(job.experience)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by city
    if (city.trim()) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Sort jobs
    if (sortBy === "relevancy") {
      filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "recent") {
      // Already sorted by recent in mock data
    }

    setFilteredJobs(filtered);
  }, [filters, searchQuery, city, sortBy]);

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
        {filteredJobs.length === 0 ? (
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
                    <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                      {job.organization.charAt(0)}
                    </h4>

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

                <p className="text-[#4F4F4F] py-2">
                  Match with your profile ({job.matchScore}%)
                </p>

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
