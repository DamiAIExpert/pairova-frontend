import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { NonprofitService } from "@/services/nonprofit.service";
import { AuthService } from "@/services/auth.service";

const NonprofitSkills = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useAuthStore();
  
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newHardSkill, setNewHardSkill] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [_certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
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
          // Parse required skills - format: { softSkills: [], hardSkills: [] }
          const skills = profile.requiredSkills;
          if (Array.isArray(skills)) {
            // Legacy format - just an array
            setSoftSkills(skills);
          } else if (typeof skills === 'object' && skills !== null) {
            // New format - object with softSkills and hardSkills
            setSoftSkills((skills as any).softSkills || []);
            setHardSkills((skills as any).hardSkills || []);
          }
        }
        
        // Load certificate URL if exists
        if (profile?.certificateUrl) {
          setCertificateUrl(profile.certificateUrl);
          console.log('📄 Loaded certificate URL:', profile.certificateUrl);
        }
        
      } catch (err) {
        console.error('❌ Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim() && !softSkills.includes(newSoftSkill.trim())) {
      setSoftSkills([...softSkills, newSoftSkill.trim()]);
      setNewSoftSkill("");
      setError("");
    }
  };

  const handleAddHardSkill = () => {
    if (newHardSkill.trim() && !hardSkills.includes(newHardSkill.trim())) {
      setHardSkills([...hardSkills, newHardSkill.trim()]);
      setNewHardSkill("");
      setError("");
    }
  };

  const handleRemoveSoftSkill = (skillToRemove: string) => {
    setSoftSkills(softSkills.filter(skill => skill !== skillToRemove));
  };

  const handleRemoveHardSkill = (skillToRemove: string) => {
    setHardSkills(hardSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSoftSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSoftSkill();
    }
  };

  const handleHardSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHardSkill();
    }
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      setError('Certificate must be a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Certificate file must be less than 5MB');
      return;
    }

    try {
      setUploadingCertificate(true);
      setError('');
      setCertificateFile(file);

      // Upload certificate to backend
      console.log('📤 Uploading certificate...');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.pairova.com'}/uploads/simple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setCertificateUrl(data.url);
      console.log('✅ Certificate uploaded:', data.url);
    } catch (err) {
      console.error('❌ Certificate upload failed:', err);
      setError('Failed to upload certificate. Please try again.');
      setCertificateFile(null);
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleRemoveCertificate = () => {
    setCertificateFile(null);
    setCertificateUrl('');
  };

  const handleSubmit = async () => {
    if (softSkills.length === 0 && hardSkills.length === 0) {
      setError("Please add at least one soft skill or hard skill");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Prepare skills object
      const skillsData = {
        softSkills,
        hardSkills,
      };

      console.log('💾 Saving required skills:', skillsData);
      console.log('📄 Certificate URL:', certificateUrl);

      // Save skills and certificate to backend
      await NonprofitService.updateProfileStep({
        requiredSkills: skillsData as any,
        certificateUrl: certificateUrl || undefined,
      } as any);

      console.log('✅ Skills and certificate saved successfully');

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

      // Check for redirect parameter
      const redirectParam = searchParams.get('redirect');
      if (redirectParam) {
        // Use the redirect parameter if provided
        try {
          const decodedRedirect = decodeURIComponent(redirectParam);
          navigate(decodedRedirect, { replace: true });
        } catch (error) {
          console.error('Error decoding redirect URL:', error);
          navigate("/non-profit", { replace: true });
        }
      } else {
        // Otherwise redirect to nonprofit dashboard
        navigate("/non-profit", { replace: true });
      }
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
            {/* Soft Skills Section */}
            <div className="mb-8">
              <h5 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:account-heart" className="text-xl" />
                Soft Skills
              </h5>
              <p className="text-xs text-gray-600 mb-4">
                Communication, Leadership, Teamwork, Problem-solving, etc.
              </p>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    onKeyPress={handleSoftSkillKeyPress}
                    className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Communication, Leadership"
                    disabled={submitting}
                  />
                  <button
                    onClick={handleAddSoftSkill}
                    disabled={!newSoftSkill.trim() || submitting}
                    className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {softSkills.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                  <Icon icon="mdi:lightbulb-outline" className="text-3xl mx-auto mb-2" />
                  <p className="text-sm">No soft skills added yet</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full border border-blue-300"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        onClick={() => handleRemoveSoftSkill(skill)}
                        disabled={submitting}
                        className="text-blue-600 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Icon icon="mdi:close" className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hard Skills Section */}
            <div className="mb-8">
              <h5 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:tools" className="text-xl" />
                Hard Skills / Technical Skills
              </h5>
              <p className="text-xs text-gray-600 mb-4">
                Project Management, Data Analysis, Fundraising, Grant Writing, etc.
              </p>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHardSkill}
                    onChange={(e) => setNewHardSkill(e.target.value)}
                    onKeyPress={handleHardSkillKeyPress}
                    className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Project Management, Grant Writing"
                    disabled={submitting}
                  />
                  <button
                    onClick={handleAddHardSkill}
                    disabled={!newHardSkill.trim() || submitting}
                    className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {hardSkills.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                  <Icon icon="mdi:lightbulb-outline" className="text-3xl mx-auto mb-2" />
                  <p className="text-sm">No hard skills added yet</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {hardSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border border-green-300"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        onClick={() => handleRemoveHardSkill(skill)}
                        disabled={submitting}
                        className="text-green-600 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Icon icon="mdi:close" className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificate Upload Section */}
            <div className="mb-8 border-t pt-8">
              <h5 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:certificate" className="text-xl" />
                Certificate of Operation (Optional)
              </h5>
              <p className="text-xs text-gray-600 mb-4">
                Upload your organization's certificate of registration or operation (PDF, max 5MB)
              </p>

              {certificateUrl ? (
                <div className="bg-green-50 border border-green-300 rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:file-pdf-box" className="text-3xl text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Certificate uploaded</p>
                      <a 
                        href={certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View certificate
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCertificate}
                    disabled={submitting}
                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                  >
                    <Icon icon="mdi:delete" className="text-2xl" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-black transition-colors">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCertificateUpload}
                    disabled={uploadingCertificate || submitting}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <label 
                    htmlFor="certificate-upload" 
                    className={`cursor-pointer ${(uploadingCertificate || submitting) ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {uploadingCertificate ? (
                      <div className="flex flex-col items-center gap-2">
                        <Icon icon="line-md:loading-loop" className="text-4xl text-black" />
                        <p className="text-sm font-medium">Uploading certificate...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Icon icon="mdi:cloud-upload" className="text-4xl text-gray-400" />
                        <p className="text-sm font-medium">Click to upload certificate</p>
                        <p className="text-xs text-gray-500">PDF (Max 5MB)</p>
                      </div>
                    )}
                  </label>
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
                disabled={submitting || (softSkills.length === 0 && hardSkills.length === 0)}
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

