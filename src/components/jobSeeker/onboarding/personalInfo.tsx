import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { ProfileService } from "@/services/profile.service";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { setStepCompleted } = useOnboardingStore();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    language: "",
    gender: "male",
    languageProficiency: "native",
  });

  // Pre-fill form with user data from registration
  useEffect(() => {
    if (user) {
      // Parse full name if available, or use firstName/lastName if they exist
      const nameParts = user.email?.split('@')[0].split('.') || [];
      
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || nameParts[0] || "",
        lastName: user.lastName || nameParts[1] || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend
      await ProfileService.updateProfileStep({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender.toUpperCase() as any,
        dob: formData.dob || undefined,
      });

      // Mark step as completed
      setStepCompleted('personal-information');
      
      // Navigate to next step
      navigate('/seeker/create-account/address');
    } catch (err: any) {
      console.error("Failed to save personal info:", err);
      setError(err.response?.data?.message || "Failed to save personal information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md  relative pb-[200px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Personal Information</h4>
          </div>

          <div className="my-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label htmlFor="firstName">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter First Name"
              />
            </div>

            <div className="w-full">
              <label htmlFor="lastName">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="w-full">
              <label htmlFor="email">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                value={formData.email}
                readOnly
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 bg-gray-50 cursor-not-allowed"
                placeholder="Enter Email Address"
                title="Email cannot be changed"
              />
            </div>

            <div className="w-full">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="w-full">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Date of Birth"
              />
            </div>

            <div className="w-full">
              <label htmlFor="language">Select Language</label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Pick Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="" className="mb-3">
                Select Gender
              </label>

              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" className="" />
                  <label htmlFor="">Male</label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" />
                  <label htmlFor="">Female</label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <label htmlFor="" className="mb-3">
                Language Proficiency
              </label>

              <RadioGroup
                value={formData.languageProficiency}
                onValueChange={(value) => handleInputChange('languageProficiency', value)}
                className="flex items-center gap-4 flex-wrap"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="native" className="" />
                  <label htmlFor="">Native</label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="professional" />
                  <label htmlFor="">Professional</label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="intermediate" />
                  <label htmlFor="">Intermediate</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button 
                onClick={() => navigate('/seeker/create-account')}
                className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Back
              </button>
            </div>
            <div className="">
              <button 
                onClick={handleSubmit}
                className={`bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading ? 'opacity-50' : ''
                }`}
                disabled={loading || !formData.firstName || !formData.lastName || !formData.email}
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
  );
};

export default PersonalInfo;
