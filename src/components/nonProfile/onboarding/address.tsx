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
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { countries } from "@/utils/countries";
import { NonprofitService } from "@/services/nonprofit.service";

const Address = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
  });

  // Fetch existing nonprofit profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profile = await NonprofitService.getProfile();
        
        console.log('📥 Fetched nonprofit profile for address:', profile);
        
        // Pre-populate form with existing data
        setFormData({
          country: profile.country || "",
          state: profile.state || "",
          city: profile.city || "",
          addressLine1: profile.addressLine1 || "",
          addressLine2: profile.addressLine2 || "",
          postalCode: profile.postalCode || "",
        });
      } catch (error) {
        console.error('❌ Failed to fetch nonprofit profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.country || !formData.state || !formData.city || !formData.addressLine1) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Save to backend
      await NonprofitService.updateProfileStep({
        country: formData.country,
        state: formData.state,
        city: formData.city,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        postalCode: formData.postalCode || undefined,
      });

      console.log('✅ Address saved to backend');

      // Mark section as completed
      localStorage.setItem('npo_address', 'completed');
      
      // Dispatch custom event to update progress
      window.dispatchEvent(new Event('npoProgressUpdate'));

      // Navigate to next section
      navigate('/non-profit/create-account/bio');
    } catch (error) {
      console.error('❌ Failed to save address:', error);
      alert("Failed to save address. Please try again.");
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

          <div className="bg-white border border-black/30 my-5 rounded-md min-h-screen relative pb-[100px]">
            <div className="py-5 px-5 border-b border-black/30">
              <h4 className="font-semibold">Address</h4>
              <p className="text-xs text-[#797979] py-1">
                Provide your organization's physical location
              </p>
            </div>

            <div className="my-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country */}
              <div className="w-full">
                <label htmlFor="country" className="text-sm font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* State/Province */}
              <div className="w-full">
                <label htmlFor="state" className="text-sm font-medium">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Western Cape, Lagos, California"
                />
              </div>

              {/* City */}
              <div className="w-full">
                <label htmlFor="city" className="text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Cape Town, Johannesburg, Durban"
                />
              </div>

              {/* Postal Code */}
              <div className="w-full">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  Postal/ZIP Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., 8001, 2000"
                />
              </div>

              {/* Address Line 1 */}
              <div className="w-full md:col-span-2">
                <label htmlFor="addressLine1" className="text-sm font-medium">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Building number and street name"
                />
              </div>

              {/* Address Line 2 */}
              <div className="w-full md:col-span-2">
                <label htmlFor="addressLine2" className="text-sm font-medium">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Apartment, suite, unit, floor, etc."
                />
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
              <div>
                <Link to="/non-profit/create-account/company-info">
                  <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                </Link>
              </div>
              <div>
                <button 
                  className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={!formData.country || !formData.state || !formData.city || !formData.addressLine1}
                >
                  Save and Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
