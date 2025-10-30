import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { JobsService } from "@/services";
import { useNavigate } from "react-router";

const JobTrend = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingJobs = async () => {
      try {
        setLoading(true);
        const result = await JobsService.getTrendingJobs({ page: 1, limit: 3 });
        const fetchedJobs = result.jobs || [];
        setJobs(fetchedJobs);
        setError(null);
        
        console.log(`✅ Fetched ${fetchedJobs.length} trending jobs for landing page`);
        if (fetchedJobs.length > 0) {
          console.log('📋 Sample job data:', {
            title: fetchedJobs[0].title,
            hasOrganization: !!fetchedJobs[0].organization,
            organizationLogo: fetchedJobs[0].organization?.logoUrl,
            organizationName: fetchedJobs[0].organization?.orgName,
            hasNonprofit: !!fetchedJobs[0].nonprofit,
            nonprofitLogo: fetchedJobs[0].nonprofit?.logoUrl,
          });
        }
      } catch (err: any) {
        console.error("❌ Error fetching trending jobs:", err);
        setError(err.message || "Failed to load trending jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingJobs();
  }, []);

  const formatEmploymentType = (type: string) => {
    if (!type) return "Full Time";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postedDate = new Date(date);
    const diffInMs = now.getTime() - postedDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}hrs ago`;
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApplyNow = (jobId: string) => {
    navigate(`/jobs/${jobId}?apply=true`);
  };

  return (
    <div className="">
      <div className="bg-[#262626] my-[50px] py-10 px-5 md:px-[50px]">
        <div className="container mx-auto">
          <h4 className="text-center bg-white py-2 px-8 rounded-[999px] w-[130px] mx-auto">
            Recent
          </h4>
          <h2 className="text-white text-2xl text-center font-semibold my-4">
            Job Trends
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-white text-lg">Loading trending jobs...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-400 text-lg">{error}</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-white text-lg">No trending jobs available at the moment.</div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-5 my-5">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-md px-5 py-5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {(job.orgLogoUrl || job.organization?.logoUrl || job.nonprofit?.logoUrl) ? (
                        <img
                          src={job.orgLogoUrl || job.organization?.logoUrl || job.nonprofit?.logoUrl}
                          alt={job.orgName || job.organization?.orgName || job.nonprofit?.orgName || "Organization"}
                          className="w-[50px] h-[50px] object-contain rounded bg-white p-1"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            if (img.nextElementSibling) {
                              (img.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-[50px] h-[50px] bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-xl"
                        style={{ display: (job.orgLogoUrl || job.organization?.logoUrl || job.nonprofit?.logoUrl) ? 'none' : 'flex' }}
                      >
                        {(job.orgName || job.organization?.orgName || job.nonprofit?.orgName || "O").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-sm text-[#6F6F6F]">
                          <span className="font-[500] underline">
                            {job.orgName || job.organization?.orgName || job.nonprofit?.orgName || "Organization"}
                          </span>{" "}
                          {(job.orgLocation || job.locationCity) && `in ${job.orgLocation?.split(',')[0] || job.locationCity}`} | {formatEmploymentType(job.employmentType)}
                        </p>
                      </div>
                    </div>

                    <Icon icon="mdi-light:star" className="text-2xl flex-shrink-0" />
                  </div>

                  <div className="my-4">
                    <p className="line-clamp-2 text-sm">
                      {job.description || "No description available."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between my-5">
                    {job.salaryRange || (job.salaryMin && job.salaryMax) ? (
                      <p className="text-sm">
                        <span className="text-lg font-[500]">
                          ${(job.salaryRange?.min || job.salaryMin || 0).toLocaleString()}-${(job.salaryRange?.max || job.salaryMax || 0).toLocaleString()}
                        </span>{" "}
                        / month
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Compensation not specified</p>
                    )}
                    <p className="text-sm">
                      {formatTimeAgo(job.createdAt || job.postedAt)}
                    </p>
                  </div>

                  <div className="flex gap-5">
                    <button
                      onClick={() => handleViewDetails(job.id)}
                      className="px-10 py-2 border border-black/30 rounded-md w-full cursor-pointer hover:bg-black/80 ease-in duration-200 hover:text-white"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApplyNow(job.id)}
                      className="bg-black/80 text-white px-10 py-2 rounded-md w-full cursor-pointer hover:bg-black/90"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTrend;
