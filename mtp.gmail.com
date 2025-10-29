[1mdiff --git a/src/components/jobSeeker/seeker/job.tsx b/src/components/jobSeeker/seeker/job.tsx[m
[1mindex b4e637f..051b6f4 100644[m
[1m--- a/src/components/jobSeeker/seeker/job.tsx[m
[1m+++ b/src/components/jobSeeker/seeker/job.tsx[m
[36m@@ -1,8 +1,89 @@[m
 import { Icon } from "@iconify/react";[m
[31m-import { useNavigate } from "react-router";[m
[32m+[m[32mimport { useNavigate, useParams, useSearchParams } from "react-router";[m
[32m+[m[32mimport { useState, useEffect } from "react";[m
[32m+[m[32mimport { JobsService } from "@/services";[m
[32m+[m[32mimport { useIsAuthenticated } from "@/store/authStore";[m
 [m
 const Job = () => {[m
   const navigate = useNavigate();[m
[32m+[m[32m  const { id } = useParams<{ id: string }>();[m
[32m+[m[32m  const [searchParams] = useSearchParams();[m
[32m+[m[32m  const isAuthenticated = useIsAuthenticated();[m
[32m+[m[32m  const [job, setJob] = useState<any>(null);[m
[32m+[m[32m  const [loading, setLoading] = useState(true);[m
[32m+[m[32m  const [error, setError] = useState<string | null>(null);[m
[32m+[m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    const fetchJobDetails = async () => {[m
[32m+[m[32m      if (!id) {[m
[32m+[m[32m        setError("No job ID provided");[m
[32m+[m[32m        setLoading(false);[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m
[32m+[m[32m      try {[m
[32m+[m[32m        setLoading(true);[m
[32m+[m[32m        const jobData = await JobsService.getJobById(id);[m
[32m+[m[32m        setJob(jobData);[m
[32m+[m[32m        setError(null);[m
[32m+[m[32m      } catch (err: any) {[m
[32m+[m[32m        console.error("Error fetching job details:", err);[m
[32m+[m[32m        setError(err.message || "Failed to load job details");[m
[32m+[m[32m      } finally {[m
[32m+[m[32m        setLoading(false);[m
[32m+[m[32m      }[m
[32m+[m[32m    };[m
[32m+[m
[32m+[m[32m    fetchJobDetails();[m
[32m+[m[32m  }, [id]);[m
[32m+[m
[32m+[m[32m  const handleApplyNow = () => {[m
[32m+[m[32m    if (!isAuthenticated) {[m
[32m+[m[32m      // Redirect to login with return URL[m
[32m+[m[32m      navigate(`/login?redirect=/jobs/${id}?apply=true`);[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m[32m    // TODO: Open application modal or navigate to application page[m
[32m+[m[32m    console.log("Apply for job:", id);[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  const formatEmploymentType = (type: string) => {[m
[32m+[m[32m    if (!type) return "Full Time";[m
[32m+[m[32m    return type[m
[32m+[m[32m      .split("_")[m
[32m+[m[32m      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())[m
[32m+[m[32m      .join(" ");[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  const formatPlacement = (placement: string) => {[m
[32m+[m[32m    if (!placement) return "Onsite";[m
[32m+[m[32m    return placement[m
[32m+[m[32m      .split("_")[m
[32m+[m[32m      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())[m
[32m+[m[32m      .join(" ");[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  if (loading) {[m
[32m+[m[32m    return ([m
[32m+[m[32m      <div className="flex justify-center items-center py-20">[m
[32m+[m[32m        <div className="text-lg">Loading job details...</div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    );[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  if (error || !job) {[m
[32m+[m[32m    return ([m
[32m+[m[32m      <div className="flex flex-col justify-center items-center py-20">[m
[32m+[m[32m        <div className="text-red-500 text-lg mb-4">{error || "Job not found"}</div>[m
[32m+[m[32m        <button[m
[32m+[m[32m          onClick={() => navigate("/seeker")}[m
[32m+[m[32m          className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/80"[m
[32m+[m[32m        >[m
[32m+[m[32m          Back to Jobs[m
[32m+[m[32m        </button>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    );[m
[32m+[m[32m  }[m
 [m
   return ([m
     <div>[m
[36m@@ -16,223 +97,142 @@[m [mconst Job = () => {[m
         </div>[m
 [m
         <div className="bg-white mx-5 my-2 px-10 py-10 rounded-md">[m
[31m-          <h1 className="text-3xl font-semibold">Charity Administrator</h1>[m
[32m+[m[32m          <h1 className="text-3xl font-semibold">{job.title}</h1>[m
 [m
           <div className="flex flex-col lg:flex-row justify-between my-8 gap-5 lg:gap-0">[m
             <div className="flex flex-col md:flex-row items-start gap-4">[m
[31m-              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">[m
[31m-                L[m
[32m+[m[32m              {job.organization?.logoUrl ? ([m
[32m+[m[32m                <img[m
[32m+[m[32m                  src={job.organization.logoUrl}[m
[32m+[m[32m                  alt={job.organization.name}[m
[32m+[m[32m                  className="w-16 h-16 rounded-md object-contain bg-gray-100 p-2"[m
[32m+[m[32m                  onError={(e) => {[m
[32m+[m[32m                    (e.target as HTMLImageElement).style.display = 'none';[m
[32m+[m[32m                    const fallback = (e.target as HTMLElement).nextElementSibling;[m
[32m+[m[32m                    if (fallback) (fallback as HTMLElement).style.display = 'flex';[m
[32m+[m[32m                  }}[m
[32m+[m[32m                />[m
[32m+[m[32m              ) : null}[m
[32m+[m[32m              <h4[m[41m [m
[32m+[m[32m                className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40] flex items-center justify-center w-16 h-16"[m
[32m+[m[32m                style={{ display: job.organization?.logoUrl ? 'none' : 'flex' }}[m
[32m+[m[32m              >[m
[32m+[m[32m                {job.organization?.name?.charAt(0) || 'N'}[m
               </h4>[m
 [m
               <div className="">[m
[31m-                <div className="flex gap-3">[m
[31m-                  <p>Fey</p>[m
[32m+[m[32m                <div className="flex gap-3 flex-wrap">[m
[32m+[m[32m                  <p className="font-medium">{job.organization?.name || 'Organization'}</p>[m
                   <span>•</span>[m
                   <div className="flex items-center">[m
                     <Icon icon="tdesign:location" className="text-lg" />[m
[31m-                    <p>Abuja, Nigeria</p>[m
[32m+[m[32m                    <p>[m
[32m+[m[32m                      {job.location?.city && job.location?.state[m
[32m+[m[32m                        ? `${job.location.city}, ${job.location.state}, ${job.location.country || ''}`[m
[32m+[m[32m                        : job.location?.country || 'Location not specified'}[m
[32m+[m[32m                    </p>[m
                   </div>[m
                   <span>•</span>[m
[31m-                  <p>Onsite</p>[m
[32m+[m[32m                  <p>{formatPlacement(job.placement)}</p>[m
                 </div>[m
 [m
                 <div className="flex flex-wrap items-center gap-4 my-2">[m
                   <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">[m
[31m-                    Full Time[m
[31m-                  </p>[m
[31m-                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">[m
[31m-                    Hybrid[m
[31m-                  </p>[m
[31m-                  <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">[m
[31m-                    1 - 3 years[m
[32m+[m[32m                    {formatEmploymentType(job.employmentType)}[m
                   </p>[m
[32m+[m[32m                  {job.placement && ([m
[32m+[m[32m                    <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">[m
[32m+[m[32m                      {formatPlacement(job.placement)}[m
[32m+[m[32m                    </p>[m
[32m+[m[32m                  )}[m
[32m+[m[32m                  {job.experienceMinYrs !== undefined && ([m
[32m+[m[32m                    <p className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-xs">[m
[32m+[m[32m                      {job.experienceMinYrs === 0[m
[32m+[m[32m                        ? "Entry Level"[m
[32m+[m[32m                        : `${job.experienceMinYrs}${job.experienceMaxYrs ? `-${job.experienceMaxYrs}` : '+'} years`}[m
[32m+[m[32m                    </p>[m
[32m+[m[32m                  )}[m
                 </div>[m
 [m
[31m-                <div>[m
[31m-                  <p>Volunteer • 100 Applicants</p>[m
[32m+[m[32m                <div className="flex items-center gap-3 flex-wrap">[m
[32m+[m[32m                  <p className="text-xs">[m
[32m+[m[32m                    Posted {new Date(job.createdAt).toLocaleDateString()}[m
[32m+[m[32m                  </p>[m
[32m+[m[32m                  <span>•</span>[m
[32m+[m[32m                  <p className="text-xs">{job.applicantCount || 0} Applicants</p>[m
                 </div>[m
               </div>[m
             </div>[m
 [m
[31m-            <div>[m
[31m-              <button className="bg-black text-white py-2 px-7 rounded-md cursor-pointer">[m
[31m-                Apply button[m
[32m+[m[32m            <div className="">[m
[32m+[m[32m              <button[m[41m [m
[32m+[m[32m                onClick={handleApplyNow}[m
[32m+[m[32m                className="bg-[#004D40] text-white px-10 py-2 rounded-md w-full md:w-[300px] hover:bg-[#004D40]/90"[m
[32m+[m[32m              >[m
[32m+[m[32m                {isAuthenticated ? 'Apply Now' : 'Login to Apply'}[m
               </button>[m
[32m+[m[32m              {isAuthenticated && ([m
[32m+[m[32m                <button className="border border-black/30 px-10 py-2 rounded-md w-full md:w-[300px] my-2 hover:bg-gray-50">[m
[32m+[m[32m                  Save[m
[32m+[m[32m                </button>[m
[32m+[m[32m              )}[m
             </div>[m
           </div>[m
 [m
[31m-          {/* About Role */}[m
[31m-[m
[31m-          <div className="my-10">[m
[31m-            <h2 className="text-xl font-[500] text-[#4F4F4F]">[m
[31m-              About this role[m
[31m-            </h2>[m
[31m-[m
[31m-            <p className="text-[#767676] my-3 text-sm leading-6">[m
[31m-              A Charity Administrator plays a crucial role in the smooth[m
[31m-              operation of a nonprofit organization. This role involves handling[m
[31m-              administrative tasks, managing records, coordinating fundraising[m
[31m-              efforts, and ensuring compliance with charity regulationExperience[m
[31m-              in office administration, fundraising, or volunteer coordination[m
[31m-              is a plus. This role is perfect for someone passionate about[m
[31m-              making a difference while ensuring the charity runs efficiently.[m
[32m+[m[32m          <div className="my-5">[m
[32m+[m[32m            <h4 className="text-xl font-semibold">Salary</h4>[m
[32m+[m[32m            <p className="my-2">[m
[32m+[m[32m              {job.salaryMin && job.salaryMax ? ([m
[32m+[m[32m                <span className="text-lg font-medium">[m
[32m+[m[32m                  ${Number(job.salaryMin).toLocaleString()} - ${Number(job.salaryMax).toLocaleString()} {job.currency || 'USD'}[m
[32m+[m[32m                </span>[m
[32m+[m[32m              ) : ([m
[32m+[m[32m                <span className="text-gray-500">Not specified</span>[m
[32m+[m[32m              )}[m
             </p>[m
           </div>[m
 [m
[31m-          {/* Qualifications */}[m
[31m-[m
[31m-          <div>[m
[31m-            <h2 className="text-xl font-[500] text-[#4F4F4F]">[m
[31m-              Qualifications[m
[31m-            </h2>[m
[31m-[m
[31m-            <div className="my-3">[m
[31m-              <ol className="list-disc px-4">[m
[31m-                <li className="text-[#767676]">[m
[31m-                  At least 1–3 years of experience in administration, office[m
[31m-                  management, or charity work.[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  A degree or diploma in Business Administration, Nonprofit[m
[31m-                  Management, Social Work, or a related field[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Strong ability to manage records, schedules, and documents[m
[31m-                  efficiently[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Excellent written and verbal communication skills for liaising[m
[31m-                  with donors, volunteers, and stakeholders.[m
[31m-                </li>[m
[31m-              </ol>[m
[31m-            </div>[m
[32m+[m[32m          <div className="my-5">[m
[32m+[m[32m            <h4 className="text-xl font-semibold">Job Description</h4>[m
[32m+[m[32m            <p className="my-2 text-justify whitespace-pre-wrap">{job.description}</p>[m
           </div>[m
 [m
[31m-          {/* Responsibilities */}[m
[31m-[m
[31m-          <div className="my-10">[m
[31m-            <h2 className="text-xl font-[500] text-[#4F4F4F]">[m
[31m-              Responsibilities[m
[31m-            </h2>[m
[31m-[m
[31m-            <div className="my-3">[m
[31m-              <ol className="list-disc px-4">[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Maintain accurate records, databases, and documentation for[m
[31m-                  the charity[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Assist in planning and coordinating fundraising campaigns and[m
[31m-                  charity events.[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Work with finance teams to manage payroll and supplier[m
[31m-                  payments.[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Liaise with board members, trustees, and external partners[m
[31m-                </li>[m
[31m-                <li className="text-[#767676]">[m
[31m-                  Ensure compliance with charity laws, regulations, and data[m
[31m-                  protection policies.[m
[31m-                </li>[m
[31m-              </ol>[m
[31m-            </div>[m
[31m-          </div>[m
[31m-[m
[31m-          {/* Overview */}[m
[31m-[m
[31m-          <div>[m
[31m-            <h2 className="text-xl font-[500] text-[#4F4F4F] ">[m
[31m-              Company Overview[m
[31m-            </h2>[m
[31m-[m
[31m-            <div className="border lg:w-[700px] px-6 py-10 my-5">[m
[31m-              <div className="flex flex-col lg:flex-row justify-between gap-10">[m
[31m-                <div className="w-full">[m
[31m-                  <div className="flex items-center justify-between my-2">[m
[31m-                    <h4 className="font-[500] text-[#4F4F4F] ">Size</h4>[m
[31m-                    <p className="text-[#4F4F4F] ">1000 - 5000 employees</p>[m
[31m-                  </div>[m
[31m-[m
[31m-                  <div className="flex items-center justify-between my-2">[m
[31m-                    <h4 className="font-[500] text-[#4F4F4F] ">Type</h4>[m
[31m-                    <p className="text-[#4F4F4F] ">Company - Public</p>[m
[31m-                  </div>[m
[31m-[m
[31m-                  <div className="flex items-center justify-between my-2">[m
[31m-                    <h4 className="font-[500] text-[#4F4F4F] ">Sector</h4>[m
[31m-                    <p className="text-[#4F4F4F] ">Financial Services</p>[m
[31m-                  </div>[m
[31m-                </div>[m
[31m-[m
[31m-                <div className="lg:px-5 lg:border-l w-full border-t py-5 lg:border-t-0 lg:py-0">[m
[31m-                  <div className="flex items-center justify-between my-2">[m
[31m-                    <h4 className="font-[500] text-[#4F4F4F] ">Founded</h4>[m
[31m-                    <p className="text-[#4F4F4F] ">1999</p>[m
[31m-                  </div>[m
[31m-[m
[31m-                  <div className="flex items-center justify-between my-2">[m
[31m-                    <h4 className="font-[500] text-[#4F4F4F] ">Industry</h4>[m
[31m-                    <p className="text-[#4F4F4F] ">Financial Processing</p>[m
[31m-                  </div>[m
[31m-[m
[31m-                  <div className="flex items-center justify-between my-2">[m
[31m-                    <h4 className="font-[500] text-[#4F4F4F] ">Location</h4>[m
[31m-                    <p className="text-[#4F4F4F] ">South Africa</p>[m
[31m-                  </div>[m
[31m-                </div>[m
[31m-              </div>[m
[31m-[m
[31m-              <div className="mt-10 py-10 border-t">[m
[31m-                <h5 className="text-[#4F4F4F] text-xl">Mission Statement</h5>[m
[31m-[m
[31m-                <p className="text-[#4F4F4F] py-2 text-sm leading-6">[m
[31m-                  At Fey, our mission is to empower communities and drive[m
[31m-                  positive change by ensuring the efficient and transparent[m
[31m-                  operation of charitable initiatives. Through dedicated[m
[31m-                  administration, strategic fundraising, and strong governance,[m
[31m-                  we strive to maximize the impact of our programs and support[m
[31m-                  those in need. We are committed to fostering a culture of[m
[31m-                  compassion, integrity, and innovation, ensuring that every[m
[31m-                  resource is effectively managed to serve our beneficiaries.{" "}[m
[31m-                </p>[m
[32m+[m[32m          {job.requiredSkills && job.requiredSkills.length > 0 && ([m
[32m+[m[32m            <div className="my-5">[m
[32m+[m[32m              <h4 className="text-xl font-semibold">Skills</h4>[m
[32m+[m[32m              <div className="flex flex-wrap gap-2 my-2">[m
[32m+[m[32m                {job.requiredSkills.map((skill: string, index: number) => ([m
[32m+[m[32m                  <p key={index} className="bg-[#E0E0E0] px-3 py-1 rounded-sm text-sm">[m
[32m+[m[32m                    {skill}[m
[32m+[m[32m                  </p>[m
[32m+[m[32m                ))}[m
               </div>[m
             </div>[m
[31m-          </div>[m
[31m-[m
[31m-          {/* Required Skills */}[m
[31m-[m
[31m-          <div className="my-10">[m
[31m-            <h2 className="text-xl font-[500] text-[#4F4F4F]">[m
[31m-              Required Skills[m
[31m-            </h2>[m
[31m-[m
[31m-            <div className="my-6">[m
[31m-              <ol className="list-disc text-sm px-4 text-[#FFB3A6]">[m
[31m-                <li>Hard and Soft Skills</li>[m
[31m-              </ol>[m
[31m-[m
[31m-              <ol className="list-disc text-[#868686] px-4">[m
[31m-                <li>Fundraising & Grant Writing</li>[m
[31m-                <li>Communication & Public Speaking</li>[m
[31m-                <li>Problem-Solving</li>[m
[31m-                <li>Compliance & Legal Knowledge</li>[m
[31m-                <li>[m
[31m-                  Strong ability to manage records, schedules, and documents[m
[31m-                  efficiently[m
[31m-                </li>[m
[31m-              </ol>[m
[31m-[m
[31m-              <ol className="list-disc text-sm px-4 text-[#FFB3A6] mt-6">[m
[31m-                <li>Hard and Soft Skills</li>[m
[31m-              </ol>[m
[31m-[m
[31m-              <ol className="list-disc text-[#868686] px-4">[m
[31m-                <li>Microsoft Office</li>[m
[31m-              </ol>[m
[32m+[m[32m          )}[m
[32m+[m
[32m+[m[32m          {job.benefits && job.benefits.length > 0 && ([m
[32m+[m[32m            <div className="my-5">[m
[32m+[m[32m              <h4 className="text