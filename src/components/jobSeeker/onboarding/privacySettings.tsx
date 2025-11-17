import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { PrivacyService, type PrivacySettings } from "@/services/privacy.service";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/authStore";

interface DataCategorySettings {
  personalInformation: boolean;
  genderData: boolean;
  location: boolean;
  experience: boolean;
  skills: boolean;
  certificates: boolean;
  bio: boolean;
}

const PrivacySettingsOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Check if we're in onboarding flow or standalone page
  const isOnboardingFlow = location.pathname.includes('/create-account/privacy-settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Granular category settings
  const [categorySettings, setCategorySettings] = useState<DataCategorySettings>({
    personalInformation: true,
    genderData: true,
    location: true,
    experience: true,
    skills: true,
    certificates: true,
    bio: true,
  });

  // Backend privacy settings
  const [_backendSettings, setBackendSettings] = useState<PrivacySettings | null>(null);

  // Load existing privacy settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await PrivacyService.getPrivacySettings();
        setBackendSettings(settings);
        
        // Initialize categories from backend granular settings if available
        if (settings.allowPersonalInformation !== undefined) {
          setCategorySettings({
            personalInformation: settings.allowPersonalInformation ?? true,
            genderData: settings.allowGenderData ?? true,
            location: settings.allowLocation ?? true,
            experience: settings.allowExperience ?? true,
            skills: settings.allowSkills ?? true,
            certificates: settings.allowCertificates ?? true,
            bio: settings.allowBio ?? true,
          });
        } else if (settings.privacyUpdatedAt) {
          // Fallback: If granular settings not available, use allowAiTraining
          const allEnabled = settings.allowAiTraining;
          setCategorySettings({
            personalInformation: allEnabled,
            genderData: allEnabled,
            location: allEnabled,
            experience: allEnabled,
            skills: allEnabled,
            certificates: allEnabled,
            bio: allEnabled,
          });
        }
      } catch (err: any) {
        console.error("Failed to load privacy settings:", err);
        // Use defaults if loading fails
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleCategoryToggle = (category: keyof DataCategorySettings, value: boolean) => {
    setCategorySettings(prev => ({ ...prev, [category]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      // Update backend privacy settings with granular categories
      // Backend will automatically update allowAiTraining based on whether any category is enabled
      const updated = await PrivacyService.updatePrivacySettings({
        // Send granular category settings
        allowPersonalInformation: categorySettings.personalInformation,
        allowGenderData: categorySettings.genderData,
        allowLocation: categorySettings.location,
        allowExperience: categorySettings.experience,
        allowSkills: categorySettings.skills,
        allowCertificates: categorySettings.certificates,
        allowBio: categorySettings.bio,
        // Backend will automatically set allowAiTraining, allowProfileIndexing, and allowDataAnalytics
        // based on whether any category is enabled
        allowThirdPartySharing: false, // Keep third-party sharing disabled by default
      });

      setBackendSettings(updated);

      // Navigate based on context
      if (isOnboardingFlow) {
        // After onboarding, go to dashboard
        if (user?.role === 'applicant') {
          navigate("/seeker");
        } else if (user?.role === 'nonprofit') {
          navigate("/non-profit");
        } else {
          navigate("/seeker");
        }
      } else {
        // Standalone page - go back or to dashboard
        navigate("/seeker");
      }
    } catch (err: any) {
      console.error("Failed to save privacy settings:", err);
      setError(err.response?.data?.message || "Failed to save privacy settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isOnboardingFlow ? "my-8" : "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"}>
      {isOnboardingFlow ? (
        <>
          <Icon
            icon="line-md:arrow-left-circle"
            className="text-2xl my-3 md:hidden cursor-pointer hover:text-gray-600"
            onClick={() => navigate('/seeker/create-account/other-attachments')}
          />
          <h2 className="font-semibold text-xl">Form</h2>
        </>
      ) : (
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Icon icon="mdi:arrow-left" className="text-xl text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
          </div>
          <p className="text-gray-600 mt-2 ml-[52px]">
            Control how your data is used for AI job recommendations
          </p>
        </div>
      )}

      <div className={isOnboardingFlow ? "" : "max-w-3xl mx-auto"}>
        <div className={`bg-white border border-black/30 ${isOnboardingFlow ? 'my-5 rounded-md relative pb-[100px]' : 'rounded-lg shadow-md overflow-hidden'} `}>
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Privacy Settings</h4>
          </div>

          <div className="flex items-center gap-1 px-5 mt-5">
            <Icon
              icon="gridicons:notice-outline"
              className="text-2xl rotate-180 text-[#AAAAAA]"
            />
            <p className="text-[#AAAAAA] text-sm">Set the data to be used by the model</p>
          </div>

        {error && (
          <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="px-5 py-5 space-y-4">
          {/* Personal Information */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.personalInformation ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Personal Information</span>
            </div>
            <Switch
              checked={categorySettings.personalInformation}
              onCheckedChange={(checked) => handleCategoryToggle('personalInformation', checked)}
              disabled={saving}
            />
          </div>

          {/* Gender Data */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.genderData ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Gender Data</span>
            </div>
            <Switch
              checked={categorySettings.genderData}
              onCheckedChange={(checked) => handleCategoryToggle('genderData', checked)}
              disabled={saving}
            />
          </div>

          {/* Location */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.location ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Location</span>
            </div>
            <Switch
              checked={categorySettings.location}
              onCheckedChange={(checked) => handleCategoryToggle('location', checked)}
              disabled={saving}
            />
          </div>

          {/* Experience */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.experience ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Experience</span>
            </div>
            <Switch
              checked={categorySettings.experience}
              onCheckedChange={(checked) => handleCategoryToggle('experience', checked)}
              disabled={saving}
            />
          </div>

          {/* Skills */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.skills ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Skills</span>
            </div>
            <Switch
              checked={categorySettings.skills}
              onCheckedChange={(checked) => handleCategoryToggle('skills', checked)}
              disabled={saving}
            />
          </div>

          {/* Certificates */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.certificates ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Certificates</span>
            </div>
            <Switch
              checked={categorySettings.certificates}
              onCheckedChange={(checked) => handleCategoryToggle('certificates', checked)}
              disabled={saving}
            />
          </div>

          {/* Bio */}
          <div className="flex items-center justify-between border border-black/30 py-3 px-4 rounded-md">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enable test"
                className="border border-black/30 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
                value={categorySettings.bio ? "Enabled" : "Disabled"}
              />
              <span className="text-sm font-medium">Bio</span>
            </div>
            <Switch
              checked={categorySettings.bio}
              onCheckedChange={(checked) => handleCategoryToggle('bio', checked)}
              disabled={saving}
            />
          </div>
        </div>

        {isOnboardingFlow ? (
          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button
                onClick={() => navigate('/seeker/create-account/other-attachments')}
                className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                ← Back
              </button>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className={`bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  saving ? 'opacity-50' : ''
                }`}
                disabled={saving}
              >
                {saving ? (
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
        ) : (
          <div className="border-t border-gray-200 py-4 px-5 flex items-center justify-end gap-4 bg-white">
            <button
              onClick={handleSubmit}
              className={`bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                saving ? 'opacity-50' : ''
              }`}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsOnboarding;

