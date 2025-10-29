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
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { ProfileService } from "@/services/profile.service";

interface ExperienceData {
  employmentType: string;
  companyName: string;
  jobRole: string;
  startDate: string;
  endDate: string;
  state: string;
  postalCode: string;
  description: string;
}

const Experience = () => {
  const navigate = useNavigate();
  const { setStepCompleted } = useOnboardingStore();
  
  const [formData, setFormData] = useState<ExperienceData>({
    employmentType: "",
    companyName: "",
    jobRole: "",
    startDate: "",
    endDate: "",
    state: "",
    postalCode: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing experience data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await ProfileService.getProfile();
        if (profile?.experience) {
          setFormData(profile.experience);
        }
      } catch (err) {
        console.error("Failed to load experience:", err);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field: keyof ExperienceData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.companyName || !formData.jobRole) {
      setError("Please fill in company name and job role");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend
      await ProfileService.updateProfileStep({
        experience: formData,
      } as any);

      // Mark step as completed
      setStepCompleted('experience');
      
      // Navigate to next step
      navigate('/seeker/create-account/skill');
    } catch (err: any) {
      console.error("Failed to save experience:", err);
      setError(err.response?.data?.message || "Failed to save experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Volunteer",
  ];

  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden cursor-pointer hover:text-gray-600"
          onClick={() => navigate('/seeker/create-account/education')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Experience</h4>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="my-10 px-5">
            <div className="w-full">
              <label htmlFor="employmentType" className="text-sm font-medium">
                Employment Type
              </label>
              <Select 
                value={formData.employmentType} 
                onValueChange={(value) => handleInputChange('employmentType', value)}
                disabled={loading}
              >
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Employment Types</SelectLabel>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-5 my-5">
              <div className="w-full">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Company's Name"
                  disabled={loading}
                />
              </div>

              <div className="w-full">
                <label htmlFor="jobRole" className="text-sm font-medium">
                  Job Role <span className="text-red-500">*</span>
                </label>
                <input
                  id="jobRole"
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => handleInputChange('jobRole', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Job Role"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="my-10">
              <h2 className="font-semibold">Job Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                <div className="w-full">
                  <label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={loading}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={loading}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="state" className="text-sm font-medium">
                    Province / State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter State"
                    disabled={loading}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="postalCode" className="text-sm font-medium">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter Postal Code"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="resize-none w-full focus:outline-none border border-black/30 rounded-md py-4 px-4 my-3"
                  rows={8}
                  placeholder="Describe your role and responsibilities..."
                  disabled={loading}
                ></textarea>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
              <div>
                <button 
                  onClick={() => navigate('/seeker/create-account/education')}
                  className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
              </div>
              <div>
                <button 
                  onClick={handleSubmit}
                  className={`bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading ? 'opacity-50' : ''
                  }`}
                  disabled={loading || !formData.companyName || !formData.jobRole}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save and Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
