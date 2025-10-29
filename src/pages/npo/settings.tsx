import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { NonprofitService } from "@/services/nonprofit.service";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuthStore } from "@/store/authStore";
import { countries } from "@/utils/countries";

const NonprofitSettings = () => {
  const { uploadFile, isUploading } = useFileUpload();
  const { user } = useAuthStore(); // Get user from hook at component level
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    // Account
    logoUrl: "",
    orgName: "",
    country: "",
    
    // Company Information
    companyMail: "",
    phone: "",
    foundedOn: "",
    language: "English",
    orgType: "Non Profit",
    languageProficiency: "Professional",
    
    // Address
    state: "",
    city: "",
    postalCode: "",
    taxId: "",
    addressLine1: "",
    addressLine2: "",
    
    // Content
    bio: "",
    missionStatement: "",
    values: "",
    
    // Skills
    softSkills: [] as string[],
    hardSkills: [] as string[],
  });

  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newHardSkill, setNewHardSkill] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      const profile = await NonprofitService.getProfile();
      console.log("📥 Fetched nonprofit profile:", profile);

      // Parse skills if they exist
      let softSkills: string[] = [];
      let hardSkills: string[] = [];
      if (profile.requiredSkills) {
        if (Array.isArray(profile.requiredSkills)) {
          softSkills = profile.requiredSkills;
        } else if (typeof profile.requiredSkills === 'object') {
          softSkills = (profile.requiredSkills as any).softSkills || [];
          hardSkills = (profile.requiredSkills as any).hardSkills || [];
        }
      }

      setFormData({
        logoUrl: profile.logoUrl || "",
        orgName: profile.orgName || "",
        country: profile.country || "",
        companyMail: user?.email || "", // Get actual user email from auth store
        phone: profile.phone || "",
        foundedOn: profile.foundedOn ? new Date(profile.foundedOn).toISOString().split('T')[0] : "",
        language: "English",
        orgType: profile.orgType || "Non Profit",
        languageProficiency: "Professional",
        state: profile.state || "",
        city: profile.city || "",
        postalCode: profile.postalCode || "",
        taxId: profile.taxId || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        bio: profile.bio || "",
        missionStatement: profile.missionStatement || profile.mission || "",
        values: profile.values || "",
        softSkills,
        hardSkills,
      });
      
      console.log("✅ Profile data loaded successfully");
    } catch (err: any) {
      console.error("❌ Failed to fetch profile:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "";
      
      // If profile not found, it's the first time - that's okay
      if (errorMessage.includes("not found") || err?.response?.status === 404) {
        console.log("ℹ️ No profile found yet - this is your first time in settings");
        setError(""); // Clear error - this is expected
        
        // Set default values for new profile
        setFormData(prev => ({
          ...prev,
          companyMail: user?.email || "",
          orgType: "Non Profit",
          language: "English",
          languageProficiency: "Professional",
        }));
      } else {
        // Real error - show it
        setError(`Unable to load profile data. ${errorMessage}. You can still edit and save.`);
        
        // Even on error, set user email if available
        if (user?.email) {
          setFormData(prev => ({ ...prev, companyMail: user.email }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, "logo");
      setFormData(prev => ({ ...prev, logoUrl: result.url }));
      setSuccessMessage("Logo uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("Failed to upload logo");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleFileAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, "document");
      setAttachedFiles(prev => [...prev, { name: file.name, url: result.url }]);
      setSuccessMessage("File attached successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("Failed to attach file");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim() && !formData.softSkills.includes(newSoftSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        softSkills: [...prev.softSkills, newSoftSkill.trim()]
      }));
      setNewSoftSkill("");
    }
  };

  const handleAddHardSkill = () => {
    if (newHardSkill.trim() && !formData.hardSkills.includes(newHardSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        hardSkills: [...prev.hardSkills, newHardSkill.trim()]
      }));
      setNewHardSkill("");
    }
  };

  const handleRemoveSoftSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter(s => s !== skill)
    }));
  };

  const handleRemoveHardSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      hardSkills: prev.hardSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const updateData = {
        orgName: formData.orgName,
        logoUrl: formData.logoUrl || undefined,
        country: formData.country,
        phone: formData.phone,
        foundedOn: formData.foundedOn || undefined,
        orgType: formData.orgType,
        state: formData.state,
        city: formData.city,
        postalCode: formData.postalCode,
        taxId: formData.taxId,
        addressLine1: formData.addressLine1 || undefined,
        addressLine2: formData.addressLine2 || undefined,
        bio: formData.bio || undefined,
        missionStatement: formData.missionStatement || undefined,
        values: formData.values || undefined,
        requiredSkills: {
          softSkills: formData.softSkills,
          hardSkills: formData.hardSkills
        } as any,
      };

      await NonprofitService.updateProfileStep(updateData);
      setSuccessMessage("Settings saved successfully!");
      console.log("✅ Settings saved successfully");
    } catch (err: any) {
      console.error("❌ Failed to save settings:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <p className="text-gray-600 text-sm mb-4">Please configure and fill in your information</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Icon icon="lucide:building-2" className="text-4xl text-gray-400" />
              )}
            </div>
            <div>
              <label className="cursor-pointer bg-white border border-black px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-block">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <button
                onClick={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                className="ml-3 bg-black text-white px-4 py-2 rounded-md hover:bg-black/80 transition-colors"
              >
                Remove Photo
              </button>
              <p className="text-xs text-gray-500 mt-2">Use a photo of at least 4 MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => setFormData(prev => ({ ...prev, orgName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Non Profit Organisation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company mail</label>
              <input
                type="email"
                value={formData.companyMail}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                placeholder="company@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Email from your account registration</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="+1 817-2345-221"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Founded</label>
              <input
                type="date"
                value={formData.foundedOn}
                onChange={(e) => setFormData(prev => ({ ...prev, foundedOn: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>Portuguese</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Company Type</label>
              <select
                value={formData.orgType}
                onChange={(e) => setFormData(prev => ({ ...prev, orgType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Non Profit</option>
                <option>NGO</option>
                <option>Charity</option>
                <option>Foundation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language Proficiency</label>
              <div className="flex gap-2 pt-2">
                {["Native", "Professional", "Intermediate"].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="proficiency"
                      value={level}
                      checked={formData.languageProficiency === level}
                      onChange={(e) => setFormData(prev => ({ ...prev, languageProficiency: e.target.value }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Select State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Select City"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax ID</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Input ID Number"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bio</h2>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={6}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
            placeholder="Tell us about your organization..."
          />
          <div className="flex justify-end text-sm text-gray-500 mt-1">
            Max {formData.bio.length}/500 words
          </div>
        </div>

        {/* Attach Files */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Attach Files</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Icon icon="material-symbols:upload" className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              Drag and Drop or{" "}
              <label className="text-blue-600 cursor-pointer hover:underline">
                Choose File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileAttachment}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>{" "}
              for upload
            </p>
          </div>
          
          {/* Attached Files List */}
          {attachedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon icon="material-symbols:description" className="text-2xl text-gray-600" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Icon icon="material-symbols:close" className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mission Statement */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mission Statement</h2>
          <textarea
            value={formData.missionStatement}
            onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
            rows={6}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
            placeholder="Describe your organization's mission..."
          />
          <div className="flex justify-end text-sm text-gray-500 mt-1">
            Max {formData.missionStatement.length}/500 words
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Our Values</h2>
          <textarea
            value={formData.values}
            onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
            rows={6}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
            placeholder="Describe your organization's values..."
          />
          <div className="flex justify-end text-sm text-gray-500 mt-1">
            Max {formData.values.length}/500 words
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hard / Soft skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSoftSkill()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter skill"
                />
                <button
                  onClick={handleAddSoftSkill}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Technical skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHardSkill}
                  onChange={(e) => setNewHardSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHardSkill()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter skill"
                />
                <button
                  onClick={handleAddHardSkill}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2">
            {formData.softSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSoftSkill(skill)}
                  className="hover:text-blue-600"
                >
                  <Icon icon="material-symbols:close" className="text-sm" />
                </button>
              </span>
            ))}
            {formData.hardSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => handleRemoveHardSkill(skill)}
                  className="hover:text-green-600"
                >
                  <Icon icon="material-symbols:close" className="text-sm" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonprofitSettings;
