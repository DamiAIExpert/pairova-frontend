import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import { JobsService } from "@/services/jobs.service";
import { ProfileService } from "@/services/profile.service";
import { useIsAuthenticated, useUser } from "@/store/authStore";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { handleApiError } from "@/services/api";

const Apply = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  const [job, setJob] = useState<any>(null);
  const [, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Application form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
    linkedinUrl: "",
    portfolioUrl: "",
    yearsOfExperience: "",
    currentEmployer: "",
    expectedSalary: "",
    availabilityDate: "",
    willingToRelocate: false,
    referenceContact: "",
  });

  // Dynamic sections
  const [experiences, setExperiences] = useState<Array<{
    id: string;
    company: string;
    position: string;
    employmentType: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    location: string;
    state: string;
    postalCode: string;
    description: string;
  }>>([]);

  const [education, setEducation] = useState<Array<{
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
  }>>([]);

  const [certifications, setCertifications] = useState<Array<{
    id: string;
    file: File | null;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
  }>>([]);

  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [newHardSkill, setNewHardSkill] = useState("");
  const [newTechSkill, setNewTechSkill] = useState("");

  // Filter state (for sidebar consistency)
  const [filters, setFilters] = useState({
    jobTypes: ["Full Time"],
    experience: ["1 - 3 years"],
    openToVolunteer: false,
    jobTimeline: "",
    salaryRange: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/seeker/job/${id}/apply`);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // Load job details
        if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          const jobData = await JobsService.getJobById(id);
          setJob(jobData);
        } else {
          // Mock job for demo
          setJob({
            id: id || "1",
            title: "Charity Manager",
            organization: { name: "Quantum SHAD", logo: "/Images/company-logo.AVIF" },
          });
        }

        // Load user profile (gracefully handle if profile doesn't exist yet)
        let profileData = null;
        try {
          profileData = await ProfileService.getProfile();
          setProfile(profileData);
        } catch (profileError: any) {
          // If 401/403, user might not have applicant profile yet - that's okay
          if (profileError?.response?.status !== 401 && profileError?.response?.status !== 403) {
            console.error("Failed to load profile:", profileError);
          }
          // Continue with form pre-fill using user data only
        }

        // Construct full name from firstName and lastName
        const fullName = profileData?.firstName && profileData?.lastName
          ? `${profileData.firstName} ${profileData.lastName}`
          : profileData?.firstName || profileData?.lastName || (user?.firstName && user?.lastName)
          ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
          : "";

        // Pre-fill form with user data
        setFormData((prev) => ({
          ...prev,
          fullName: fullName,
          email: user?.email || "",
          phone: (profileData as any)?.phone || (user as any)?.phone || "",
          portfolioUrl: profileData?.portfolioUrl || "",
        }));
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isAuthenticated, navigate, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Experience handlers
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        employmentType: "Full Time",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        location: "",
        state: "",
        postalCode: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const toggleEmploymentType = (expId: string, type: string) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === expId ? { ...exp, employmentType: type } : exp
      )
    );
  };

  // Education handlers
  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  // Certification handlers
  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: Date.now().toString(),
        file: null,
        name: "",
        issuingOrganization: "",
        issueDate: "",
        credentialId: "",
        credentialUrl: "",
      },
    ]);
  };

  const updateCertification = (id: string, field: string, value: any) => {
    setCertifications(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const handleCertFileChange = (id: string, file: File | null) => {
    updateCertification(id, "file", file);
  };

  // Skills handlers
  const addHardSkill = () => {
    if (newHardSkill.trim() && !hardSkills.includes(newHardSkill.trim())) {
      setHardSkills([...hardSkills, newHardSkill.trim()]);
      setNewHardSkill("");
    }
  };

  const removeHardSkill = (skill: string) => {
    setHardSkills(hardSkills.filter((s) => s !== skill));
  };

  const addTechSkill = () => {
    if (newTechSkill.trim() && !techSkills.includes(newTechSkill.trim())) {
      setTechSkills([...techSkills, newTechSkill.trim()]);
      setNewTechSkill("");
    }
  };

  const removeTechSkill = (skill: string) => {
    setTechSkills(techSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Upload resume if provided
      let resumeUploadId: string | undefined;
      if (formData.resume) {
        // TODO: Implement file upload via StorageService
        // resumeUploadId = await StorageService.uploadFile(formData.resume);
        console.log("Resume upload pending:", formData.resume.name);
      }

      // Step 2: Update profile with experience, education, and skills
      // This ensures the user's profile is current when they apply
      if (experiences.length > 0 || education.length > 0 || hardSkills.length > 0 || techSkills.length > 0) {
        try {
          // Note: You may need to call separate endpoints for experience and education
          await ProfileService.updateProfile({
            skills: [...hardSkills, ...techSkills],
            // Add other profile fields as needed
          });
          console.log("Profile updated with latest data");
        } catch (profileErr) {
          console.warn("Failed to update profile, continuing with application:", profileErr);
        }
      }

      // Step 3: Submit the comprehensive application
      const comprehensiveData = {
        jobId: id!,
        coverLetter: formData.coverLetter,
        resumeUploadId,
        // Personal details
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        yearsOfExperience: formData.yearsOfExperience,
        currentEmployer: formData.currentEmployer,
        expectedSalary: formData.expectedSalary,
        availabilityDate: formData.availabilityDate,
        willingToRelocate: formData.willingToRelocate,
        referenceContact: formData.referenceContact,
        // Dynamic sections
        experiences: experiences.map(({ id, ...exp }) => exp), // Remove temporary ID
        education: education.map(({ id, ...edu }) => edu),
        certifications: certifications.map(({ id, file, ...cert }) => cert), // Remove file object
        hardSkills,
        techSkills,
      };

      // Call the comprehensive backend API
      const response = await JobsService.applyForJobComprehensive(comprehensiveData);
      
      console.log("✅ Application submitted successfully:", response);

      // Show success and navigate
      alert("✅ Application submitted successfully!\n\nYour comprehensive application has been submitted with:\n- Personal details\n- Experience history\n- Education background\n- Certifications\n- Skills\n\nWe'll review your application and get back to you soon.");
      navigate("/seeker/finder");
    } catch (err: any) {
      console.error("Failed to submit application:", err);
      
      // Handle 401 errors (token expired) - redirect to login instead of showing alert
      if (err.status === 401) {
        // API client already handles redirect, but we can add a user-friendly message
        // Don't show alert for 401 - redirect is already happening
        setSubmitting(false);
        return;
      }
      
      // For other errors, use handleApiError utility and show message
      const errorMessage = handleApiError(err);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
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

  const handleJobTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({ ...prev, jobTypes: [...prev.jobTypes, type] }));
    } else {
      setFilters(prev => ({ ...prev, jobTypes: prev.jobTypes.filter(t => t !== type) }));
    }
  };

  const handleExperienceChange = (exp: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({ ...prev, experience: [...prev.experience, exp] }));
    } else {
      setFilters(prev => ({ ...prev, experience: prev.experience.filter(e => e !== exp) }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg">Loading application form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/80"
        >
          Go Back
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
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-black/30 px-5 py-5">
          <Icon
            icon="ph:caret-circle-left-light"
            className="text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <h3 className="font-semibold text-sm">Back</h3>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white mx-5 my-2 px-10 py-10 rounded-md">
          <h1 className="text-2xl font-semibold mb-2">Job Application</h1>
          {job && (
            <p className="text-gray-600 mb-8">
              Applying for <span className="font-semibold">{job.title}</span> at{" "}
              <span className="font-semibold">{job.organization?.name}</span>
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Application Details Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Application Details</h2>
                <Icon icon="ph:check-circle" className="text-2xl text-green-600" />
              </div>
              <div className="px-5 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio/Website</label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g., 5 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current/Most Recent Employer</label>
                    <input
                      type="text"
                      name="currentEmployer"
                      value={formData.currentEmployer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Salary (USD/month)</label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g., $3000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability to Start</label>
                    <input
                      type="date"
                      name="availabilityDate"
                      value={formData.availabilityDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reference Contact</label>
                    <input
                      type="text"
                      name="referenceContact"
                      value={formData.referenceContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Name and contact info"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="willingToRelocate"
                      checked={formData.willingToRelocate}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Willing to relocate</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Attach Files Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Attach Files</h2>
                <Icon icon="ph:check-circle" className="text-2xl text-green-600" />
              </div>
              <div className="px-5 py-6">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/30 rounded-md py-8 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Icon icon="ph:upload" className="text-4xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Drag and Drop or <span className="text-black underline">Choose File</span> for upload
                  </span>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                {formData.resume && (
                  <div className="mt-4 flex items-center justify-between p-3 border border-black/20 rounded-md">
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:file-text" className="text-2xl text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">{formData.resume.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.resume.size / 1024).toFixed(0)}kb
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, resume: null }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon icon="ph:x" className="text-xl" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Cover Letter</h2>
                <Icon icon="ph:check-circle" className="text-2xl text-green-600" />
              </div>
              <div className="px-5 py-6">
                <label className="block text-sm font-medium mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  placeholder="Tell us why you're a great fit for this position..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.coverLetter.length} characters
                </p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Experience</h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1 text-sm text-black hover:opacity-70"
                >
                  <Icon icon="ph:plus-circle" className="text-xl" />
                  Add
                </button>
              </div>
              <div className="px-5 py-6">
                {experiences.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No experience added yet. Click "Add" to get started.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border border-black/10 rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        >
                          <Icon icon="ph:x-circle" className="text-xl" />
                        </button>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Employment Type</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Full Time", "Freelance", "Remote", "Hybrid"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => toggleEmploymentType(exp.id, type)}
                                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                                  exp.employmentType === type
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-black/30 hover:border-black"
                                }`}
                              >
                                {type === exp.employmentType && (
                                  <Icon icon="ph:circle-fill" className="inline text-xs mr-1" />
                                )}
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Quantum SHAD"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Job Role</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Charity Manager"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.currentlyWorking}
                              onChange={(e) => updateExperience(exp.id, "currentlyWorking", e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm">Same as company address</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="September 2010"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              disabled={exp.currentlyWorking}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                              placeholder="August 2018"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Province / State</label>
                            <input
                              type="text"
                              value={exp.state}
                              onChange={(e) => updateExperience(exp.id, "state", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Select Province / State"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Postal Code</label>
                            <input
                              type="text"
                              value={exp.postalCode}
                              onChange={(e) => updateExperience(exp.id, "postalCode", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="ex 011 - 222"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            placeholder="Type here..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Education</h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1 text-sm text-black hover:opacity-70"
                >
                  <Icon icon="ph:plus-circle" className="text-xl" />
                  Add
                </button>
              </div>
              <div className="px-5 py-6">
                {education.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No education added yet. Click "Add" to get started.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="border border-black/10 rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        >
                          <Icon icon="ph:x-circle" className="text-xl" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">School</label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Select School"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Select Degree"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Course</label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy}
                              onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Select Course"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Grade</label>
                            <input
                              type="text"
                              value={edu.grade}
                              onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="First Class Honours"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <textarea
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            placeholder="Notes..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Add Certificates</h2>
                <button
                  type="button"
                  onClick={addCertification}
                  className="flex items-center gap-1 text-sm text-black hover:opacity-70"
                >
                  <Icon icon="ph:plus-circle" className="text-xl" />
                  Add
                </button>
              </div>
              <div className="px-5 py-6">
                {certifications.length === 0 ? (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/30 rounded-md py-8 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Icon icon="ph:upload" className="text-4xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Drag and Drop or <span className="text-black underline">Choose file</span> for upload
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        // Add first certification when file is selected
                        if (e.target.files?.[0]) {
                          addCertification();
                        }
                      }}
                    />
                  </label>
                ) : (
                  <div className="space-y-6">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="border border-black/10 rounded-md p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeCertification(cert.id)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        >
                          <Icon icon="ph:x-circle" className="text-xl" />
                        </button>

                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/30 rounded-md py-6 cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                          <Icon icon="ph:upload" className="text-3xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Drag and Drop or <span className="text-black underline">Choose file</span> for upload
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleCertFileChange(cert.id, file);
                            }}
                          />
                        </label>

                        {cert.file && (
                          <div className="mb-4 flex items-center justify-between p-3 border border-black/20 rounded-md">
                            <div className="flex items-center gap-2">
                              <Icon icon="ph:file-text" className="text-2xl text-gray-600" />
                              <div>
                                <p className="text-sm font-medium">{cert.file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(cert.file.size / 1024).toFixed(0)}kb · 2 minutes left
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCertFileChange(cert.id, null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Icon icon="ph:x" className="text-xl" />
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Certification Name</label>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Professional Business Administrator"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Issuing Organization</label>
                            <input
                              type="text"
                              value={cert.issuingOrganization}
                              onChange={(e) => updateCertification(cert.id, "issuingOrganization", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Google.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Issue Date</label>
                            <input
                              type="month"
                              value={cert.issueDate}
                              onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Credential ID</label>
                            <input
                              type="text"
                              value={cert.credentialId}
                              onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                              className="w-full px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Credential ID"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="border border-black/20 rounded-md mb-6">
              <div className="px-5 py-4 border-b border-black/20 flex items-center justify-between">
                <h2 className="font-semibold">Skills</h2>
              </div>
              <div className="px-5 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hard/Soft Skills */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Hard / Soft Skill</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newHardSkill}
                        onChange={(e) => setNewHardSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHardSkill())}
                        className="flex-1 px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter skill"
                      />
                      <button
                        type="button"
                        onClick={addHardSkill}
                        className="px-4 py-2.5 bg-black text-white rounded-md hover:bg-black/80 transition-colors"
                      >
                        <Icon icon="ph:plus" className="text-lg" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hardSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-1 border border-black/20 rounded-full text-xs"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeHardSkill(skill)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Icon icon="ph:x" className="text-sm" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technical Skills */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Technical Skill</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTechSkill}
                        onChange={(e) => setNewTechSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechSkill())}
                        className="flex-1 px-4 py-2.5 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter skill"
                      />
                      <button
                        type="button"
                        onClick={addTechSkill}
                        className="px-4 py-2.5 bg-black text-white rounded-md hover:bg-black/80 transition-colors"
                      >
                        <Icon icon="ph:plus" className="text-lg" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {techSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-1 border border-black/20 rounded-full text-xs"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeTechSkill(skill)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Icon icon="ph:x" className="text-sm" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {hardSkills.length === 0 && techSkills.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8 mt-4 border-t border-black/10">
                    No skills added yet. Type a skill and click the "+" button.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border border-black/30 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-black text-white rounded-md hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
