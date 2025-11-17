import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { ProfileService } from "@/services/profile.service";
import { UniversityService } from "@/services/university.service";

interface EducationData {
  school: string;
  degree: string;
  course: string;
  grade: string;
  role: string;
  description: string;
}

const Education = () => {
  const navigate = useNavigate();
  const { setStepCompleted } = useOnboardingStore();
  
  const [formData, setFormData] = useState<EducationData>({
    school: "",
    degree: "",
    course: "",
    grade: "",
    role: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileCountry, setProfileCountry] = useState<string | undefined>(undefined);
  const [universityOptions, setUniversityOptions] = useState<string[]>([]);
  const [isSearchingUniversities, setIsSearchingUniversities] = useState(false);
  const [universityError, setUniversityError] = useState("");
  const [hasSearchedUniversities, setHasSearchedUniversities] = useState(false);
  const trimmedSchoolQuery = formData.school.trim();

  // Load existing education data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await ProfileService.getProfile();
        // Note: Education data structure needs to be defined in backend
        // For now, we'll store it as a JSON field or separate table
        if ((profile as any)?.education) {
          setFormData((profile as any).education);
        }
        if (profile?.country) {
          setProfileCountry(profile.country);
        }
      } catch (err) {
        console.error("Failed to load education:", err);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field: keyof EducationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  // Fetch university suggestions dynamically using Hipolabs dataset
  useEffect(() => {
    const query = trimmedSchoolQuery;

    if (query.length < 2) {
      setUniversityOptions([]);
      setUniversityError("");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setHasSearchedUniversities(true);
      setIsSearchingUniversities(true);
      setUniversityError("");

      try {
        const universities = await UniversityService.searchUniversities({
          country: profileCountry,
          name: query,
          signal: controller.signal,
        });
        // Deduplicate and limit results for better UX
        const uniqueNames = Array.from(new Set(universities.map((u) => u.name)));
        setUniversityOptions(uniqueNames.slice(0, 50));
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch universities:", err);
          setUniversityError("Unable to fetch universities. Please continue typing or try again.");
        }
      } finally {
        setIsSearchingUniversities(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [trimmedSchoolQuery, profileCountry]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.school || !formData.degree || !formData.course) {
      setError("Please fill in school, degree, and course");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend
      // Note: Backend needs to support education data structure
      await ProfileService.updateProfileStep({
        education: formData,
      } as any);

      // Mark step as completed
      setStepCompleted('education');
      
      // Navigate to next step
      navigate('/seeker/create-account/experience');
    } catch (err: any) {
      console.error("Failed to save education:", err);
      setError(err.response?.data?.message || "Failed to save education. Please try again.");
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
          onClick={() => navigate('/seeker/create-account/bio')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[200px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Education</h4>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="my-10 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label htmlFor="school" className="text-sm font-medium">
                  School <span className="text-red-500">*</span>
                </label>
                <input
                  id="school"
                  type="text"
                  list="global-university-options"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Start typing to search global universities"
                  disabled={loading}
                />
                <datalist id="global-university-options">
                  {universityOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                {isSearchingUniversities && (
                  <p className="text-xs text-gray-500 mt-1">Searching worldwide universities...</p>
                )}
                {universityError && (
                  <p className="text-xs text-red-500 mt-1">{universityError}</p>
                )}
                {!isSearchingUniversities && !universityError && hasSearchedUniversities && universityOptions.length === 0 && trimmedSchoolQuery.length >= 2 && (
                  <p className="text-xs text-gray-500 mt-1">No matches found. Try a different name.</p>
                )}
                {profileCountry && (
                  <p className="text-xs text-gray-500 mt-1">
                    Suggestions are prioritized for {profileCountry}. Continue typing to see more.
                  </p>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="degree" className="text-sm font-medium">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  id="degree"
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleInputChange('degree', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., B.Sc, M.Sc, First Class"
                  disabled={loading}
                />
              </div>

              <div className="w-full">
                <label htmlFor="course" className="text-sm font-medium">
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  id="course"
                  type="text"
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Computing, Mathematics"
                  disabled={loading}
                />
              </div>

              <div className="w-full">
                <label htmlFor="grade" className="text-sm font-medium">
                  Grade
                </label>
                <input
                  id="grade"
                  type="text"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., First Class Honors, 3.8 GPA"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="border border-black/30 rounded-md px-5 py-5 flex flex-col md:flex-row items-start gap-5 my-8">
              <div className="w-full">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Input major role"
                  disabled={loading}
                />
              </div>

              <div className="w-full">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  className="resize-none px-4 py-3 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Describe your role and achievements"
                  disabled={loading}
                ></textarea>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
              <div>
                <button 
                  onClick={() => navigate('/seeker/create-account/bio')}
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
                  disabled={loading || !formData.school || !formData.degree || !formData.course}
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

export default Education;
