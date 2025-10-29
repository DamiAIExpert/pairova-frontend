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
import { Icon } from "@iconify/react";
import { useState } from "react";
import { countries } from "@/utils/countries";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/authStore";
import { ProfileService } from "@/services/profile.service";
import { useFileUpload } from "@/hooks/useFileUpload";

const AccountInfo = () => {
  const navigate = useNavigate();
  const { setStepCompleted } = useOnboardingStore();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    workPosition: "",
    country: "",
    photoUrl: "", // Cloudinary URL (photoUrl in backend)
    profilePhoto: null as File | null, // Local preview only
  });

  // Use the file upload hook for avatar
  const {
    uploading: uploadingAvatar,
    error: uploadError,
    uploadProgress,
    uploadFile,
    resetUpload,
  } = useFileUpload({
    maxSize: 2 * 1024 * 1024, // 2MB for profile pictures
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    kind: 'avatar',
    onSuccess: (url) => {
      setFormData((prev) => ({ ...prev, photoUrl: url }));
      console.log('✅ Avatar uploaded to Cloudinary:', url);
    },
    onError: (errorMsg) => {
      setError(errorMsg);
    },
  });

  // Get user initials from email or name
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U"; // Default fallback
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set local preview immediately
    setFormData((prev) => ({ ...prev, profilePhoto: file }));

    // Upload to Cloudinary
    await uploadFile(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null, photoUrl: "" }));
    resetUpload();
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.workPosition || !formData.country) {
      setError("Please fill in work position and country");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend (including Cloudinary photo URL if uploaded)
      await ProfileService.updateProfileStep({
        country: formData.country,
        photoUrl: formData.photoUrl || undefined, // Include Cloudinary URL
        // workPosition would need to be added to the profile schema if needed
      });

      // Mark this step as completed
      setStepCompleted('account-info');
      
      // Navigate to next step
      navigate('/seeker/create-account/personal-information');
    } catch (err: any) {
      console.error("Failed to save account info:", err);
      setError(err.response?.data?.message || "Failed to save account information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="my-8">
        <Icon icon="line-md:arrow-left-circle" className="text-2xl my-3 md:hidden" />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md min-h-screen relative pb-[100px] md:pb-0">
          <div className="py-5 px-5  border-b border-black/30">
            <h4 className="font-semibold">Account</h4>
            <p className="text-xs text-[#797979] py-1">
              Please configure and fill in your information
            </p>
          </div>

          <div className="px-5 py-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Picture */}
              {formData.photoUrl ? (
                // Show Cloudinary URL (uploaded avatar)
                <img
                  src={formData.photoUrl}
                  alt="profile"
                  className="w-[120px] h-[120px] rounded-[50%] object-cover"
                />
              ) : formData.profilePhoto ? (
                // Show local preview while uploading
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="profile preview"
                  className="w-[120px] h-[120px] rounded-[50%] object-cover"
                />
              ) : (
                // Show default avatar with initials
                <div className="w-[120px] h-[120px] rounded-[50%] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {getUserInitials()}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="border border-black/30 rounded-md py-3 px-8 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50">
                  <label htmlFor="upload" className={`cursor-pointer ${uploadingAvatar ? 'cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      id="upload"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden w-full"
                      onChange={handleFileUpload}
                      disabled={uploadingAvatar}
                    />
                    <p>{uploadingAvatar ? 'Uploading...' : 'Upload Photo'}</p>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadingAvatar && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span className="text-sm text-gray-600">Uploading... {uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Success */}
                {formData.photoUrl && !uploadingAvatar && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Icon icon="mdi:check-circle" />
                    Photo uploaded successfully!
                  </p>
                )}

                {/* Upload Error */}
                {uploadError && !uploadingAvatar && (
                  <p className="text-sm text-red-600">{uploadError}</p>
                )}

                {/* Remove Button */}
                {(formData.photoUrl || formData.profilePhoto) && (
                  <button
                    className="bg-black py-3 px-8 rounded-md text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                    onClick={handleRemovePhoto}
                    disabled={uploadingAvatar}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload your profile picture (JPG, PNG recommended, max 2MB)
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 px-5">
            <div className="w-full">
              <label htmlFor="workPosition" className="text-sm font-medium">
                Work Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="workPosition"
                value={formData.workPosition}
                onChange={(e) => handleInputChange("workPosition", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter work position"
              />
            </div>

            <div className="w-full">
              <label htmlFor="country" className="text-sm font-medium">
                Select Country <span className="text-red-500">*</span>
              </label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
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
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full bg-white">
            {/* <button>Back</button> */}
            <div className="flex justify-end">
              <button
                className={`bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading ? 'opacity-50' : ''
                }`}
                onClick={handleSubmit}
                disabled={loading || !formData.workPosition || !formData.country}
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

export default AccountInfo;
