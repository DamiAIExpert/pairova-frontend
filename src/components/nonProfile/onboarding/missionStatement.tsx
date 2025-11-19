import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { NonprofitService } from "@/services/nonprofit.service";

const MissionStatement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [missionStatement, setMissionStatement] = useState("");

  // Fetch existing nonprofit profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profile = await NonprofitService.getProfile();
        
        console.log('📥 Fetched nonprofit profile for mission statement:', profile);
        
        // Pre-populate with existing data - backend uses missionStatement field
        setMissionStatement(profile.missionStatement || "");
      } catch (error) {
        console.error('❌ Failed to fetch nonprofit profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      setSaving(true);
      setError("");
      
      // Save to backend - backend expects missionStatement field
      await NonprofitService.updateProfileStep({
        missionStatement: missionStatement,
      } as any);

      console.log('✅ Mission statement saved to backend');

      localStorage.setItem('npo_mission', 'completed');
      window.dispatchEvent(new Event('npoProgressUpdate'));
      
      // Navigate to next step after save completes
      navigate('/non-profit/create-account/values');
    } catch (err: any) {
      console.error('❌ Failed to save mission statement:', err);
      setError(err.response?.data?.message || 'Failed to save mission statement. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="line-md:loading-loop" className="text-4xl mx-auto mb-3" />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative min-h-screen">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Mission Statement</h4>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="my-10 px-5">
            <div className="px-5 py-5 border-2 border-black/20 rounded-md">
              <textarea
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                className="resize-none w-full focus:outline-none"
                rows={8}
                placeholder="Enter your organization's mission statement..."
                disabled={saving}
              ></textarea>

              <div className="flex justify-end">
                <p className="border border-black/20 rounded-md px-5 py-2 text-sm">
                  Max 150 words
                </p>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button 
                  onClick={() => navigate('/non-profit/create-account/bio')}
                  className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Back
                </button>
              </div>
              <div className="">
                <button 
                  className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleSaveAndContinue}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionStatement;
