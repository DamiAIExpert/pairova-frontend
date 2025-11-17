import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobsService, EmploymentType, JobPlacement } from "@/services/jobs.service";
import { toast } from "sonner";
import { countries } from "@/utils/countries";

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employmentType: [] as EmploymentType[],
    placement: "" as JobPlacement | "",
    experienceMinYrs: "",
    experienceMaxYrs: "",
    experienceLevel: "",
    requiredSkills: [] as string[],
    hardSoftSkills: [] as string[],
    qualifications: "",
    responsibilities: "",
    missionStatement: "",
    benefits: [] as string[],
    deadline: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    teamSize: "",
    locationCity: "",
    locationCountry: "",
    locationState: "",
    postalCode: "",
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [hardSoftSkillInput, setHardSoftSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const employmentTypes: { value: EmploymentType; label: string; icon: string }[] = [
    { value: "FULL_TIME", label: "Full Time", icon: "hugeicons:stop-watch" },
    { value: "PART_TIME", label: "Part Time", icon: "lucide:clock" },
    { value: "CONTRACT", label: "Contract", icon: "lucide:notebook-tabs" },
    { value: "VOLUNTEER", label: "Volunteer", icon: "la:handshake-solid" },
    { value: "INTERNSHIP", label: "Internship", icon: "lucide:graduation-cap" },
  ];

  const toggleEmploymentType = (type: EmploymentType) => {
    setFormData(prev => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter(t => t !== type)
        : [...prev.employmentType, type],
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill),
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit),
    }));
  };

  const addHardSoftSkill = () => {
    if (hardSoftSkillInput.trim() && !formData.hardSoftSkills.includes(hardSoftSkillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hardSoftSkills: [...prev.hardSoftSkills, hardSoftSkillInput.trim()],
      }));
      setHardSoftSkillInput("");
    }
  };

  const removeHardSoftSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      hardSoftSkills: prev.hardSoftSkills.filter(s => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a job title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (formData.employmentType.length === 0) {
      toast.error("Please select at least one employment type");
      return;
    }

    if (!formData.placement) {
      toast.error("Please select job placement");
      return;
    }

    if (!formData.locationCity || !formData.locationCountry) {
      toast.error("Please enter location details");
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        employmentType: formData.employmentType[0], // Use first selected type as primary
        placement: formData.placement as JobPlacement,
        experienceMinYrs: formData.experienceMinYrs ? parseInt(formData.experienceMinYrs) : undefined,
        experienceMaxYrs: formData.experienceMaxYrs ? parseInt(formData.experienceMaxYrs) : undefined,
        experienceLevel: formData.experienceLevel || undefined,
        requiredSkills: formData.requiredSkills && formData.requiredSkills.length > 0 ? formData.requiredSkills : undefined,
        hardSoftSkills: formData.hardSoftSkills && formData.hardSoftSkills.length > 0 ? formData.hardSoftSkills : undefined,
        qualifications: formData.qualifications || undefined,
        responsibilities: formData.responsibilities || undefined,
        missionStatement: formData.missionStatement || undefined,
        benefits: formData.benefits && formData.benefits.length > 0 ? formData.benefits : undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
        currency: formData.currency,
        locationCity: formData.locationCity,
        locationCountry: formData.locationCountry,
        locationState: formData.locationState || undefined,
        postalCode: formData.postalCode || undefined,
        status: "PUBLISHED" as const,
      };

      await JobsService.createNonprofitJob(jobData);
      
      toast.success("Job posted successfully!");
      
      // Navigate to jobs list after a short delay
      setTimeout(() => {
        navigate("/non-profit");
      }, 1500);
      
    } catch (error: any) {
      console.error("Failed to create job:", error);
      toast.error(error?.message || "Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isBasicInfoComplete = formData.title.trim() && formData.description.trim();
  const isAdditionalInfoComplete = formData.employmentType.length > 0 && formData.placement && formData.locationCity && formData.locationCountry;

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-white mx-5 my-5 rounded-md border border-black/30">
        {/* Basic Information */}
        <div className="px-5 py-10 border-b border-black/30">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Basic Information</h4>
            <Icon 
              icon="ic:baseline-check-circle" 
              className={`text-2xl ${isBasicInfoComplete ? 'text-green-500' : 'text-black/30'}`}
            />
          </div>

          <div>
            <div className="my-5">
              <label htmlFor="title" className="text-[#797979]">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Program Officer"
                required
              />
            </div>

            <div className="my-5">
              <label htmlFor="description" className="text-[#797979]">
                Role Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                rows={8}
                placeholder="Describe the role, responsibilities, qualifications, and what makes this opportunity unique..."
                required
              ></textarea>
            </div>

            <div className="my-5">
              <label htmlFor="qualifications" className="text-[#797979]">
                Qualifications
              </label>
              <textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => handleInputChange("qualifications", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                rows={6}
                placeholder="List the qualifications required for this role (e.g., education, experience, certifications)..."
              ></textarea>
            </div>

            <div className="my-5">
              <label htmlFor="responsibilities" className="text-[#797979]">
                Responsibilities
              </label>
              <textarea
                id="responsibilities"
                value={formData.responsibilities}
                onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                rows={6}
                placeholder="List the key responsibilities and duties for this role..."
              ></textarea>
            </div>

            <div className="my-5">
              <label htmlFor="missionStatement" className="text-[#797979]">
                Mission Statement
              </label>
              <textarea
                id="missionStatement"
                value={formData.missionStatement}
                onChange={(e) => handleInputChange("missionStatement", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
                placeholder="Describe the mission and values that guide this role and organization..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="px-5 py-10">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Additional Information</h4>
            <Icon
              icon="ic:baseline-check-circle"
              className={`text-2xl ${isAdditionalInfoComplete ? 'text-green-500' : 'text-black/30'}`}
            />
          </div>

          <div className="my-5">
            <h5 className="mb-2">
              Employment Type <span className="text-red-500">*</span>
            </h5>
            <div className="flex flex-wrap items-center gap-3 my-3">
              {employmentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleEmploymentType(type.value)}
                  className={`flex items-center gap-2 text-sm border rounded-md px-5 py-2 transition-colors ${
                    formData.employmentType.includes(type.value)
                      ? "bg-black text-white border-black"
                      : "border-black/30 hover:bg-black/10"
                  }`}
                >
                  <Icon icon={type.icon} />
                  {type.label}
                </button>
              ))}
            </div>
            {formData.employmentType.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.employmentType.map(t => employmentTypes.find(et => et.value === t)?.label).join(", ")}
              </p>
            )}
          </div>

          <div className="grid my-10 grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label htmlFor="placement">
                Job Placement <span className="text-red-500">*</span>
              </label>
              <Select value={formData.placement} onValueChange={(value) => handleInputChange("placement", value)}>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select job placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Job Placement</SelectLabel>
                    <SelectItem value="ONSITE">Onsite</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label htmlFor="experienceMinYrs">Experience (Min Years)</label>
              <input
                id="experienceMinYrs"
                type="number"
                min="0"
                value={formData.experienceMinYrs}
                onChange={(e) => handleInputChange("experienceMinYrs", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., 2"
              />
            </div>

            <div className="w-full">
              <label htmlFor="experienceMaxYrs">Experience (Max Years)</label>
              <input
                id="experienceMaxYrs"
                type="number"
                min="0"
                value={formData.experienceMaxYrs}
                onChange={(e) => handleInputChange("experienceMaxYrs", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., 5"
              />
            </div>

            <div className="w-full">
              <label htmlFor="experienceLevel">Experience Level</label>
              <input
                id="experienceLevel"
                type="text"
                value={formData.experienceLevel}
                onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., 1-3 years, Entry Level, Senior"
              />
            </div>

            <div className="w-full">
              <label htmlFor="deadline">Application Deadline</label>
              <input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="w-full">
              <label htmlFor="salaryMin">Salary Range (Min)</label>
              <div className="flex gap-2 my-3">
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger className="w-[120px] py-[23px] px-4 border border-black/30 rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                  className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="salaryMax">Salary Range (Max)</label>
              <input
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="10000"
              />
            </div>

            <div className="w-full md:col-span-2">
              <label htmlFor="teamSize">Team Size (Optional)</label>
              <input
                id="teamSize"
                type="text"
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., 10-20 people"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="my-5">
            <label htmlFor="requiredSkills">Required Skills</label>
            <div className="flex gap-2 my-3">
              <input
                id="requiredSkills"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter a skill and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon icon="mdi:close" className="text-lg" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hard and Soft Skills */}
          <div className="my-5">
            <label htmlFor="hardSoftSkills">Hard and Soft Skills</label>
            <div className="flex gap-2 my-3">
              <input
                id="hardSoftSkills"
                type="text"
                value={hardSoftSkillInput}
                onChange={(e) => setHardSoftSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHardSoftSkill();
                  }
                }}
                className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter a hard or soft skill and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addHardSoftSkill}
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.hardSoftSkills && formData.hardSoftSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.hardSoftSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeHardSoftSkill(skill)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon icon="mdi:close" className="text-lg" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="my-5">
            <label htmlFor="benefits">Benefits</label>
            <div className="flex gap-2 my-3">
              <input
                id="benefits"
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBenefit();
                  }
                }}
                className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter a benefit and press Enter or click Add"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icon icon="mdi:close" className="text-lg" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <h5 className="font-[500] text-black/40 mb-4">
              Location <span className="text-red-500">*</span>
            </h5>

            <div className="grid my-5 grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select value={formData.locationCountry} onValueChange={(value) => handleInputChange("locationCountry", value)}>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label htmlFor="state">Province / State</label>
                <input
                  id="state"
                  type="text"
                  value={formData.locationState}
                  onChange={(e) => handleInputChange("locationState", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., London"
                />
              </div>

              <div className="w-full">
                <label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.locationCity}
                  onChange={(e) => handleInputChange("locationCity", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., London"
                  required
                />
              </div>

              <div className="w-full">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., WC1N 3AX"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 justify-end mt-10 pt-6 border-t border-black/30">
            <button
              type="button"
              onClick={() => navigate("/non-profit")}
              className="px-8 py-3 border border-black/30 rounded-md hover:bg-black/5 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Icon icon="material-symbols:add" className="text-xl" />
                  Post Job
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateJob;
