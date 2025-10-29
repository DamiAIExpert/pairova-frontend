import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { NonprofitService } from "@/services/nonprofit.service";
import { useFileUpload } from "@/hooks/useFileUpload";

const AccountInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    companyName: "",
    logoUrl: "", // Cloudinary URL
    profilePhoto: null as File | null, // Local preview only
  });

  // Use the file upload hook for logo
  const {
    uploading: uploadingLogo,
    error: uploadError,
    uploadProgress,
    uploadFile,
    resetUpload,
  } = useFileUpload({
    maxSize: 2 * 1024 * 1024, // 2MB for logos
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
    kind: 'logo',
    onSuccess: (url) => {
      setFormData((prev) => ({ ...prev, logoUrl: url }));
      console.log('✅ Logo uploaded to Cloudinary:', url);
    },
    onError: (errorMsg) => {
      setError(errorMsg);
    },
  });

  // Load existing data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await NonprofitService.getProfile();
        if (profile) {
          setFormData({
            companyName: profile.orgName || "",
            logoUrl: profile.logoUrl || "",
            profilePhoto: null,
          });
        }
      } catch (err) {
        console.log("No existing profile found, starting fresh");
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set local preview immediately
    setFormData((prev) => ({ ...prev, profilePhoto: file }));

    // Upload to Cloudinary
    await uploadFile(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null, logoUrl: "" }));
    resetUpload();
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.companyName) {
      alert("Please fill in company name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend (including Cloudinary logo URL if uploaded)
      await NonprofitService.updateProfileStep({
        orgName: formData.companyName,
        logoUrl: formData.logoUrl || undefined, // Include Cloudinary URL
      });

      // Mark section as completed
      localStorage.setItem('npo_accountInfo', 'completed');
      
      // Dispatch custom event to update progress
      window.dispatchEvent(new Event('npoProgressUpdate'));

      // Navigate to next section
      navigate('/non-profit/create-account/company-info');
    } catch (err: any) {
      console.error("Failed to save account info:", err);
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="my-8">
        <Icon icon="line-md:arrow-left-circle" className="text-2xl my-3 md:hidden" />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md min-h-screen relative pb-[100px] md:pb-0">
          <div className="py-5 px-5  border-b border-black/30">
            <h4 className="font-semibold">Account</h4>
            <p className="text-xs text-[#797979] py-1">
              Please configure and fill in your information
            </p>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="px-5 py-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Organization Logo Upload */}
              <div className="w-[120px] h-[120px] border-2 border-dashed border-black/30 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {formData.logoUrl ? (
                  // Show Cloudinary URL (uploaded logo)
                  <img
                    src={formData.logoUrl}
                    alt="Organization Logo"
                    className="w-full h-full object-contain"
                  />
                ) : formData.profilePhoto ? (
                  // Show local preview while uploading
                  <img
                    src={URL.createObjectURL(formData.profilePhoto)}
                    alt="Organization Logo Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Icon icon="mdi:office-building" className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No Logo</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-black/30 rounded-md py-3 px-8 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <label htmlFor="upload" className={`cursor-pointer ${uploadingLogo ? 'cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      id="upload"
                      accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                      className="hidden w-full"
                      onChange={handleFileUpload}
                      disabled={uploadingLogo}
                    />
                    <p>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</p>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadingLogo && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span className="text-sm text-gray-600">Uploading to cloud... {uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Success */}
                {formData.logoUrl && !uploadingLogo && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Icon icon="mdi:check-circle" />
                    Logo uploaded successfully!
                  </p>
                )}

                {/* Upload Error */}
                {uploadError && !uploadingLogo && (
                  <p className="text-sm text-red-600">{uploadError}</p>
                )}

                {/* Remove Button */}
                {(formData.logoUrl || formData.profilePhoto) && (
                  <button
                    className="bg-black py-3 px-8 rounded-md text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                    onClick={handleRemovePhoto}
                    disabled={uploadingLogo}
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload your organization's logo (PNG, JPG, SVG recommended, max 2MB)
            </p>
          </div>

          <div className="px-5 pb-5">
            <div className="w-full">
              <label htmlFor="companyName" className="text-sm font-medium">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your organization name"
              />
            </div>
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full bg-white">
            <div className="flex justify-end">
              <button
                className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleSubmit}
                disabled={!formData.companyName || loading}
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
  );
};

export default AccountInfo;
