import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";
import { ProfileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/authStore";
import { useFileUpload } from "@/hooks/useFileUpload";
import { apiClient } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { countries } from "@/utils/countries";
import { LocationService } from "@/services/location.service";
import { UniversityService } from "@/services/university.service";

const ATTACHMENT_ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  course: string;
  grade: string;
  role: string;
  description: string;
};

// Section Card Component
const SectionCard = ({ 
  title, 
  children, 
  showCheck = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  showCheck?: boolean;
}) => {
  return (
    <div className="bg-white border border-black/30 my-2 rounded-md">
      <div className="py-2 px-5 border-b border-black/30 flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        {showCheck && (
          <Icon icon="mdi:check-circle" className="text-2xl text-gray-600" />
        )}
      </div>
      <div className="px-5 py-3">
        {children}
      </div>
    </div>
  );
};

// File Drop Zone Component
interface FileDropZoneProps {
  files: Array<{
    id: string;
    file: File | null;
    name: string;
    size: number;
    progress: number;
    url?: string;
    status: 'uploading' | 'uploaded' | 'error';
    error?: string;
  }>;
  onFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
}

const FileDropZone = ({ files, onFiles, onRemove }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFiles(selectedFiles);
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-[#1B66BA] bg-blue-50' : 'border-black/30 hover:bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon icon="material-symbols:upload-rounded" className="text-4xl mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          Drag and Drop or <span className="text-black font-medium">Choose File</span> for upload
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className="flex items-center justify-between p-3 border border-black/30 rounded-md"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon icon="lucide:file-text" className="text-2xl text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1B66BA] truncate">{fileItem.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          fileItem.status === 'error'
                            ? 'bg-red-500'
                            : fileItem.status === 'uploaded'
                            ? 'bg-green-600'
                            : 'bg-[#1B66BA]'
                        }`}
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        fileItem.status === 'error'
                          ? 'text-red-600'
                          : fileItem.status === 'uploaded'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {fileItem.status === 'error'
                        ? fileItem.error || 'Upload failed'
                        : fileItem.status === 'uploaded'
                        ? 'Uploaded'
                        : 'Uploading...'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(fileItem.id);
                }}
                className="ml-3 text-red-600 hover:text-red-700 flex-shrink-0"
              >
                <Icon icon="mdi:close" className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UpdateSeekerProfile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isReloadingRef = useRef(false);

  // Account Section State
  const [accountData, setAccountData] = useState({
    workPosition: "",
    country: "",
    photoUrl: "",
    profilePhoto: null as File | null,
  });

  // Personal Information State
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    language: "",
    gender: "male",
    languageProficiency: "native",
  });

  const getCountryNameFromCode = (code: string) => {
    const country = countries.find((c) => c.code === code);
    return country?.name || code;
  };

  const getCountryCodeFromName = (name: string) => {
    if (!name) return "";
    const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return country?.code || name;
  };

  // Address State
  const [addressData, setAddressData] = useState({
    city: "",
    state: "",
    postalCode: "",
    taxId: "",
    countryCode: "",
  });
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationError, setLocationError] = useState({ states: "", cities: "" });

  // Education State (multiple entries) - declared early because useEffect uses them
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    { id: `temp-${Math.random().toString()}`, school: "", degree: "", course: "", grade: "", role: "", description: "" }
  ]);
  const [educationSchoolLookup, setEducationSchoolLookup] = useState<Record<
    string,
    { options: string[]; loading: boolean; error: string }
  >>({});
  const [activeEducationSearchId, setActiveEducationSearchId] = useState<string | null>(null);

  useEffect(() => {
    if (!addressData.countryCode) {
      setStateOptions([]);
      setCityOptions([]);
      return;
    }

    const controller = new AbortController();
    setStatesLoading(true);
    setLocationError((prev) => ({ ...prev, states: "" }));

    LocationService.getStates(
      getCountryNameFromCode(addressData.countryCode),
      controller.signal,
    )
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
      .finally(() => setStatesLoading(false));

    return () => controller.abort();
  }, [addressData.countryCode]);

  useEffect(() => {
    if (!addressData.countryCode || !addressData.state) {
      setCityOptions([]);
      return;
    }

    const controller = new AbortController();
    setCitiesLoading(true);
    setLocationError((prev) => ({ ...prev, cities: "" }));

    LocationService.getCities(
      getCountryNameFromCode(addressData.countryCode),
      addressData.state,
      controller.signal,
    )
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
      .finally(() => setCitiesLoading(false));

    return () => controller.abort();
  }, [addressData.countryCode, addressData.state]);

  useEffect(() => {
    if (!activeEducationSearchId) return;
    const entry = educationEntries.find((e) => e.id === activeEducationSearchId);
    if (!entry) return;

    const query = entry.school.trim();
    if (query.length < 2) {
      setEducationSchoolLookup((prev) => ({
        ...prev,
        [activeEducationSearchId]: { options: [], loading: false, error: "" },
      }));
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setEducationSchoolLookup((prev) => ({
        ...prev,
        [activeEducationSearchId]: {
          ...(prev[activeEducationSearchId] ?? { options: [] }),
          loading: true,
          error: "",
        },
      }));

      UniversityService.searchUniversities({ name: query, signal: controller.signal })
        .then((universities) => {
          const uniqueNames = Array.from(new Set(universities.map((u) => u.name))).slice(0, 50);
          setEducationSchoolLookup((prev) => ({
            ...prev,
            [activeEducationSearchId]: { options: uniqueNames, loading: false, error: "" },
          }));
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Failed to fetch universities:", err);
          setEducationSchoolLookup((prev) => ({
            ...prev,
            [activeEducationSearchId]: {
              options: prev[activeEducationSearchId]?.options ?? [],
              loading: false,
              error: "Unable to fetch universities. Please keep typing.",
            },
          }));
        });
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [activeEducationSearchId, educationEntries]);

  // Bio State
  const [bio, setBio] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 150;

  // Attach Files State
  interface FileItem {
    id: string;
  file: File | null;
    name: string;
    size: number;
    progress: number;
    url?: string;
  status: 'uploading' | 'uploaded' | 'error';
  error?: string;
  }
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([]);
  const [attachmentError, setAttachmentError] = useState("");

  const validateAttachment = (file: File): string | null => {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      return `File "${file.name}" must be less than 10MB`;
    }
    if (!ATTACHMENT_ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type for "${file.name}". Allowed: PDF, DOC, DOCX, JPG, PNG.`;
    }
    return null;
  };

  const uploadAttachmentFile = async (tempId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      setAttachedFiles((prev) =>
        prev.map((item) =>
          item.id === tempId ? { ...item, status: 'uploading', progress: 15, error: undefined } : item,
        ),
      );

      const response = await apiClient.post<{ url: string; publicId?: string }>(
        '/uploads/simple',
        formData,
      );

      setAttachedFiles((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                status: 'uploaded',
                progress: 100,
                url: response.data?.url,
                file: null,
              }
            : item,
        ),
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Upload failed. Please try again.';
      setAttachedFiles((prev) =>
        prev.map((item) =>
          item.id === tempId ? { ...item, status: 'error', progress: 100, error: message } : item,
        ),
      );
    }
  };

  const handleAttachmentFiles = (files: File[]) => {
    setAttachmentError("");
    files.forEach((file) => {
      const validation = validateAttachment(file);
      if (validation) {
        setAttachmentError(validation);
        return;
      }

      const tempId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString();
      const newItem: FileItem = {
        id: tempId,
        file,
        name: file.name,
        size: file.size,
        progress: 5,
        status: 'uploading',
      };
      setAttachedFiles((prev) => [...prev, newItem]);
      uploadAttachmentFile(tempId, file);
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  // Experience State (multiple entries)
  interface ExperienceEntry {
    id: string;
    employmentType: string;
    companyName: string;
    jobRole: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    state: string;
    postalCode: string;
    description: string;
  }
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([
    { id: "1", employmentType: "", companyName: "", jobRole: "", startDate: "", endDate: "", currentlyWorking: false, state: "", postalCode: "", description: "" }
  ]);

  // Certificates State (multiple entries)
  interface CertificateEntry {
    id: string;
    file: File | null;
    name: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
    progress: number;
    status?: 'uploading' | 'uploaded' | 'error';
    error?: string;
    url?: string;
  }
  const [certificateEntries, setCertificateEntries] = useState<CertificateEntry[]>([
    { id: "1", file: null, name: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", progress: 0 }
  ]);

  // Skills State
  const [hardSoftSkills, setHardSoftSkills] = useState<string[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [hardSoftSkillInput, setHardSoftSkillInput] = useState("");
  const [technicalSkillInput, setTechnicalSkillInput] = useState("");

  const updateEducationEntry = (id: string, field: keyof EducationEntry, value: string) => {
    setEducationEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    );

    if (field === "school") {
      setActiveEducationSearchId(id);
    }
  };

  const removeEducationEntry = async (id: string) => {
    console.log("🗑️ removeEducationEntry called with ID:", id);
    const entry = educationEntries.find(e => e.id === id);
    if (!entry) return;

    // Check if this is a backend entry (has a real ID, not temp)
    const hasBackendId = id && !id.startsWith('temp-');
    
    // Remove from UI immediately for better UX
    setEducationEntries((prev) => {
      const filtered = prev.filter((entry) => entry.id !== id);
      console.log("Education entries after removal:", filtered.length, "remaining");
      return filtered;
    });
    setEducationSchoolLookup((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (activeEducationSearchId === id) {
      setActiveEducationSearchId(null);
    }

    // If it's a backend entry, delete it from the backend immediately
    if (hasBackendId) {
      try {
        console.log("🗑️ Deleting education from backend:", id);
        await apiClient.delete(`/profiles/education/${id}`);
        console.log("✅ Successfully deleted education from backend:", id);
      } catch (err: any) {
        console.error("❌ Failed to delete education from backend:", err);
        // Re-add to UI if deletion failed
        setEducationEntries((prev) => {
          if (!prev.find(e => e.id === id)) {
            return [...prev, entry];
          }
          return prev;
        });
        setError(`Failed to delete education entry: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // File Upload Hook for Avatar
  const {
    uploading: uploadingAvatar,
    error: _uploadError,
    uploadProgress,
    uploadFile,
    resetUpload,
  } = useFileUpload({
    maxSize: 4 * 1024 * 1024, // 4MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    kind: 'avatar',
    onSuccess: (url) => {
      setAccountData((prev) => ({ ...prev, photoUrl: url }));
    },
    onError: (errorMsg) => {
      setError(errorMsg);
    },
  });

  // File Upload Hook for Certificates (supports PDFs and images)
  const uploadCertificateFile = async (certId: string, file: File) => {
    try {
      setCertificateEntries((prev) =>
        prev.map((cert) =>
          cert.id === certId ? { ...cert, progress: 5, status: 'uploading' } : cert
        )
      );

      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ url: string; publicId?: string }>(
        '/uploads/simple',
        formData
      );

      const uploadedUrl = response.data.url;
      setCertificateEntries((prev) =>
        prev.map((cert) =>
          cert.id === certId
            ? { ...cert, credentialUrl: uploadedUrl, progress: 100, status: 'uploaded' }
            : cert
        )
      );
    } catch (err: any) {
      console.error('Failed to upload certificate file:', err);
      setCertificateEntries((prev) =>
        prev.map((cert) =>
          cert.id === certId
            ? { ...cert, progress: 0, status: 'error', error: err.response?.data?.message || 'Upload failed' }
            : cert
        )
      );
      setError(err.response?.data?.message || 'Failed to upload certificate file. Please try again.');
    }
  };

  // Shared function to reload profile data - memoized to prevent unnecessary re-renders
  const reloadProfileData = useCallback(async () => {
    // Prevent duplicate reloads
    if (isReloadingRef.current) {
      console.log("⏭️ Skipping reload - already in progress");
      return;
    }
    
    isReloadingRef.current = true;
    try {
      console.log("🔄 Starting profile data reload...");
      const [profile, experiences, educations, certifications] = await Promise.all([
        ProfileService.getProfile().catch(() => null),
        apiClient.get('/profiles/experience').then(r => r.data).catch(() => []),
        apiClient.get('/profiles/education').then(r => r.data).catch(() => []),
        apiClient.get('/profiles/certifications').then(r => r.data).catch(() => []),
      ]);

        if (profile) {
          setAccountData({
            workPosition: profile.workPosition || "",
            country: profile.country || "",
            photoUrl: profile.photoUrl || "",
            profilePhoto: null,
          });
          setPersonalData({
            firstName: profile.firstName || user?.firstName || "",
            lastName: profile.lastName || user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : "",
            language: "",
            gender: (profile.gender || "male").toLowerCase(),
            languageProficiency: "native",
          });
          setAddressData({
            city: profile.city || "",
            state: profile.state || "",
            postalCode: profile.postalCode || "",
            taxId: "",
            countryCode: getCountryCodeFromName(profile.country || ""),
          });
          setBio(profile.bio || "");
          setWordCount((profile.bio || "").trim().split(/\s+/).filter((w: string) => w.length > 0).length);
          
          // Load skills
          if (profile.skills && Array.isArray(profile.skills)) {
            // Split skills into hard/soft and technical (this is a simple heuristic)
            setHardSoftSkills(profile.skills.filter((s: string) => 
              !['javascript', 'python', 'react', 'sql', 'java', 'c#', 'html', 'css', 'node', 'typescript'].includes(s.toLowerCase())
            ));
            setTechnicalSkills(profile.skills.filter((s: string) => 
              ['javascript', 'python', 'react', 'sql', 'java', 'c#', 'html', 'css', 'node', 'typescript'].includes(s.toLowerCase())
            ));
          }

          // Load education entries
          if (Array.isArray(educations) && educations.length > 0) {
            const mappedEducations = educations.map((edu: any) => {
              const mapped = {
                id: edu.id || `temp-${Math.random().toString()}`,
                school: edu.school || "",
                degree: edu.degree || "",
                course: edu.fieldOfStudy || "",
                grade: edu.grade || "",
                role: edu.role || "",
                description: edu.description || "",
              };
              console.log(`Mapping education: backend ID="${edu.id}", mapped ID="${mapped.id}"`);
              return mapped;
            });
            console.log("📥 Loaded educations from backend:", educations);
            console.log("📥 Mapped education entries:", mappedEducations);
            setEducationEntries(mappedEducations);
          } else {
            // Initialize with one empty entry if no educations exist
            setEducationEntries([{
              id: `temp-${Math.random().toString()}`,
              school: "",
              degree: "",
              course: "",
              grade: "",
              role: "",
              description: "",
            }]);
          }

          // Load experience entries
          if (Array.isArray(experiences) && experiences.length > 0) {
            const mappedExperiences = experiences.map((exp: any) => {
              const mapped = {
                id: exp.id || `temp-${Math.random().toString()}`,
                employmentType: exp.employmentType || "",
                companyName: exp.company || "",
                jobRole: exp.roleTitle || "",
                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
                currentlyWorking: !exp.endDate,
                state: exp.locationState || "",
                postalCode: exp.postalCode || "",
                description: exp.description || "",
              };
              console.log(`Mapping experience: backend ID="${exp.id}", mapped ID="${mapped.id}"`);
              return mapped;
            });
            console.log("📥 Loaded experiences from backend:", experiences);
            console.log("📥 Mapped experience entries:", mappedExperiences);
            setExperienceEntries(mappedExperiences);
          } else {
            // Initialize with one empty entry if no experiences exist
            setExperienceEntries([{
              id: `temp-${Math.random().toString()}`,
              employmentType: "",
              companyName: "",
              jobRole: "",
              startDate: "",
              endDate: "",
              currentlyWorking: false,
              state: "",
              postalCode: "",
              description: "",
            }]);
          }

          // Load certificate entries
          if (Array.isArray(certifications) && certifications.length > 0) {
            const mappedCertifications = certifications.map((cert: any) => {
              const mapped = {
                id: cert.id || `temp-${Math.random().toString()}`,
                file: null,
                name: cert.name || "",
                issuer: cert.issuer || "",
                issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : "",
                credentialId: cert.credentialId || "",
                credentialUrl: cert.credentialUrl || "",
                progress: 100,
                url: cert.credentialUrl,
              };
              console.log(`Mapping certification: backend ID="${cert.id}", mapped ID="${mapped.id}"`);
              return mapped;
            });
            console.log("📥 Loaded certifications from backend:", certifications);
            console.log("📥 Mapped certificate entries:", mappedCertifications);
            setCertificateEntries(mappedCertifications);
          } else {
            // Initialize with one empty entry if no certifications exist
            setCertificateEntries([{
              id: `temp-${Math.random().toString()}`,
              file: null,
              name: "",
              issuer: "",
              issueDate: "",
              credentialId: "",
              credentialUrl: "",
              progress: 0,
            }]);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        isReloadingRef.current = false;
        console.log("✅ Profile data reload completed");
      }
    }, [user]);

  // Load existing profile data on mount
  useEffect(() => {
    reloadProfileData();
  }, [reloadProfileData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAccountData((prev) => ({ ...prev, profilePhoto: file }));
    await uploadFile(file);
  };

  const handleRemovePhoto = () => {
    setAccountData((prev) => ({ ...prev, profilePhoto: null, photoUrl: "" }));
    resetUpload();
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length <= maxWords) {
      setBio(text);
      setWordCount(words.length);
      setError(""); // Clear error when user types
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate bio if provided (backend requires 10-500 characters)
      if (bio.trim() && bio.trim().length < 10) {
        setError("Bio must be at least 10 characters long.");
        setLoading(false);
        return;
      }

      // Update basic profile data
      await ProfileService.updateProfile({
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        gender: personalData.gender.toUpperCase() as any,
        dob: personalData.dob || undefined,
        bio: bio.trim() || undefined,
        country: addressData.countryCode
          ? getCountryNameFromCode(addressData.countryCode)
          : accountData.country,
        state: addressData.state,
        city: addressData.city,
        postalCode: addressData.postalCode || undefined,
        workPosition: accountData.workPosition || undefined,
        photoUrl: accountData.photoUrl || undefined,
        phone: personalData.phone || undefined,
        skills: [...hardSoftSkills, ...technicalSkills],
      });

      // Save education entries - first get existing entries to track deletions
      const existingEducations = await apiClient.get('/profiles/education').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []);
      console.log("=== EDUCATION DELETE TRACE ===");
      console.log("Existing educations from backend:", existingEducations);
      console.log("Current education entries in state:", educationEntries);
      
      const existingEducationIds = new Set(existingEducations.map((e: any) => e.id).filter(Boolean));
      const currentEducationIds = new Set(educationEntries.map(e => {
        // Check if ID is from backend (not a temp ID starting with "temp-")
        return e.id && !e.id.startsWith('temp-') ? e.id : null;
      }).filter(Boolean));
      
      // Create a map of existing entries by ID for quick lookup
      const _existingEducationMap = new Map(existingEducations.map((e: any) => [e.id, e]));
      
      console.log("Existing education IDs from backend:", Array.from(existingEducationIds));
      console.log("Current education IDs in state:", Array.from(currentEducationIds));
      
      // Delete education entries that were removed
      const educationDeletions: Promise<void>[] = [];
      const educationToDelete: any[] = [];
      for (const existing of existingEducations) {
        if (existing.id && !currentEducationIds.has(existing.id)) {
          educationToDelete.push(existing);
          console.log(`Marking education for deletion: ${existing.id} (not found in current entries)`);
          educationDeletions.push(
            apiClient.delete(`/profiles/education/${existing.id}`)
              .then((response) => {
                console.log("✅ Successfully deleted education:", existing.id, response);
              })
              .catch((err: any) => {
                console.error("❌ Failed to delete education:", existing.id, err);
                console.error("Error details:", {
                  status: err.response?.status,
                  statusText: err.response?.statusText,
                  data: err.response?.data,
                  message: err.message
                });
                // If DELETE endpoint doesn't exist (404/405), we can't delete from backend
                if (err.response?.status === 404 || err.response?.status === 405) {
                  console.warn(`DELETE endpoint does not exist for education. Entry ${existing.id} will remain in backend.`);
                } else {
                  throw new Error(`Failed to delete education entry ${existing.id}: ${err.response?.data?.message || err.message}`);
                }
              })
          );
        } else {
          console.log(`Keeping education: ${existing.id} (found in current entries)`);
        }
      }
      console.log(`Total educations to delete: ${educationToDelete.length}`);
      // Wait for all deletions to complete
      const educationDeleteResults = await Promise.allSettled(educationDeletions);
      console.log("Education deletion results:", educationDeleteResults);
      console.log("=== END EDUCATION DELETE TRACE ===");

      // CRITICAL FIX: After deletions, refetch existing entries to get the current state
      // This prevents duplicate creation when entries were just deleted
      const remainingEducations = await apiClient.get('/profiles/education').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []);
      console.log("📥 Refetched educations after deletion:", remainingEducations.length, "entries remaining");
      
      // Update the existingEducations array and maps to reflect deletions
      const remainingEducationIds = new Set(remainingEducations.map((e: any) => e.id).filter(Boolean));
      const remainingEducationMap = new Map(remainingEducations.map((e: any) => [e.id, e]));

      // Create or update education entries
      for (const edu of educationEntries) {
        if (edu.school && edu.degree) {
          // Check if this is an existing entry (has a backend ID) or new
          const hasBackendId = edu.id && !edu.id.startsWith('temp-');
          const existsInBackend = hasBackendId && remainingEducationIds.has(edu.id);
          
          // Also check if this entry matches an existing one by content (to avoid duplicates)
          const existingEntry = hasBackendId ? remainingEducationMap.get(edu.id) : null;
          const hasChanged = existingEntry ? (
            existingEntry.school !== edu.school ||
            existingEntry.degree !== edu.degree ||
            existingEntry.fieldOfStudy !== edu.course ||
            existingEntry.grade !== edu.grade ||
            existingEntry.role !== edu.role ||
            existingEntry.description !== edu.description
          ) : true;
          
          console.log(`Processing education: id=${edu.id}, hasBackendId=${hasBackendId}, existsInBackend=${existsInBackend}, hasChanged=${hasChanged}`);
          
          if (existsInBackend) {
            // Only update if data has changed
            if (hasChanged) {
              try {
                // Try PUT first
                await apiClient.put(`/profiles/education/${edu.id}`, {
                  school: edu.school,
                  degree: edu.degree,
                  fieldOfStudy: edu.course || undefined,
                  grade: edu.grade || undefined,
                  role: edu.role || undefined,
                  description: edu.description || undefined,
                  startDate: undefined,
                  endDate: undefined,
                });
                console.log("✅ Successfully updated education:", edu.id);
              } catch (err: any) {
                console.error("PUT failed for education, trying PATCH:", err);
                // If PUT fails, try PATCH
                try {
                  await apiClient.patch(`/profiles/education/${edu.id}`, {
                    school: edu.school,
                    degree: edu.degree,
                    fieldOfStudy: edu.course || undefined,
                    grade: edu.grade || undefined,
                    role: edu.role || undefined,
                    description: edu.description || undefined,
                  });
                  console.log("✅ Successfully patched education:", edu.id);
                } catch (patchErr: any) {
                  console.error("PATCH also failed for education:", patchErr);
                  // Don't try delete and recreate - just log the error
                  console.warn("Education entry update failed. Entry may not be updated in backend.");
                }
              }
            } else {
              console.log("⏭️ Skipping education update - no changes detected:", edu.id);
            }
          } else {
            // Create new entry only if it doesn't already exist
            // CRITICAL FIX: Check against REMAINING entries (after deletions), not the old array
            const duplicateExists = remainingEducations.some((e: any) => 
              e.school === edu.school && e.degree === edu.degree
            );
            
            if (duplicateExists) {
              console.log("⏭️ Skipping education creation - duplicate entry already exists:", edu.school, edu.degree);
            } else {
              try {
                const response = await apiClient.post('/profiles/education', {
                  school: edu.school,
                  degree: edu.degree,
                  fieldOfStudy: edu.course || undefined,
                  grade: edu.grade || undefined,
                  role: edu.role || undefined,
                  description: edu.description || undefined,
                  startDate: undefined,
                  endDate: undefined,
                });
                console.log("✅ Successfully created education:", (response.data as any)?.id || 'new');
              } catch (err: any) {
                console.error("❌ Failed to create education:", err);
              }
            }
          }
        }
      }

      // Save experience entries - first get existing entries to track deletions
      const existingExperiences = await apiClient.get('/profiles/experience').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []);
      console.log("=== EXPERIENCE DELETE TRACE ===");
      console.log("Existing experiences from backend:", existingExperiences);
      console.log("Current experience entries in state:", experienceEntries);
      
      const existingExperienceIds = new Set(existingExperiences.map((e: any) => e.id).filter(Boolean));
      const currentExperienceIds = new Set(experienceEntries.map(e => {
        // Check if ID is from backend (not a temp ID starting with "temp-")
        return e.id && !e.id.startsWith('temp-') ? e.id : null;
      }).filter(Boolean));
      
      // Create a map of existing entries by ID for quick lookup
      const _existingExperienceMap = new Map(existingExperiences.map((e: any) => [e.id, e]));
      
      console.log("Existing experience IDs from backend:", Array.from(existingExperienceIds));
      console.log("Current experience IDs in state:", Array.from(currentExperienceIds));
      
      // Delete experience entries that were removed
      const experienceDeletions: Promise<void>[] = [];
      const experienceToDelete: any[] = [];
      for (const existing of existingExperiences) {
        if (existing.id && !currentExperienceIds.has(existing.id)) {
          experienceToDelete.push(existing);
          console.log(`Marking experience for deletion: ${existing.id} (not found in current entries)`);
          experienceDeletions.push(
            apiClient.delete(`/profiles/experience/${existing.id}`)
              .then((response) => {
                console.log("✅ Successfully deleted experience:", existing.id, response);
              })
              .catch((err: any) => {
                console.error("❌ Failed to delete experience:", existing.id, err);
                console.error("Error details:", {
                  status: err.response?.status,
                  statusText: err.response?.statusText,
                  data: err.response?.data,
                  message: err.message
                });
                // If DELETE endpoint doesn't exist (404/405), we can't delete from backend
                if (err.response?.status === 404 || err.response?.status === 405) {
                  console.warn(`DELETE endpoint does not exist for experience. Entry ${existing.id} will remain in backend.`);
                } else {
                  throw new Error(`Failed to delete experience entry ${existing.id}: ${err.response?.data?.message || err.message}`);
                }
              })
          );
        } else {
          console.log(`Keeping experience: ${existing.id} (found in current entries)`);
        }
      }
      console.log(`Total experiences to delete: ${experienceToDelete.length}`);
      // Wait for all deletions to complete
      const experienceDeleteResults = await Promise.allSettled(experienceDeletions);
      console.log("Experience deletion results:", experienceDeleteResults);
      console.log("=== END EXPERIENCE DELETE TRACE ===");

      // CRITICAL FIX: After deletions, refetch existing entries to get the current state
      // This prevents duplicate creation when entries were just deleted
      const remainingExperiences = await apiClient.get('/profiles/experience').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []);
      console.log("📥 Refetched experiences after deletion:", remainingExperiences.length, "entries remaining");
      
      // Update the existingExperiences array and maps to reflect deletions
      const remainingExperienceIds = new Set(remainingExperiences.map((e: any) => e.id).filter(Boolean));
      const remainingExperienceMap = new Map(remainingExperiences.map((e: any) => [e.id, e]));

      // Create or update experience entries
      for (const exp of experienceEntries) {
        if (exp.companyName && exp.jobRole) {
          // Map frontend employment type to backend enum
          let employmentType: string | undefined = undefined;
          if (exp.employmentType) {
            const typeMap: Record<string, string> = {
              'full-time': 'FULL_TIME',
              'part-time': 'PART_TIME',
              'contract': 'CONTRACT',
              'freelance': 'CONTRACT', // Map freelance to CONTRACT as enum doesn't have FREELANCE
              'volunteer': 'VOLUNTEER',
              'internship': 'INTERNSHIP',
            };
            employmentType = typeMap[exp.employmentType.toLowerCase()] || exp.employmentType.toUpperCase();
          }

          // Check if this is an existing entry (has a backend ID) or new
          const hasBackendId = exp.id && !exp.id.startsWith('temp-');
          const existsInBackend = hasBackendId && remainingExperienceIds.has(exp.id);
          
          // Also check if this entry matches an existing one by content (to avoid duplicates)
          const existingEntry = hasBackendId ? remainingExperienceMap.get(exp.id) : null;
          const hasChanged = existingEntry ? (
            existingEntry.company !== exp.companyName ||
            existingEntry.roleTitle !== exp.jobRole ||
            existingEntry.employmentType !== employmentType ||
            existingEntry.locationState !== exp.state ||
            existingEntry.postalCode !== exp.postalCode ||
            existingEntry.startDate !== exp.startDate ||
            existingEntry.endDate !== (exp.currentlyWorking ? undefined : exp.endDate) ||
            existingEntry.description !== exp.description
          ) : true;
          
          console.log(`Processing experience: id=${exp.id}, hasBackendId=${hasBackendId}, existsInBackend=${existsInBackend}, hasChanged=${hasChanged}`);

          if (existsInBackend) {
            // Only update if data has changed
            if (hasChanged) {
              try {
                // Try PUT first
                await apiClient.put(`/profiles/experience/${exp.id}`, {
                  company: exp.companyName,
                  roleTitle: exp.jobRole,
                  employmentType: employmentType as any,
                  locationCity: undefined,
                  locationState: exp.state || undefined,
                  locationCountry: undefined,
                  postalCode: exp.postalCode || undefined,
                  startDate: exp.startDate || undefined,
                  endDate: exp.currentlyWorking ? undefined : (exp.endDate || undefined),
                  description: exp.description || undefined,
                });
                console.log("✅ Successfully updated experience:", exp.id);
              } catch (err: any) {
                console.error("PUT failed for experience, trying PATCH:", err);
                // If PUT fails, try PATCH
                try {
                  await apiClient.patch(`/profiles/experience/${exp.id}`, {
                    company: exp.companyName,
                    roleTitle: exp.jobRole,
                    employmentType: employmentType as any,
                    locationState: exp.state || undefined,
                    postalCode: exp.postalCode || undefined,
                    startDate: exp.startDate || undefined,
                    endDate: exp.currentlyWorking ? undefined : (exp.endDate || undefined),
                    description: exp.description || undefined,
                  });
                  console.log("✅ Successfully patched experience:", exp.id);
                } catch (patchErr: any) {
                  console.error("PATCH also failed for experience:", patchErr);
                  // Don't try delete and recreate - just log the error
                  console.warn("Experience entry update failed. Entry may not be updated in backend.");
                }
              }
            } else {
              console.log("⏭️ Skipping experience update - no changes detected:", exp.id);
            }
          } else {
            // Create new entry only if it doesn't already exist
            // CRITICAL FIX: Check against REMAINING entries (after deletions), not the old array
            const duplicateExists = remainingExperiences.some((e: any) => 
              e.company === exp.companyName && e.roleTitle === exp.jobRole
            );
            
            if (duplicateExists) {
              console.log("⏭️ Skipping experience creation - duplicate entry already exists:", exp.companyName, exp.jobRole);
            } else {
              try {
                const response = await apiClient.post('/profiles/experience', {
                  company: exp.companyName,
                  roleTitle: exp.jobRole,
                  employmentType: employmentType as any,
                  locationCity: undefined,
                  locationState: exp.state || undefined,
                  locationCountry: undefined,
                  postalCode: exp.postalCode || undefined,
                  startDate: exp.startDate || undefined,
                  endDate: exp.currentlyWorking ? undefined : (exp.endDate || undefined),
                  description: exp.description || undefined,
                });
                console.log("✅ Successfully created experience:", (response.data as any)?.id || 'new');
              } catch (err: any) {
                console.error("❌ Failed to create experience:", err);
                setError(err.response?.data?.message || "Failed to save experience entry. Please try again.");
              }
            }
          }
        }
      }

      // Save certificate entries - first get existing entries to track deletions
      const existingCertifications = await apiClient.get('/profiles/certifications').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []);
      console.log("=== CERTIFICATION DELETE TRACE ===");
      console.log("Existing certifications from backend:", existingCertifications);
      console.log("Current certificate entries in state:", certificateEntries);
      
      const existingCertificationIds = new Set(existingCertifications.map((c: any) => c.id).filter(Boolean));
      const currentCertificationIds = new Set(certificateEntries.map(c => {
        // Check if ID is from backend (not a temp ID starting with "temp-")
        return c.id && !c.id.startsWith('temp-') ? c.id : null;
      }).filter(Boolean));
      
      // Create a map of existing entries by ID for quick lookup
      const _existingCertificationMap = new Map(existingCertifications.map((c: any) => [c.id, c]));
      
      console.log("Existing certification IDs from backend:", Array.from(existingCertificationIds));
      console.log("Current certification IDs in state:", Array.from(currentCertificationIds));
      
      // Delete certificate entries that were removed
      const certificationDeletions: Promise<void>[] = [];
      const certificationToDelete: any[] = [];
      for (const existing of existingCertifications) {
        if (existing.id && !currentCertificationIds.has(existing.id)) {
          certificationToDelete.push(existing);
          console.log(`Marking certification for deletion: ${existing.id} (not found in current entries)`);
          certificationDeletions.push(
            apiClient.delete(`/profiles/certifications/${existing.id}`)
              .then((response) => {
                console.log("✅ Successfully deleted certification:", existing.id, response);
              })
              .catch((err: any) => {
                console.error("❌ Failed to delete certification:", existing.id, err);
                console.error("Error details:", {
                  status: err.response?.status,
                  statusText: err.response?.statusText,
                  data: err.response?.data,
                  message: err.message
                });
                // If DELETE endpoint doesn't exist (404/405), we can't delete from backend
                if (err.response?.status === 404 || err.response?.status === 405) {
                  console.warn(`DELETE endpoint does not exist for certification. Entry ${existing.id} will remain in backend.`);
                } else {
                  throw new Error(`Failed to delete certification entry ${existing.id}: ${err.response?.data?.message || err.message}`);
                }
              })
          );
        } else {
          console.log(`Keeping certification: ${existing.id} (found in current entries)`);
        }
      }
      console.log(`Total certifications to delete: ${certificationToDelete.length}`);
      // Wait for all deletions to complete
      const certificationDeleteResults = await Promise.allSettled(certificationDeletions);
      console.log("Certification deletion results:", certificationDeleteResults);
      console.log("=== END CERTIFICATION DELETE TRACE ===");

      // CRITICAL FIX: After deletions, refetch existing entries to get the current state
      // This prevents duplicate creation when entries were just deleted
      const remainingCertifications = await apiClient.get('/profiles/certifications').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []);
      console.log("📥 Refetched certifications after deletion:", remainingCertifications.length, "entries remaining");
      
      // Update the existingCertifications array and maps to reflect deletions
      const remainingCertificationIds = new Set(remainingCertifications.map((c: any) => c.id).filter(Boolean));
      const remainingCertificationMap = new Map(remainingCertifications.map((c: any) => [c.id, c]));

      // Create or update certificate entries
      for (const cert of certificateEntries) {
        // Only save if we have a name or a credential URL (uploaded file)
        if (cert.name || cert.credentialUrl) {
          // If there's a file but no credentialUrl yet, wait for upload to complete
          if (cert.file && !cert.credentialUrl && cert.status === 'uploading') {
            setError('Please wait for certificate file to finish uploading before saving.');
            setLoading(false);
            return;
          }

          // Check if this is an existing entry (has a backend ID) or new
          const hasBackendId = cert.id && !cert.id.startsWith('temp-');
          const existsInBackend = hasBackendId && remainingCertificationIds.has(cert.id);
          
          // Also check if this entry matches an existing one by content (to avoid duplicates)
          const existingEntry = hasBackendId ? remainingCertificationMap.get(cert.id) : null;
          const hasChanged = existingEntry ? (
            existingEntry.name !== (cert.name || 'Untitled Certificate') ||
            existingEntry.issuer !== cert.issuer ||
            existingEntry.issueDate !== cert.issueDate ||
            existingEntry.credentialUrl !== cert.credentialUrl ||
            existingEntry.credentialId !== cert.credentialId
          ) : true;
          
          console.log(`Processing certification: id=${cert.id}, hasBackendId=${hasBackendId}, existsInBackend=${existsInBackend}, hasChanged=${hasChanged}`);

          if (existsInBackend) {
            // Only update if data has changed
            if (hasChanged) {
              try {
                await apiClient.put(`/profiles/certifications/${cert.id}`, {
                  name: cert.name || 'Untitled Certificate',
                  issuer: cert.issuer || undefined,
                  issueDate: cert.issueDate || undefined,
                  credentialUrl: cert.credentialUrl || undefined,
                  credentialId: cert.credentialId || undefined,
                });
                console.log("✅ Successfully updated certification:", cert.id);
              } catch (err: any) {
                console.error("PUT failed for certification, trying PATCH:", err);
                // If PUT fails, try PATCH
                try {
                  await apiClient.patch(`/profiles/certifications/${cert.id}`, {
                    name: cert.name || 'Untitled Certificate',
                    issuer: cert.issuer || undefined,
                    issueDate: cert.issueDate || undefined,
                    credentialUrl: cert.credentialUrl || undefined,
                    credentialId: cert.credentialId || undefined,
                  });
                  console.log("✅ Successfully patched certification:", cert.id);
                } catch (patchErr: any) {
                  console.error("PATCH also failed for certification:", patchErr);
                  console.warn("Certification entry update failed. Entry may not be updated in backend.");
                }
              }
            } else {
              console.log("⏭️ Skipping certification update - no changes detected:", cert.id);
            }
          } else {
            // Create new entry only if it doesn't already exist
            // CRITICAL FIX: Check against REMAINING entries (after deletions), not the old array
            const duplicateExists = remainingCertifications.some((c: any) => 
              c.name === (cert.name || 'Untitled Certificate') && c.issuer === cert.issuer
            );
            
            if (duplicateExists) {
              console.log("⏭️ Skipping certification creation - duplicate entry already exists:", cert.name, cert.issuer);
            } else {
              try {
                const response = await apiClient.post('/profiles/certifications', {
                  name: cert.name || 'Untitled Certificate',
                  issuer: cert.issuer || undefined,
                  issueDate: cert.issueDate || undefined,
                  credentialUrl: cert.credentialUrl || undefined,
                  credentialId: cert.credentialId || undefined,
                });
                const certResponse = response.data as any;
                console.log("✅ Successfully created certification:", certResponse?.id || 'new');
              } catch (err: any) {
                console.error("❌ Failed to create certification:", err);
                setError(err.response?.data?.message || "Failed to save certification. Please try again.");
              }
            }
          }
        }
      }

      // Show success - stay on edit page
      console.log("Profile update completed successfully");
      // Add a small delay to ensure backend has processed all changes
      await new Promise(resolve => setTimeout(resolve, 500));
      // Reload profile data to reflect changes without navigating away
      await reloadProfileData();
      
      // Show success message
      setError(""); // Clear any errors
      // Optionally show a success toast/notification here
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (personalData.firstName && personalData.lastName) {
      return `${personalData.firstName[0]}${personalData.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-[#E4E4E480] px-5 py-2">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => navigate("/seeker/profile")}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="text-2xl" />
          </button>
          <h1 className="text-2xl font-semibold">Edit Account</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-5">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Account Section */}
        <SectionCard title="Account" showCheck>
          <p className="text-xs text-[#797979] mb-3">
            Please configure and fill in your information
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
            {accountData.photoUrl ? (
              <img
                src={accountData.photoUrl}
                alt="profile"
                className="w-[120px] h-[120px] rounded-[50%] object-cover"
              />
            ) : accountData.profilePhoto ? (
              <img
                src={URL.createObjectURL(accountData.profilePhoto)}
                alt="profile preview"
                className="w-[120px] h-[120px] rounded-[50%] object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-[50%] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {getUserInitials()}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label
                htmlFor="upload"
                className="border border-black/30 rounded-md py-2 px-8 cursor-pointer hover:bg-gray-50 transition-colors text-center"
              >
                <input
                  type="file"
                  id="upload"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingAvatar}
                />
                {uploadingAvatar ? `Uploading... ${uploadProgress}%` : "Upload Photo"}
              </label>
              {(accountData.photoUrl || accountData.profilePhoto) && (
                <button
                  className="bg-black text-white py-2 px-8 rounded-md hover:bg-gray-800 transition-colors"
                  onClick={handleRemovePhoto}
                  disabled={uploadingAvatar}
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">Pick a photo of up to 4 MB</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Work Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountData.workPosition}
                onChange={(e) => setAccountData(prev => ({ ...prev, workPosition: e.target.value }))}
                className="py-2 px-4 border border-black/30 rounded-md w-full mt-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter work position"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <Select 
                value={accountData.country} 
                onValueChange={(value) => setAccountData(prev => ({ ...prev, country: value }))}
              >
                <SelectTrigger className="py-2 px-4 border border-black/30 rounded-md w-full mt-2">
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
            </div>
          </div>
        </SectionCard>

        {/* Personal Information Section */}
        <SectionCard title="Personal Information" showCheck>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={personalData.firstName}
                onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter First Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={personalData.lastName}
                onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Last Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={personalData.email}
                readOnly
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 bg-gray-50 cursor-not-allowed"
                placeholder="Enter Email Address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                value={personalData.phone}
                onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Phone Number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                value={personalData.dob}
                onChange={(e) => setPersonalData(prev => ({ ...prev, dob: e.target.value }))}
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Select Language</label>
              <Select 
                value={personalData.language} 
                onValueChange={(value) => setPersonalData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md w-full mt-3">
                  <SelectValue placeholder="Pick Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Select Gender</label>
              <RadioGroup
                value={personalData.gender}
                onValueChange={(value) => setPersonalData(prev => ({ ...prev, gender: value }))}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" />
                  <label>Male</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" />
                  <label>Female</label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Language Proficiency</label>
              <RadioGroup
                value={personalData.languageProficiency}
                onValueChange={(value) => setPersonalData(prev => ({ ...prev, languageProficiency: value }))}
                className="flex items-center gap-4 flex-wrap"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="native" />
                  <label>Native</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="professional" />
                  <label>Professional</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="intermediate" />
                  <label>Intermediate</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </SectionCard>

        {/* Address Section */}
        <SectionCard title="Address" showCheck>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">Postal Code</label>
              <input
                type="text"
                value={addressData.postalCode}
                onChange={(e) => setAddressData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter code"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tax ID</label>
              <input
                type="text"
                value={addressData.taxId}
                onChange={(e) => setAddressData(prev => ({ ...prev, taxId: e.target.value }))}
                className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Input ID Number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Select Country</label>
              <Select 
                value={addressData.countryCode} 
                onValueChange={(value) => setAddressData(prev => ({ ...prev, countryCode: value, state: "", city: "" }))}
              >
                <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md w-full mt-3">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">State / Province</label>
              <Select 
                value={addressData.state} 
                onValueChange={(value) => setAddressData(prev => ({ ...prev, state: value, city: "" }))}
                disabled={!addressData.countryCode}
              >
                <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder={addressData.countryCode ? "Select State" : "Select Country First"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {stateOptions.length > 0 ? (
                      stateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        {statesLoading ? "Loading states..." : "No states available"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {locationError.states && (
                <p className="text-xs text-red-500 mt-1">{locationError.states}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Select 
                value={addressData.city} 
                onValueChange={(value) => setAddressData(prev => ({ ...prev, city: value }))}
                disabled={!addressData.state}
              >
                <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder={addressData.state ? "Select City" : "Select State First"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cityOptions.length > 0 ? (
                      cityOptions.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        {citiesLoading ? "Loading cities..." : "No cities available"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {locationError.cities && (
                <p className="text-xs text-red-500 mt-1">{locationError.cities}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Bio Section */}
        <SectionCard title="Bio" showCheck>
          <div className="border-2 border-black/20 rounded-md p-5 focus-within:border-black transition-colors">
            <textarea
              value={bio}
              onChange={handleBioChange}
              className="resize-none w-full focus:outline-none"
              rows={8}
              placeholder="Enter a brief description about yourself..."
            />
            <div className="flex justify-end mt-2">
              <p className="text-sm text-gray-500">
                Read {wordCount} words
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Attach Files Section */}
        <SectionCard title="Attach Files" showCheck>
          <FileDropZone
            files={attachedFiles}
            onFiles={handleAttachmentFiles}
            onRemove={handleRemoveAttachment}
          />
          {attachmentError && (
            <p className="text-sm text-red-600 mt-3">{attachmentError}</p>
          )}
        </SectionCard>

        {/* Education Section */}
        <SectionCard title="Education" showCheck>
          {educationEntries.map((entry, index) => {
            const datalistId = `education-university-options-${entry.id}`;
            const lookup = educationSchoolLookup[entry.id];

            return (
            <div key={entry.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-700">Education Entry {index + 1}</h5>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete button clicked for education:", entry.id);
                    removeEducationEntry(entry.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 text-sm cursor-pointer transition-colors p-2 rounded-md flex items-center justify-center relative z-10 min-w-[40px] min-h-[40px]"
                  title="Delete this education entry"
                  aria-label="Delete education entry"
                >
                  <Icon icon="mdi:delete" className="text-xl pointer-events-none" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium">School</label>
                    <input
                      type="text"
                      list={datalistId}
                    value={entry.school} 
                      onChange={(e) => updateEducationEntry(entry.id, "school", e.target.value)}
                      className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Start typing to search global universities"
                    />
                    <datalist id={datalistId}>
                      {(lookup?.options ?? []).map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                    {lookup?.loading && (
                      <p className="text-xs text-gray-500 mt-1">Searching worldwide universities...</p>
                    )}
                    {lookup?.error && (
                      <p className="text-xs text-red-500 mt-1">{lookup.error}</p>
                    )}
                    {!lookup?.loading && !lookup?.error && (lookup?.options?.length ?? 0) === 0 && entry.school.trim().length >= 2 && (
                      <p className="text-xs text-gray-500 mt-1">No matches found. Keep typing to refine.</p>
                    )}
                </div>
                <div>
                  <label className="text-sm font-medium">Degree</label>
                  <Select 
                    value={entry.degree} 
                      onValueChange={(value) => updateEducationEntry(entry.id, "degree", value)}
                  >
                    <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md w-full mt-3">
                      <SelectValue placeholder="Select Degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Course</label>
                  <Select 
                    value={entry.course} 
                      onValueChange={(value) => updateEducationEntry(entry.id, "course", value)}
                  >
                    <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md w-full mt-3">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="administration">Administration</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Grade</label>
                  <input
                    type="text"
                    value={entry.grade}
                      onChange={(e) => updateEducationEntry(entry.id, "grade", e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="First Class Honours"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <input
                    type="text"
                    value={entry.role}
                      onChange={(e) => updateEducationEntry(entry.id, "role", e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Input major role"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={entry.description}
                      onChange={(e) => updateEducationEntry(entry.id, "description", e.target.value)}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    rows={3}
                    placeholder="Type here"
                  />
                </div>
              </div>
            </div>
            );
          })}
          <button
            type="button"
            onClick={() => setEducationEntries(prev => [...prev, {
              id: `temp-${Math.random().toString()}`,
              school: "",
              degree: "",
              course: "",
              grade: "",
              role: "",
              description: "",
            }])}
            className="flex items-center gap-2 text-[#1B66BA] hover:text-blue-700 mt-4"
          >
            <Icon icon="mdi:plus-circle" className="text-2xl" />
            <span>Add Education</span>
          </button>
        </SectionCard>

        {/* Add Certificates Section */}
        <SectionCard title="Add Certificates" showCheck>
          {certificateEntries.map((entry, index) => (
            <div key={entry.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-700">Certificate {index + 1}</h5>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete button clicked for certificate:", entry.id);
                    
                    const hasBackendId = entry.id && !entry.id.startsWith('temp-');
                    
                    // Remove from UI immediately
                    setCertificateEntries(prev => {
                      const filtered = prev.filter(cert => cert.id !== entry.id);
                      console.log("Certificate entries after removal:", filtered.length, "remaining");
                      return filtered;
                    });

                    // If it's a backend entry, delete it from the backend immediately
                    if (hasBackendId) {
                      try {
                        console.log("🗑️ Deleting certificate from backend:", entry.id);
                        await apiClient.delete(`/profiles/certifications/${entry.id}`);
                        console.log("✅ Successfully deleted certificate from backend:", entry.id);
                      } catch (err: any) {
                        console.error("❌ Failed to delete certificate from backend:", err);
                        // Re-add to UI if deletion failed
                        setCertificateEntries(prev => {
                          if (!prev.find(c => c.id === entry.id)) {
                            return [...prev, entry];
                          }
                          return prev;
                        });
                        setError(`Failed to delete certificate entry: ${err.response?.data?.message || err.message}`);
                      }
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 text-sm cursor-pointer transition-colors p-2 rounded-md flex items-center justify-center relative z-10 min-w-[40px] min-h-[40px]"
                  title="Delete this certificate entry"
                  aria-label="Delete certificate entry"
                >
                  <Icon icon="mdi:delete" className="text-xl pointer-events-none" />
                </button>
              </div>
              <div className="mb-4">
                <FileDropZone
                  files={entry.file ? [{
                    id: entry.id,
                    file: entry.file,
                    name: entry.name || entry.file.name,
                    size: entry.file.size,
                    progress: entry.progress,
                    status: entry.status || 'uploading',
                    error: entry.error,
                    url: entry.credentialUrl,
                  }] : []}
                  onFiles={(files) => {
                    if (files[0]) {
                      const file = files[0];
                      // Validate file type (allow PDFs and images)
                      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                      if (!allowedTypes.includes(file.type)) {
                        setError('Certificate must be a PDF or image file (JPEG, PNG)');
                        return;
                      }
                      // Validate file size (max 10MB)
                      if (file.size > 10 * 1024 * 1024) {
                        setError('Certificate file must be less than 10MB');
                        return;
                      }
                      setCertificateEntries(prev => prev.map(cert => 
                        cert.id === entry.id ? { ...cert, file, name: cert.name || file.name, progress: 0 } : cert
                      ));
                      // Upload file to Cloudinary
                      uploadCertificateFile(entry.id, file);
                    }
                  }}
                  onRemove={() => setCertificateEntries(prev => prev.map(cert => 
                    cert.id === entry.id ? { ...cert, file: null, name: "", progress: 0, credentialUrl: "", status: undefined, error: undefined } : cert
                  ))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium">Certificate Name</label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) => setCertificateEntries(prev => prev.map(cert => 
                      cert.id === entry.id ? { ...cert, name: e.target.value } : cert
                    ))}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Professional Business Administrator"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issuing Organization</label>
                  <input
                    type="text"
                    value={entry.issuer}
                    onChange={(e) => setCertificateEntries(prev => prev.map(cert => 
                      cert.id === entry.id ? { ...cert, issuer: e.target.value } : cert
                    ))}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Google.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <input
                    type="date"
                    value={entry.issueDate}
                    onChange={(e) => setCertificateEntries(prev => prev.map(cert => 
                      cert.id === entry.id ? { ...cert, issueDate: e.target.value } : cert
                    ))}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Credential ID</label>
                  <input
                    type="text"
                    value={entry.credentialId}
                    onChange={(e) => setCertificateEntries(prev => prev.map(cert => 
                      cert.id === entry.id ? { ...cert, credentialId: e.target.value } : cert
                    ))}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter credential ID"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCertificateEntries(prev => [...prev, {
              id: `temp-${Math.random().toString()}`,
              file: null,
              name: "",
              issuer: "",
              issueDate: "",
              credentialId: "",
              credentialUrl: "",
              progress: 0,
            }])}
            className="flex items-center gap-2 text-[#1B66BA] hover:text-blue-700 mt-4"
          >
            <Icon icon="mdi:plus-circle" className="text-2xl" />
            <span>Add Certificate</span>
          </button>
        </SectionCard>

        {/* Experience Section */}
        <SectionCard title="Experience" showCheck>
          {experienceEntries.map((entry, index) => (
            <div key={entry.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-700">Experience Entry {index + 1}</h5>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete button clicked for experience:", entry.id);
                    
                    const hasBackendId = entry.id && !entry.id.startsWith('temp-');
                    
                    // Remove from UI immediately
                    setExperienceEntries(prev => {
                      const filtered = prev.filter(exp => exp.id !== entry.id);
                      console.log("Experience entries after removal:", filtered.length, "remaining");
                      return filtered;
                    });

                    // If it's a backend entry, delete it from the backend immediately
                    if (hasBackendId) {
                      try {
                        console.log("🗑️ Deleting experience from backend:", entry.id);
                        await apiClient.delete(`/profiles/experience/${entry.id}`);
                        console.log("✅ Successfully deleted experience from backend:", entry.id);
                      } catch (err: any) {
                        console.error("❌ Failed to delete experience from backend:", err);
                        // Re-add to UI if deletion failed
                        setExperienceEntries(prev => {
                          if (!prev.find(e => e.id === entry.id)) {
                            return [...prev, entry];
                          }
                          return prev;
                        });
                        setError(`Failed to delete experience entry: ${err.response?.data?.message || err.message}`);
                      }
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 text-sm cursor-pointer transition-colors p-2 rounded-md flex items-center justify-center relative z-10 min-w-[40px] min-h-[40px]"
                  title="Delete this experience entry"
                  aria-label="Delete experience entry"
                >
                  <Icon icon="mdi:delete" className="text-xl pointer-events-none" />
                </button>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium mb-3 block">Employment Type</label>
                <RadioGroup
                  value={entry.employmentType}
                  onValueChange={(value) => setExperienceEntries(prev => prev.map(exp => 
                    exp.id === entry.id ? { ...exp, employmentType: value } : exp
                  ))}
                  className="flex items-center gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="full-time" />
                    <label>Full Time</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="freelance" />
                    <label>Freelance</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="part-time" />
                    <label>Part Time</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="contract" />
                    <label>Contract</label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <input
                    type="text"
                    value={entry.companyName}
                    onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                      exp.id === entry.id ? { ...exp, companyName: e.target.value } : exp
                    ))}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Quantum SHAD"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Role</label>
                  <input
                    type="text"
                    value={entry.jobRole}
                    onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                      exp.id === entry.id ? { ...exp, jobRole: e.target.value } : exp
                    ))}
                    className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Charity Manager"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={entry.currentlyWorking}
                    onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                      exp.id === entry.id ? { ...exp, currentlyWorking: e.target.checked } : exp
                    ))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Same as company address</span>
                </label>
              </div>
              <div className="mb-5">
                <h6 className="text-sm font-medium mb-3">Job Timeline</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      value={entry.startDate}
                      onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                        exp.id === entry.id ? { ...exp, startDate: e.target.value } : exp
                      ))}
                      className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <input
                      type="date"
                      value={entry.endDate}
                      onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                        exp.id === entry.id ? { ...exp, endDate: e.target.value } : exp
                      ))}
                      disabled={entry.currentlyWorking}
                      className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Province / State</label>
                    <input
                      type="text"
                      value={entry.state}
                      onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                        exp.id === entry.id ? { ...exp, state: e.target.value } : exp
                      ))}
                      className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Select Province / State"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Postal Code</label>
                    <input
                      type="text"
                      value={entry.postalCode}
                      onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                        exp.id === entry.id ? { ...exp, postalCode: e.target.value } : exp
                      ))}
                      className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="0X 011-222"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={entry.description}
                  onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                    exp.id === entry.id ? { ...exp, description: e.target.value } : exp
                  ))}
                  className="py-3 px-4 border border-black/30 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={5}
                  placeholder="Type here"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setExperienceEntries(prev => [...prev, {
              id: `temp-${Math.random().toString()}`,
              employmentType: "",
              companyName: "",
              jobRole: "",
              startDate: "",
              endDate: "",
              currentlyWorking: false,
              state: "",
              postalCode: "",
              description: "",
            }])}
            className="flex items-center gap-2 text-[#1B66BA] hover:text-blue-700 mt-4"
          >
            <Icon icon="mdi:plus-circle" className="text-2xl" />
            <span>Add Experience</span>
          </button>
        </SectionCard>

        {/* Skills Section */}
        <SectionCard title="Skills" showCheck>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-sm font-medium mb-3 block">Hard / Soft Skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hardSoftSkillInput}
                  onChange={(e) => setHardSoftSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && hardSoftSkillInput.trim()) {
                      e.preventDefault();
                      setHardSoftSkills(prev => [...prev, hardSoftSkillInput.trim()]);
                      setHardSoftSkillInput("");
                    }
                  }}
                  className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter skill"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (hardSoftSkillInput.trim()) {
                      setHardSoftSkills(prev => [...prev, hardSoftSkillInput.trim()]);
                      setHardSoftSkillInput("");
                    }
                  }}
                  className="px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  <Icon icon="mdi:plus" className="text-xl" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {hardSoftSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => setHardSoftSkills(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon icon="mdi:close" className="text-sm" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Technical Skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={technicalSkillInput}
                  onChange={(e) => setTechnicalSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && technicalSkillInput.trim()) {
                      e.preventDefault();
                      setTechnicalSkills(prev => [...prev, technicalSkillInput.trim()]);
                      setTechnicalSkillInput("");
                    }
                  }}
                  className="flex-1 py-3 px-4 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter skill"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (technicalSkillInput.trim()) {
                      setTechnicalSkills(prev => [...prev, technicalSkillInput.trim()]);
                      setTechnicalSkillInput("");
                    }
                  }}
                  className="px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  <Icon icon="mdi:plus" className="text-xl" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {technicalSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => setTechnicalSkills(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon icon="mdi:close" className="text-sm" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Update Button */}
        <div className="flex justify-end mb-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSeekerProfile;

