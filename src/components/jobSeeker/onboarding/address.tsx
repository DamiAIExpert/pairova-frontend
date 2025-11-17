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
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/authStore";
import { ProfileService } from "@/services/profile.service";
import { countries } from "@/utils/countries";
import { LocationService } from "@/services/location.service";

const getCountryNameFromCode = (code: string) => {
  const country = countries.find((c) => c.code === code);
  return country?.name || code;
};

const getCountryCodeFromName = (name: string) => {
  if (!name) return "";
  const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return country?.code || name;
};

const Address = () => {
  const navigate = useNavigate();
  const { setStepCompleted } = useOnboardingStore();
  
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    postalCode: "",
    taxId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [isStateLoading, setIsStateLoading] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [locationError, setLocationError] = useState({ states: "", cities: "" });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await ProfileService.getProfile();
        if (profile) {
          const countryCode = profile.country
            ? getCountryCodeFromName(profile.country)
            : "";

          setFormData((prev) => ({
            ...prev,
            country: countryCode,
            state: profile.state || "",
            city: profile.city || "",
            postalCode: profile.postalCode || "",
            taxId: (profile as any).taxId || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, []);

  // Fetch states whenever country changes
  useEffect(() => {
    if (!formData.country) {
      setStateOptions([]);
      setCityOptions([]);
      return;
    }

    const countryName = getCountryNameFromCode(formData.country);
    const controller = new AbortController();
    setIsStateLoading(true);
    setLocationError((prev) => ({ ...prev, states: "" }));

    LocationService.getStates(countryName, controller.signal)
      .then((states) => {
        setStateOptions(states);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch states:", err);
          setLocationError((prev) => ({
            ...prev,
            states: "Unable to load states for this country.",
          }));
          setStateOptions([]);
        }
      })
      .finally(() => setIsStateLoading(false));

    return () => controller.abort();
  }, [formData.country]);

  // Fetch cities whenever state changes
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCityOptions([]);
      return;
    }

    const countryName = getCountryNameFromCode(formData.country);
    const controller = new AbortController();
    setIsCityLoading(true);
    setLocationError((prev) => ({ ...prev, cities: "" }));

    LocationService.getCities(countryName, formData.state, controller.signal)
      .then((cities) => {
        setCityOptions(cities);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch cities:", err);
          setLocationError((prev) => ({
            ...prev,
            cities: "Unable to load cities for this state.",
          }));
          setCityOptions([]);
        }
      })
      .finally(() => setIsCityLoading(false));

    return () => controller.abort();
  }, [formData.country, formData.state]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Reset state and city when country changes
      if (field === "country") {
        newData.state = "";
        newData.city = "";
      }
      
      // Reset city when state changes
      if (field === "state") {
        newData.city = "";
      }
      
      return newData;
    });
    setError("");
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.country || !formData.state || !formData.city) {
      setError("Please fill in country, state, and city");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Save to backend
      await ProfileService.updateProfileStep({
        country: getCountryNameFromCode(formData.country),
        state: formData.state,
        city: formData.city,
        postalCode: formData.postalCode || undefined,
        taxId: formData.taxId || undefined,
      } as any);

      // Mark step as completed
      setStepCompleted('address');
      
      // Navigate to next step
      navigate('/seeker/create-account/bio');
    } catch (err: any) {
      console.error("Failed to save address:", err);
      setError(err.response?.data?.message || "Failed to save address. Please try again.");
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
          onClick={() => navigate('/seeker/create-account/personal-information')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md min-h-screen relative">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Address</h4>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="my-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-5 pb-24">
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
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formData.country && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected country: {getCountryNameFromCode(formData.country)}
                </p>
              )}
            </div>

            {/* State */}
            <div className="w-full">
              <label htmlFor="state" className="text-sm font-medium">
                State / Province <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => handleInputChange("state", value)}
                disabled={!formData.country}
              >
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder={formData.country ? "Select State" : "Select Country First"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>States</SelectLabel>
                    {stateOptions.length > 0 ? (
                      stateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        {isStateLoading ? "Loading states..." : "No states available"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {locationError.states && (
                <p className="text-xs text-red-500 mt-1">{locationError.states}</p>
              )}
            </div>

            {/* City */}
            <div className="w-full">
              <label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.city} 
                onValueChange={(value) => handleInputChange("city", value)}
                disabled={!formData.state}
              >
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder={formData.state ? "Select City" : "Select State First"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>Cities</SelectLabel>
                    {cityOptions.length > 0 ? (
                      cityOptions.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        {isCityLoading ? "Loading cities..." : "No cities available"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {locationError.cities && (
                <p className="text-xs text-red-500 mt-1">{locationError.cities}</p>
              )}
            </div>

            {/* Postal Code */}
            <div className="w-full">
              <label htmlFor="postalCode" className="text-sm font-medium">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
              />
            </div>

            {/* Tax ID */}
            <div className="w-full md:col-span-2">
              <label htmlFor="taxId" className="text-sm font-medium">
                Tax ID
              </label>
              <input
                id="taxId"
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Input ID Number"
                value={formData.taxId}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button 
                onClick={() => navigate('/seeker/create-account/personal-information')}
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
                disabled={loading || !formData.country || !formData.state || !formData.city}
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

export default Address;
