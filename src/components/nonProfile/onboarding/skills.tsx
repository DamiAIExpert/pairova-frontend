import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { NonprofitService } from "@/services/nonprofit.service";
import { AuthService } from "@/services/auth.service";

const NonprofitSkills = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing skills
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await NonprofitService.getProfile();
        
        console.log('📥 Fetched nonprofit profile for skills:', profile);
        
        if (profile?.requiredSkills) {
          setSkills(profile.requiredSkills);
        }
      } catch (err) {
        console.error('❌ Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setError("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async () => {
    if (skills.length === 0) {
      setError("Please add at least one required skill");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      console.log('💾 Saving required skills:', skills);

      // Save skills to backend
      await NonprofitService.updateProfileStep({
        requiredSkills: skills,
      });

      console.log('✅ Skills saved successfully');

      // Mark this step as completed
      localStorage.setItem('npo_skills', 'completed');
      window.dispatchEvent(new Event('npoProgressUpdate'));

      // ✅ MARK ONBOARDING AS COMPLETE
      console.log('🎉 Completing onboarding...');
      await AuthService.completeOnboarding();
      
      // Update user in auth store
      if (user) {
        setUser({ ...user, hasCompletedOnboarding: true });
      }

      console.log('✅ Onboarding completed! Redirecting to dashboard...');

      // Clear onboarding data
      NonprofitService.clearOnboardingData();

      // Redirect to nonprofit dashboard
      navigate("/non-profit");
    } catch (err: any) {
      console.error("❌ Failed to complete onboarding:", err);
      setError(err.response?.data?.message || "Failed to complete setup. Please try again.");
    } finally {
      setSubmitting(false);
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
          className="text-2xl my-3 md:hidden cursor-pointer hover:text-gray-600"
          onClick={() => navigate('/non-profit/create-account/values')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative min-h-screen pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Required Skills</h4>
            <p className="text-xs text-[#797979] py-1">
              What skills are you looking for in volunteers or applicants?
            </p>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="my-10 px-5 pb-24">
            {/* Add Skill Input */}
            <div className="mb-6">
              <label htmlFor="newSkill" className="text-sm font-medium block mb-2">
                Add a skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Project Management, Community Outreach"
                  disabled={submitting}
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim() || submitting}
                  className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Skills List */}
            <div>
              <h5 className="text-sm font-medium mb-3">
                Required Skills ({skills.length})
              </h5>
              {skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Icon icon="mdi:lightbulb-outline" className="text-4xl mx-auto mb-2" />
                  <p>No skills added yet. Add skills above.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border border-gray-300"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        disabled={submitting}
                        className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Icon icon="mdi:close" className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button 
                onClick={() => navigate('/non-profit/create-account/values')}
                className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Back
              </button>
            </div>
            <div>
              <button 
                onClick={handleSubmit}
                className={`bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  submitting ? 'opacity-50' : ''
                }`}
                disabled={submitting || skills.length === 0}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Completing Setup...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonprofitSkills;

