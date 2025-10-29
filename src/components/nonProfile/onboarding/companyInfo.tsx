import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { NonprofitService } from "@/services/nonprofit.service";

const CompanyInfo = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    contactEmail: "",
    phone: "",
    foundedOn: "",
    orgType: "",
    industry: "",
    sizeLabel: "",
    website: "",
    registrationNumber: "",
  });

  // Fetch existing nonprofit profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profile = await NonprofitService.getProfile();
        
        console.log('📥 Fetched nonprofit profile:', profile);
        
        // Pre-populate form with existing data
        setFormData({
          contactEmail: user?.email || "",
          phone: profile.phone || "",
          foundedOn: profile.foundedOn ? new Date(profile.foundedOn).toISOString().split('T')[0] : "",
          orgType: profile.orgType || "",
          industry: profile.industry || "",
          sizeLabel: profile.sizeLabel || "",
          website: profile.website || "",
          registrationNumber: profile.registrationNumber || "",
        });
      } catch (error) {
        console.error('❌ Failed to fetch nonprofit profile:', error);
        // If profile doesn't exist yet, just pre-fill email
        if (user?.email) {
          setFormData((prev) => ({ ...prev, contactEmail: user.email }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndContinue = async () => {
    try {
      // Save to backend
      await NonprofitService.updateProfileStep({
        phone: formData.phone,
        foundedOn: formData.foundedOn || undefined,
        orgType: formData.orgType,
        industry: formData.industry,
        sizeLabel: formData.sizeLabel,
        website: formData.website || undefined,
        registrationNumber: formData.registrationNumber || undefined,
      });

      console.log('✅ Company info saved to backend');
      
      // Mark step as completed in localStorage
      localStorage.setItem('npo_companyInfo', 'completed');
      window.dispatchEvent(new Event('npoProgressUpdate'));
    } catch (error) {
      console.error('❌ Failed to save company info:', error);
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
      <div>
        <div className="my-8">
          <Icon
            icon="line-md:arrow-left-circle"
            className="text-2xl my-3 md:hidden"
          />
          <h2 className="font-semibold text-xl">Form</h2>

          <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[200px]">
            <div className="py-5 px-5 border-b border-black/30">
              <h4 className="font-semibold">Company Information</h4>
              <p className="text-xs text-[#797979] py-1">
                Provide details about your organization
              </p>
            </div>

            <div className="my-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Contact Email */}
              <div className="w-full">
                <label htmlFor="contactEmail" className="text-sm font-medium">
                  Company Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.contactEmail}
                  readOnly
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="contact@organization.org"
                />
                <p className="text-xs text-gray-500 mt-1">Email from your account registration</p>
              </div>

              {/* Phone */}
              <div className="w-full">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="+234 800 000 0000"
                />
              </div>

              {/* Date Founded */}
              <div className="w-full">
                <label htmlFor="foundedOn" className="text-sm font-medium">
                  Date Founded <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="foundedOn"
                  value={formData.foundedOn}
                  onChange={(e) => handleInputChange("foundedOn", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Organization Type */}
              <div className="w-full">
                <label htmlFor="orgType" className="text-sm font-medium">
                  Organization Type <span className="text-red-500">*</span>
                </label>
                <Select value={formData.orgType} onValueChange={(value) => handleInputChange("orgType", value)}>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Organization Type</SelectLabel>
                      <SelectItem value="NGO">Non-Governmental Organization (NGO)</SelectItem>
                      <SelectItem value="Charity">Charity</SelectItem>
                      <SelectItem value="Foundation">Foundation</SelectItem>
                      <SelectItem value="Social Enterprise">Social Enterprise</SelectItem>
                      <SelectItem value="Community Organization">Community Organization</SelectItem>
                      <SelectItem value="Volunteer Organization">Volunteer Organization</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div className="w-full">
                <label htmlFor="industry" className="text-sm font-medium">
                  Industry/Sector <span className="text-red-500">*</span>
                </label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Industry</SelectLabel>
                      <SelectItem value="Social Services">Social Services</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="Human Rights">Human Rights</SelectItem>
                      <SelectItem value="Community Development">Community Development</SelectItem>
                      <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                      <SelectItem value="Animal Welfare">Animal Welfare</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Organization Size */}
              <div className="w-full">
                <label htmlFor="sizeLabel" className="text-sm font-medium">
                  Organization Size <span className="text-red-500">*</span>
                </label>
                <Select value={formData.sizeLabel} onValueChange={(value) => handleInputChange("sizeLabel", value)}>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Size</SelectLabel>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Website */}
              <div className="w-full">
                <label htmlFor="website" className="text-sm font-medium">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://www.organization.org"
                />
              </div>

              {/* Registration Number */}
              <div className="w-full">
                <label htmlFor="registrationNumber" className="text-sm font-medium">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="REG-123456"
                />
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                  Back
                </button>
              </div>
              <div className="">
                <Link to="/non-profit/create-account/address">
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

export default CompanyInfo;
