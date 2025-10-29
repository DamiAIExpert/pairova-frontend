import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { PrivacyService, type PrivacySettings } from "@/services/privacy.service";

const PrivacyModal = ({
  setShowPrivacySetting,
}: {
  setShowPrivacySetting: (newValue: boolean) => void;
}) => {
  const [settings, setSettings] = useState<PrivacySettings>({
    userId: '',
    allowAiTraining: true,
    allowProfileIndexing: true,
    allowDataAnalytics: true,
    allowThirdPartySharing: false,
    privacyUpdatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await PrivacyService.getPrivacySettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Failed to load privacy settings:', err);
      // If loading fails, use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      await PrivacyService.updatePrivacySettings({
        allowAiTraining: settings.allowAiTraining,
        allowProfileIndexing: settings.allowProfileIndexing,
        allowDataAnalytics: settings.allowDataAnalytics,
        allowThirdPartySharing: settings.allowThirdPartySharing,
      });

      // Mark as configured in localStorage
      localStorage.setItem('privacySettingsConfigured', 'true');
      
      setShowPrivacySetting(false);
    } catch (err: any) {
      console.error('Failed to save privacy settings:', err);
      setError(err.response?.data?.message || 'Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Mark as configured even if cancelled (user dismissed the prompt)
    localStorage.setItem('privacySettingsConfigured', 'true');
    setShowPrivacySetting(false);
  };

  if (loading) {
    return (
      <div className="bg-black/30 w-full h-full fixed top-0 z-[1000] flex items-center justify-center">
        <div className="bg-white py-10 px-10 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading privacy settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 w-full h-full fixed top-0 z-[1000] ">
      <div className="bg-white py-5 px-5 rounded-xl w-[95%] md:w-[600px] h-[90%] mx-auto my-[50px] overflow-y-scroll">
        <h3 className="text-center text-xl font-[500]">Privacy Settings</h3>

        <div className="flex items-center gap-1 mt-7">
          <Icon
            icon="gridicons:notice-outline"
            className="text-2xl rotate-180 text-[#AAAAAA]"
          />

          <p className="text-[#AAAAAA]">Set the data to be used by the model</p>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="my-3">
          {/* AI Model Training */}
          <div className="my-6">
            <h3 className="font-semibold text-lg my-2">AI Model Training</h3>
            <p className="text-sm text-gray-600 mb-3">
              Allow your data to be used for training and improving our AI matching models.
            </p>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable AI Training</p>
              <Switch 
                checked={settings.allowAiTraining}
                onCheckedChange={(checked) => handleToggle('allowAiTraining', checked)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Profile Indexing */}
          <div className="my-6">
            <h3 className="font-semibold text-lg my-2">Profile Visibility</h3>
            <p className="text-sm text-gray-600 mb-3">
              Allow your profile to be indexed and shown in search results to nonprofits.
            </p>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable Profile Indexing</p>
              <Switch 
                checked={settings.allowProfileIndexing}
                onCheckedChange={(checked) => handleToggle('allowProfileIndexing', checked)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Data Analytics */}
          <div className="my-6">
            <h3 className="font-semibold text-lg my-2">Data Analytics</h3>
            <p className="text-sm text-gray-600 mb-3">
              Allow your data to be used for platform analytics and insights.
            </p>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable Analytics</p>
              <Switch 
                checked={settings.allowDataAnalytics}
                onCheckedChange={(checked) => handleToggle('allowDataAnalytics', checked)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Third-Party Sharing */}
          <div className="my-6">
            <h3 className="font-semibold text-lg my-2">Third-Party Sharing</h3>
            <p className="text-sm text-gray-600 mb-3">
              Allow your data to be shared with trusted third-party partners.
            </p>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable Third-Party Sharing</p>
              <Switch 
                checked={settings.allowThirdPartySharing}
                onCheckedChange={(checked) => handleToggle('allowThirdPartySharing', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-black/30 py-8 flex flex-col md:flex-row gap-4 items-center justify-between my-8">
          <button
            className="px-7 py-2 rounded-md border border-black/30 text-[#818181] w-full md:w-auto cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={`bg-black text-white py-2 px-7 rounded-md w-full md:w-auto cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              saving ? 'opacity-50' : ''
            }`}
            onClick={handleSave}
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

        <p className="text-xs text-gray-500 text-center">
          You can change these settings anytime from your profile settings.
        </p>
      </div>
    </div>
  );
};

export default PrivacyModal;
