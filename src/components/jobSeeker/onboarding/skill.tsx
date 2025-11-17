import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { ProfileService } from "@/services/profile.service";

interface SkillData {
  hardSoftSkills: string;
  technicalSkills: string;
}

const Skill = () => {
  const navigate = useNavigate();
  const { setStepCompleted } = useOnboardingStore();
  
  const [formData, setFormData] = useState<SkillData>({
    hardSoftSkills: "",
    technicalSkills: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing skills
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await ProfileService.getProfile();
        if (profile?.skills && Array.isArray(profile.skills)) {
          // Convert array of skills back to comma-separated strings
          // We'll combine all skills into technical skills for simplicity
          // In a real app, you might want to separate them based on some logic
          const allSkills = profile.skills.join(', ');
          setFormData({
            hardSoftSkills: "",
            technicalSkills: allSkills,
          });
        }
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field: keyof SkillData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.hardSoftSkills && !formData.technicalSkills) {
      setError("Please enter at least one skill");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Convert comma-separated strings to array of strings
      // Backend expects skills: string[] (array of individual skills)
      const skillsArray: string[] = [];
      
      // Parse hard/soft skills
      if (formData.hardSoftSkills) {
        const hardSoft = formData.hardSoftSkills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        skillsArray.push(...hardSoft);
      }
      
      // Parse technical skills
      if (formData.technicalSkills) {
        const technical = formData.technicalSkills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        skillsArray.push(...technical);
      }

      // Save skills to backend as array
      await ProfileService.updateProfileStep({
        skills: skillsArray,
      });

      // Mark this step as completed
      setStepCompleted('skill');

      // Navigate to next step (certificates)
      navigate('/seeker/create-account/certificates');
    } catch (err: any) {
      console.error("Failed to save skills:", err);
      setError(err.response?.data?.message || "Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden cursor-pointer hover:text-gray-600"
          onClick={() => navigate('/seeker/create-account/experience')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Skills</h4>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-5 my-10 px-5">
            <div className="w-full">
              <label htmlFor="hardSoftSkills" className="text-sm font-medium">
                Hard / Soft Skills
              </label>
              <input
                id="hardSoftSkills"
                type="text"
                value={formData.hardSoftSkills}
                onChange={(e) => handleInputChange('hardSoftSkills', e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Communication, Leadership, Problem Solving"
                disabled={loading}
              />
            </div>

            <div className="w-full">
              <label htmlFor="technicalSkills" className="text-sm font-medium">
                Technical Skills
              </label>
              <input
                id="technicalSkills"
                type="text"
                value={formData.technicalSkills}
                onChange={(e) => handleInputChange('technicalSkills', e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., JavaScript, Python, React, SQL"
                disabled={loading}
              />
            </div>
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button 
                onClick={() => navigate('/seeker/create-account/experience')}
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Completing Setup...
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

export default Skill;
