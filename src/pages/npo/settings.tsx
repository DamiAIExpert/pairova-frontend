import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { NonprofitService } from "@/services/nonprofit.service";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuthStore } from "@/store/authStore";
import { countries } from "@/utils/countries";

const NonprofitSettings = () => {
  const { uploadFile, uploading: isUploading } = useFileUpload();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit mode for each section
  const [_editingSection, _setEditingSection] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    logoUrl: "",
    orgName: "",
    orgType: "Non Profit",
    country: "",
    state: "",
    city: "",
    companyMail: "",
    phone: "",
    ceo: "",
    foundedOn: "",
    postalCode: "",
    taxId: "",
    addressLine1: "",
    addressLine2: "",
    industry: "",
    sizeLabel: "",
    website: "",
    registrationNumber: "",
    bio: "",
    missionStatement: "",
    values: "",
    policyFileUrl: "",
    policyFileName: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      const profile = await NonprofitService.getProfile();
      console.log("📥 Fetched nonprofit profile:", profile);

      setFormData({
        logoUrl: profile.logoUrl || "",
        orgName: profile.orgName || "",
        orgType: profile.orgType || "Non Profit",
        country: profile.country || "",
        state: profile.state || "",
        city: profile.city || "",
        companyMail: user?.email || "",
        phone: profile.phone || "",
        ceo: "", // TODO: Add CEO field to backend
        foundedOn: profile.foundedOn ? new Date(profile.foundedOn).toISOString().split('T')[0] : "",
        postalCode: profile.postalCode || "",
        taxId: profile.taxId || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        industry: profile.industry || "",
        sizeLabel: profile.sizeLabel || "",
        website: profile.website || "",
        registrationNumber: profile.registrationNumber || "",
        bio: profile.bio || "",
        missionStatement: profile.missionStatement || profile.mission || "",
        values: profile.values || "",
        policyFileUrl: profile.certificateUrl || "",
        policyFileName: profile.certificateUrl ? "Policy Document" : "",
      });
      
      console.log("✅ Profile data loaded successfully");
    } catch (err: any) {
      console.error("❌ Failed to fetch profile:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "";
      
      if (errorMessage.includes("not found") || err?.response?.status === 404) {
        console.log("ℹ️ No profile found yet - this is your first time in settings");
        setError("");
        
        setFormData(prev => ({
          ...prev,
          companyMail: user?.email || "",
        }));
      } else {
        setError(`Unable to load profile data. ${errorMessage}. You can still edit and save.`);
        
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
      const result = await uploadFile(file);
      if (result) {
        setFormData(prev => ({ ...prev, logoUrl: result }));
      }
      setSuccessMessage("Logo uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("Failed to upload logo");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      if (result) {
        setFormData(prev => ({ 
          ...prev, 
          policyFileUrl: result,
          policyFileName: file.name 
        }));
      }
      setSuccessMessage("File uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("Failed to upload file");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const updateData = {
        orgName: formData.orgName,
        logoUrl: formData.logoUrl || undefined,
        orgType: formData.orgType,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        phone: formData.phone || undefined,
        foundedOn: formData.foundedOn || undefined,
        postalCode: formData.postalCode || undefined,
        taxId: formData.taxId || undefined,
        addressLine1: formData.addressLine1 || undefined,
        addressLine2: formData.addressLine2 || undefined,
        industry: formData.industry || undefined,
        sizeLabel: formData.sizeLabel || undefined,
        website: formData.website || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        bio: formData.bio || undefined,
        missionStatement: formData.missionStatement || undefined,
        values: formData.values || undefined,
        certificateUrl: formData.policyFileUrl || undefined,
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="space-y-6">
            {/* My Profile */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">My Profile</h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="lucide:building-2" className="text-4xl text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1 cursor-pointer">
                    <Icon icon="material-symbols:edit" className="text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{formData.orgName || "Organization Name"}</h3>
                  <p className="text-sm text-gray-600">{formData.orgType}</p>
                  <p className="text-sm text-gray-500">{[formData.city, formData.state, formData.country].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.orgName}
                    onChange={(e) => setFormData(prev => ({ ...prev, orgName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Company Mail</label>
                  <input
                    type="email"
                    value={formData.companyMail}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Organization Type</label>
                  <input
                    type="text"
                    value={formData.orgType}
                    onChange={(e) => setFormData(prev => ({ ...prev, orgType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">CEO</label>
                  <input
                    type="text"
                    value={formData.ceo}
                    onChange={(e) => setFormData(prev => ({ ...prev, ceo: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="CEO Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date Founded</label>
                  <input
                    type="date"
                    value={formData.foundedOn}
                    onChange={(e) => setFormData(prev => ({ ...prev, foundedOn: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Education, Healthcare"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Organization Size</label>
                  <input
                    type="text"
                    value={formData.sizeLabel}
                    onChange={(e) => setFormData(prev => ({ ...prev, sizeLabel: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., 1-10, 11-50, 51-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.org"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="REG-123456"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Detailed Address</h2>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                  <span>Edit</span>
                  <Icon icon="material-symbols:edit" className="text-lg" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State / Province / Region"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="000111"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="AQE-123-9002"
                  />
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Short Bio</h2>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                  <span>Edit</span>
                  <Icon icon="material-symbols:edit" className="text-lg" />
                </button>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Tell us about your organization..."
              />
            </div>

            {/* Mission Statement */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Mission Statement</h2>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                  <span>Edit</span>
                  <Icon icon="material-symbols:edit" className="text-lg" />
                </button>
              </div>
              <textarea
                value={formData.missionStatement}
                onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Describe your organization's mission..."
              />
            </div>

            {/* Our Values */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Our Values</h2>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                  <span>Edit</span>
                  <Icon icon="material-symbols:edit" className="text-lg" />
                </button>
              </div>
              <textarea
                value={formData.values}
                onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Describe your organization's values..."
              />
            </div>

            {/* Company Policy */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Company Policy</h2>
              
              {formData.policyFileName ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon icon="material-symbols:description" className="text-2xl text-blue-600" />
                    <span className="text-sm font-medium">{formData.policyFileName}</span>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, policyFileUrl: "", policyFileName: "" }))}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Icon icon="material-symbols:delete" className="text-xl" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors block">
                  <Icon icon="material-symbols:upload-file" className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload policy document (PDF)
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
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

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="fixed bottom-5 right-5 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Icon icon="material-symbols:check-circle" />
              <span className="text-sm">{successMessage}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="fixed bottom-5 right-5 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Icon icon="material-symbols:error" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NonprofitSettings;
