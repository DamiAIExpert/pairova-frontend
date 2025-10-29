import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { NonprofitService } from "@/services/nonprofit.service";

const OurValues = () => {
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState("");

  // Fetch existing nonprofit profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profile = await NonprofitService.getProfile();
        
        console.log('📥 Fetched nonprofit profile for values:', profile);
        
        // Pre-populate with existing data
        setValues(profile.values || "");
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
      // Save to backend
      await NonprofitService.updateProfileStep({
        values: values,
      });

      console.log('✅ Values saved to backend');

      localStorage.setItem('npo_values', 'completed');
      window.dispatchEvent(new Event('npoProgressUpdate'));
    } catch (error) {
      console.error('❌ Failed to save values:', error);
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
            <h4 className="font-semibold">Our Values</h4>
          </div>

          <div className="my-10 px-5">
            <div className="px-5 py-5 border-2 border-black/20 rounded-md">
              <textarea
                value={values}
                onChange={(e) => setValues(e.target.value)}
                className="resize-none w-full focus:outline-none"
                rows={8}
                placeholder="Enter your organization's core values..."
              ></textarea>

              <div className="flex justify-end">
                <p className="border border-black/20 rounded-md px-5 py-2 text-sm">
                  Max 150 words
                </p>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                  Back
                </button>
              </div>
              <div className="">
                <Link to="/non-profit/create-account/skills">
                  <button 
                    className="bg-black text-white py-3 px-8 rounded-md"
                    onClick={handleSaveAndContinue}
                  >
                    Save and Continue
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurValues;
