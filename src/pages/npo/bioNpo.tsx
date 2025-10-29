import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { NonprofitService } from "@/services/nonprofit.service";

const BioNpo = () => {
  const navigate = useNavigate();
  
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 150;

  // Load existing bio
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await NonprofitService.getProfile();
        if (profile?.bio) {
          setBio(profile.bio);
          setWordCount(profile.bio.trim().split(/\s+/).length);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, []);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length <= maxWords) {
      setBio(text);
      setWordCount(words.length);
      setError("");
    } else {
      setError(`Maximum ${maxWords} words allowed`);
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!bio.trim()) {
      setError("Please enter a bio");
      return;
    }

    if (bio.trim().length < 10) {
      setError("Bio must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend using nonprofit service
      await NonprofitService.updateProfileStep({
        bio: bio.trim(),
      });

      // Mark section as completed
      localStorage.setItem('npo_bio', 'completed');
      window.dispatchEvent(new Event('npoProgressUpdate'));
      
      // Navigate to next step
      navigate('/non-profit/create-account/mission-statement');
    } catch (err: any) {
      console.error("Failed to save bio:", err);
      setError(err.response?.data?.message || "Failed to save bio. Please try again.");
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
          onClick={() => navigate('/non-profit/create-account/address')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative min-h-screen">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Bio</h4>
            <p className="text-xs text-[#797979] py-1">
              Tell us about your organization (2-3 paragraphs about what you do, who you serve, and the impact you make)
            </p>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="my-10 px-5 pb-24">
            <div className="px-5 py-5 border-2 border-black/20 rounded-md focus-within:border-black transition-colors">
              <textarea
                value={bio}
                onChange={handleBioChange}
                className="resize-none w-full focus:outline-none"
                rows={8}
                placeholder="Enter a brief description about your organization..."
                disabled={loading}
              ></textarea>

              <div className="flex justify-end">
                <p className={`border border-black/20 rounded-md px-5 py-2 text-sm ${
                  wordCount > maxWords ? 'text-red-600 border-red-300' : ''
                }`}>
                  {wordCount}/{maxWords} words
                </p>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
              <div>
                <button 
                  onClick={() => navigate('/non-profit/create-account/address')}
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
                  disabled={loading || !bio.trim()}
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

export default BioNpo;
