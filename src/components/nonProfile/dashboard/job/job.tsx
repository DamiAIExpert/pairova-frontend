import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { JobsService, type Job as JobType } from "@/services/jobs.service";
import { useAuthStore } from "@/store/authStore";

const Job = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch jobs created by this nonprofit using nonprofit-specific endpoint
      const result = await JobsService.getNonprofitJobs({
        page: 1,
        limit: 100,
      });
      
      // Ensure we always set an array, even if result.jobs is undefined
      setJobs(result?.jobs || []);
      console.log(`✅ Fetched ${(result?.jobs || []).length} jobs for nonprofit`);
    } catch (err: any) {
      console.error("❌ Failed to fetch jobs:", err);
      setError(err.message || "Failed to load jobs");
      // Set to empty array on error
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await JobsService.deleteNonprofitJob(jobId);
      console.log("✅ Job deleted successfully");
      // Remove from local state
      setJobs((jobs || []).filter(job => job.id !== jobId));
    } catch (err: any) {
      console.error("❌ Failed to delete job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleCreateJob = () => {
    navigate("/non-profit/create-job");
  };

  const filteredJobs = (jobs || []).filter(job =>
    searchQuery.trim() === "" ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Jobs Created</h3>
            <p className="text-sm text-[#616161]">
              {loading ? "Loading..." : `${(jobs || []).length} ${(jobs || []).length === 1 ? 'job has' : 'jobs have'} been created`}
            </p>
          </div>

          <div>
            <button 
              onClick={handleCreateJob}
              className="items-center gap-3 bg-black rounded-md px-4 py-2 text-white hidden md:flex hover:bg-black/80 transition-colors"
            >
              <Icon icon="material-symbols:add-rounded" className="text-2xl" />
              Create Job
            </button>

            <button 
              onClick={handleCreateJob}
              className="items-center gap-3 bg-black rounded-md px-4 py-2 text-white flex md:hidden hover:bg-black/80 transition-colors"
            >
              <Icon icon="material-symbols:add-rounded" className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex items-center gap-3 py-2 px-3 border border-black/30 rounded-[999px]">
            <Icon icon="iconamoon:search-light" className="text-lg" />
            <input
              type="text"
              className="focus:outline-none bg-transparent"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="border border-black/30 rounded-md px-3 py-2 hover:bg-black/10">
            <Icon icon="mynaui:filter-solid" className="text-2xl" />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-600">Loading jobs...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-4">
              <Icon icon="material-symbols:work-outline" className="text-8xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery.trim() ? "No jobs found" : "No jobs created yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery.trim() 
                ? "Try adjusting your search terms" 
                : "Create your first job posting to start recruiting volunteers"}
            </p>
            {!searchQuery.trim() && (
              <button
                onClick={handleCreateJob}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md hover:bg-black/80 transition-colors"
              >
                <Icon icon="material-symbols:add-rounded" className="text-xl" />
                Create Your First Job
              </button>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredJobs.map((job) => (
              <div key={job.id} className="border border-black/30 rounded-md py-5 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img
                      src={job.nonprofit?.logoUrl || "/Images/notify.svg"}
                      alt={job.nonprofit?.orgName || "Organization"}
                      className="w-[80px] h-[80px] object-cover rounded"
                    />
                  </div>

                  <div>
                    <Icon
                      icon="mi:delete-alt"
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-[36px] border border-black/30 p-2 rounded-[50%] cursor-pointer hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="my-5">
                  <div className="flex items-center gap-3">
                    <h5 className="text-xl font-semibold">{job.title}</h5>
                    {job.employmentType && (
                      <>
                        <span className="text-[#5F5F5F] text-2xl">|</span>
                        <p className="text-[#5F5F5F] text-sm">{job.employmentType}</p>
                      </>
                    )}
                  </div>

                  <p className="text-[#7B7B7B] py-2 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="streamline-sharp:non-commercial-dollars-remix"
                        className="text-[#7B7B7B] text-sm"
                      />
                      <p className="text-sm">
                        {job.currency || '$'}{job.salaryMin || 0} - {job.currency || '$'}{job.salaryMax || 0}
                      </p>
                    </div>
                  )}

                  {job.employmentType && (
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="lucide:clock-7"
                        className="text-[#7B7B7B] text-sm"
                      />
                      <p className="text-sm">{job.employmentType}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between my-5">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="proicons:location"
                      className="text-[#7B7B7B] text-sm"
                    />
                    <p className="text-sm">
                      {[job.locationCity, job.locationState, job.locationCountry]
                        .filter(Boolean)
                        .join(", ") || "Location not specified"}
                    </p>
                  </div>

                  {job.placement && (
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:mic" className="text-[#7B7B7B] text-sm" />
                      <p className="text-sm">{job.placement}</p>
                    </div>
                  )}
                </div>

                <div className="">
                  <p className="px-2 py-2 rounded-[999px] bg-[#F5F5F5] w-[120px] text-center text-sm">
                    {job.status}
                  </p>
                </div>

                <div className="my-5 border-t-2 border-dashed border-black/30 pt-5">
                  <p className="font-semibold text-sm text-gray-600">
                    Created {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  {job.applications && job.applications.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {job.applications.length} {job.applications.length === 1 ? 'application' : 'applications'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;
