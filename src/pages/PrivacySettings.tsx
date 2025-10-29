import { useState, useEffect } from 'react';
import { PrivacyService, type PrivacySettings as PrivacySettingsType } from '@/services/privacy.service';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PrivacySettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await PrivacyService.getPrivacySettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Failed to load privacy settings:', err);
      setError(err.response?.data?.message || 'Failed to load privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field: keyof PrivacySettingsType, value: boolean) => {
    if (!settings) return;

    try {
      setUpdating(true);
      setError('');
      setSuccessMessage('');
      
      const updated = await PrivacyService.updatePrivacySettings({
        [field]: value,
      });
      
      setSettings(updated);
      setSuccessMessage('Privacy settings updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to update privacy settings:', err);
      setError(err.response?.data?.message || 'Failed to update privacy settings. Please try again.');
      // Revert the change on error
      loadSettings();
    } finally {
      setUpdating(false);
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

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <Icon icon="mdi:alert-circle" className="text-red-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Settings</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadSettings}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="text-xl" />
            <span>Back</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
          <p className="text-gray-600 mt-2">
            Control how your data is used across the Pairova platform
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
            <Icon icon="mdi:check-circle" className="text-xl" />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <Icon icon="mdi:alert-circle" className="text-xl" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Privacy Controls */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* AI Model Training */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:robot" className="text-2xl text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Model Training</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Allow your data to be used for training and improving our AI matching models. 
                  This helps us provide better job recommendations for everyone.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Impact:</strong> When disabled, minimal data is sent to AI services, which may result in less accurate job matches.
                </p>
              </div>
              <Switch
                checked={settings.allowAiTraining}
                onCheckedChange={(checked) => handleToggle('allowAiTraining', checked)}
                disabled={updating}
                className="mt-1"
              />
            </div>
          </div>

          {/* Profile Indexing */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:magnify" className="text-2xl text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Profile Indexing</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Allow your profile to appear in employer searches and job recommendations. 
                  This increases your visibility to potential employers.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Impact:</strong> When disabled, your profile is hidden from employer searches. You can still apply to jobs manually.
                </p>
              </div>
              <Switch
                checked={settings.allowProfileIndexing}
                onCheckedChange={(checked) => handleToggle('allowProfileIndexing', checked)}
                disabled={updating}
                className="mt-1"
              />
            </div>
          </div>

          {/* Data Analytics */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:chart-line" className="text-2xl text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Data Analytics</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Allow your data to be used for platform analytics and insights. 
                  This helps us improve features and understand user needs better.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Impact:</strong> When disabled, your data is excluded from aggregate statistics and analytics.
                </p>
              </div>
              <Switch
                checked={settings.allowDataAnalytics}
                onCheckedChange={(checked) => handleToggle('allowDataAnalytics', checked)}
                disabled={updating}
                className="mt-1"
              />
            </div>
          </div>

          {/* Third-Party Sharing */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:share-variant" className="text-2xl text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Third-Party Sharing</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Allow your data to be shared with trusted third-party partners. 
                  This may provide access to additional job opportunities and services.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Impact:</strong> When disabled, your data stays within the Pairova platform only.
                </p>
              </div>
              <Switch
                checked={settings.allowThirdPartySharing}
                onCheckedChange={(checked) => handleToggle('allowThirdPartySharing', checked)}
                disabled={updating}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {settings.privacyUpdatedAt && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(settings.privacyUpdatedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Icon icon="mdi:information" className="text-blue-600 text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Your Privacy Matters</h4>
              <p className="text-sm text-blue-800">
                We are committed to protecting your privacy and giving you control over your data. 
                All changes are logged for security purposes. For more information, please review our{' '}
                <a href="/privacy-policy" className="underline hover:text-blue-600">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;

