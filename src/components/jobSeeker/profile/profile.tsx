import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ProfileService, type ApplicantProfile } from "@/services/profile.service";
import { useIsAuthenticated, useUser } from "@/store/authStore";
import { apiClient } from "@/services/api";

interface Experience {
  id: string;
  company: string;
  roleTitle: string;
  employmentType?: string;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  id: string;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  issuedDate?: string;
  credentialUrl?: string;
}

interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

interface Attachment {
  id: string;
  url: string;
  filename?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh when location changes (e.g., coming back from edit page)
  useEffect(() => {
    if (location.pathname === '/seeker/profile') {
      setRefreshKey(prev => prev + 1);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/seeker/profile");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel with cache-busting timestamp
        const timestamp = Date.now();
        const [profileData, experiencesData, educationsData, certificationsData, attachmentsData, dashboardData] = await Promise.all([
          ProfileService.getProfile().catch(() => null),
          apiClient.get<Experience[]>(`/profiles/experience?_=${timestamp}`).then(r => r.data).catch(() => []),
          apiClient.get<Education[]>(`/profiles/education?_=${timestamp}`).then(r => r.data).catch(() => []),
          apiClient.get<Certification[]>(`/profiles/certifications?_=${timestamp}`).then(r => r.data).catch(() => []),
          apiClient.get<Attachment[]>(`/profiles/uploads?kind=attachment&_=${timestamp}`).then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
          apiClient.get(`/applicants/me/dashboard?_=${timestamp}`).then(r => r.data).catch(() => null),
        ]);

        // Extract statistics from dashboard response
        const statsData = (dashboardData as any)?.statistics || null;

        setProfile(profileData);
        setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
        setEducations(Array.isArray(educationsData) ? educationsData : []);
        setCertifications(Array.isArray(certificationsData) ? certificationsData : []);
        setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
        setApplicationStats(statsData);
      } catch (err: any) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate, refreshKey]);

  // Helper function to format date
  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Helper function to format date range
  const formatDateRange = (start?: string | Date, end?: string | Date): string => {
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    if (!startStr && !endStr) return "";
    if (!startStr) return `Until ${endStr}`;
    if (!endStr) return `${startStr} - Present`;
    return `${startStr} - ${endStr}`;
  };

  // Helper function to format location
  const formatLocation = (city?: string, state?: string, country?: string): string => {
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "";
  };

  // Helper function to format employment type
  const formatEmploymentType = (type?: string): string => {
    if (!type) return "";
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get full name
  const getFullName = (): string => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (profile?.firstName) return profile.firstName;
    if (user?.firstName) return user.firstName;
    return "User";
  };

  // Helper function to get profile title/bio line
  const getProfileTitle = (): string => {
    if (profile?.bio) {
      // Extract first line or first sentence from bio
      const firstLine = profile.bio.split('\n')[0];
      return firstLine.length > 100 ? firstLine.substring(0, 100) + "..." : firstLine;
    }
    if (profile?.experienceLevel) {
      const levelMap: Record<string, string> = {
        'ENTRY': 'Entry Level',
        'MID': 'Mid-Level',
        'SENIOR': 'Senior',
        'EXECUTIVE': 'Executive',
      };
      const level = levelMap[profile.experienceLevel] || profile.experienceLevel;
      const location = formatLocation(profile.city, profile.state, profile.country);
      return location ? `${level} Professional based in ${location}` : `${level} Professional`;
    }
    const location = formatLocation(profile?.city, profile?.state, profile?.country);
    return location ? `Professional based in ${location}` : "Professional";
  };

  // Helper function to get profile photo
  const getProfilePhoto = (): string => {
    if (profile?.photoUrl) {
      // Handle both absolute and relative URLs
      if (profile.photoUrl.startsWith('http://') || profile.photoUrl.startsWith('https://')) {
        return profile.photoUrl;
      }
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
      return profile.photoUrl.startsWith('/') 
        ? `${apiBaseUrl}${profile.photoUrl}` 
        : `${apiBaseUrl}/${profile.photoUrl}`;
    }
    return "/Images/profile.AVIF"; // Fallback to default image
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004D40] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Icon icon="mdi:alert-circle-outline" className="text-6xl text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading profile</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile && !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Profile not found</h3>
        <p className="text-gray-500 mb-4">Please complete your profile setup</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="min-h-screen bg-white px-3 md:px-5 lg:px-8 pb-10 w-full max-w-full overflow-x-hidden">
        <div className="overflow-hidden w-full">
          <img
            src="/Images/profile-bg.AVIF"
            alt="profile-showcase"
            className="w-full h-[150px] md:h-[200px] object-cover"
            loading="eager"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-[-40px] md:mt-[-40px] gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative mx-auto sm:mx-0">
              <img
                src={getProfilePhoto()}
                alt="profile"
                className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] rounded-[50%] border-4 border-white object-cover flex-shrink-0"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/Images/profile.AVIF";
                }}
              />
              {user?.isVerified && (
                <div className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 md:bottom-4 md:right-4 bg-[#338FFD] rounded-full p-1.5 sm:p-2 border-2 sm:border-4 border-white">
                  <Icon icon="mdi:check" className="text-white text-xs sm:text-sm md:text-base" />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h3 className="text-xl sm:text-2xl font-semibold">{getFullName()}</h3>
              <p className="text-xs sm:text-sm text-[#989898] py-1 pb-3 sm:pb-5">
                {getProfileTitle()}
              </p>
              <span className="text-xs sm:text-sm py-2 sm:py-5 block">
                {user?.isVerified ? "Verified" : "Not Verified"} •{" "}
                <span className="text-[#338FFD]">
                  Applied to {applicationStats?.totalApplications || 0} Job{applicationStats?.totalApplications !== 1 ? 's' : ''}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 sm:gap-3 border border-black/30 shadow-xl px-4 sm:px-5 py-2 rounded-md cursor-pointer text-sm sm:text-base hover:bg-gray-50 transition-colors">
              <Icon icon="tabler:video" className="text-xl sm:text-2xl" />
              <span className="whitespace-nowrap">Video call</span>
            </button>

            <button className="flex items-center justify-center gap-2 sm:gap-3 bg-[#161616] text-white px-4 sm:px-5 py-2 rounded-md cursor-pointer text-sm sm:text-base hover:bg-[#2a2a2a] transition-colors">
              <Icon icon="lucide:message-square-text" className="text-xl sm:text-2xl" />
              <span className="whitespace-nowrap">Message</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div className="mt-[30px] md:mt-[50px] mb-5 py-5 border-b border-black/30">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Bio</h3>
            <p className="text-sm text-[#989898] py-3 md:py-5 whitespace-pre-wrap break-words">
              {profile.bio.split('\n')[0]}
            </p>
          </div>
        )}

        {/* About */}
        <div>
          <div className="my-8 md:my-10 py-5 border-b border-black/30">
            <h3 className="text-lg md:text-xl font-semibold mb-5">About Me</h3>

            <div className="flex flex-col lg:flex-row gap-5 md:gap-[70px]">
              {profile?.bio && (
                <div className="lg:w-[60%]">
                  <p className="text-sm text-[#989898] whitespace-pre-wrap break-words">
                    {showFullBio ? profile.bio : profile.bio.substring(0, 200)}
                    {profile.bio.length > 200 && !showFullBio && '...'}
                  </p>
                  {profile.bio.length > 200 && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-[#1B66BA] hover:underline mt-2 text-sm"
                    >
                      {showFullBio ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-10 ${profile?.bio ? 'lg:w-[40%]' : 'w-full'}`}>
                {(formatLocation(profile?.city, profile?.state, profile?.country) || user?.email || profile?.portfolioUrl || profile?.gender) && (
                  <>
                    {formatLocation(profile?.city, profile?.state, profile?.country) && (
                      <div>
                        <h6 className="text-[#757575]">Location</h6>
                        <p className="my-2 flex items-center gap-2">
                          <Icon
                            icon="tdesign:location"
                            className="text-xl"
                          />
                          {profile && formatLocation(profile.city, profile.state, profile.country)}
                        </p>
                      </div>
                    )}

                    {profile?.gender && (
                      <div>
                        <h5 className="text-[#757575]">Gender</h5>
                        <p className="my-2 capitalize">{profile.gender.toLowerCase()}</p>
                      </div>
                    )}

                    {profile?.portfolioUrl && (
                      <div>
                        <h6 className="text-[#757575]">Portfolio</h6>
                        <p className="my-2 flex items-center gap-2">
                          <a 
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#1B66BA] hover:underline flex items-center gap-1"
                          >
                            {profile.portfolioUrl.startsWith('@') ? profile.portfolioUrl : `@${profile.portfolioUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}`}
                            <Icon icon="ph:arrow-square-out-bold" className="text-sm" />
                          </a>
                        </p>
                      </div>
                    )}

                    {user?.email && (
                      <div>
                        <h6 className="text-[#757575]">Email</h6>
                        <p className="my-2">{user.email}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Experience</h3>
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp.id} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 mt-6 md:mt-8 border-b border-black/30 pb-6 md:pb-8 last:border-b-0">
                <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-semibold text-white">
                    {exp.company.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-semibold py-1 sm:py-2 break-words">{exp.roleTitle}</h4>
                    <p className="text-xs sm:text-sm text-[#808080] break-words">
                      {exp.company}{exp.employmentType ? ` • ${formatEmploymentType(exp.employmentType)}` : ''}
                    </p>
                    <p className="text-xs sm:text-sm text-[#1B66BA] py-1 sm:py-2">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </p>
                    {formatLocation(exp.locationCity, exp.locationState, exp.locationCountry) && (
                      <p className="text-xs sm:text-sm text-[#1B66BA] break-words">
                        {formatLocation(exp.locationCity, exp.locationState, exp.locationCountry)}
                      </p>
                    )}
                  </div>

                  {exp.description && (
                    <div className="my-5 md:my-10">
                      <ul className="list-disc list-inside text-xs sm:text-sm text-[#767676] space-y-1">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                          <li key={idx} className="break-words">{line.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#989898] py-5">No experience entries yet.</p>
          )}
        </div>

        {/* Education */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Education</h3>
          {educations.length > 0 ? (
            <div className="flex flex-col lg:flex-row justify-between mt-6 md:mt-8 border-b border-black/30 pb-6 md:pb-10 gap-5">
              {educations.map((edu) => (
                <div key={edu.id} className="flex items-start sm:items-center gap-3 sm:gap-5">
                  <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-semibold text-gray-600">
                      {edu.school.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div>
                      <div className="text-xs sm:text-sm flex items-center gap-1 text-[#FFB3A6]">
                        <span className="text-xl sm:text-2xl">•</span>
                        <h5>School</h5>
                      </div>
                      <h4 className="text-lg sm:text-xl md:text-2xl font-semibold py-0 break-words">
                        {edu.school}
                      </h4>
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).length > 0 && (
                        <p className="text-xs sm:text-sm text-[#808080] break-words">
                          {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' • ')}
                        </p>
                      )}
                      {edu.grade && (
                        <p className="text-xs sm:text-sm text-[#1B66BA] py-1 sm:py-2 break-words">
                          {edu.grade}
                        </p>
                      )}
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-xs sm:text-sm text-[#1B66BA]">
                          {formatDateRange(edu.startDate, edu.endDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#989898] py-5">No education entries yet.</p>
          )}
        </div>

        {/* Certification */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Certification</h3>
          {certifications.length > 0 ? (
            <div className="flex flex-col lg:flex-row justify-between mt-6 md:mt-8 pb-6 md:pb-10 border-b border-black/30 gap-5 md:gap-10">
              {certifications.map((cert) => (
                <div key={cert.id} className="border border-black/30 rounded-md px-4 sm:px-5 py-4 sm:py-5">
                  <div className="flex items-start gap-3">
                    <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:certificate" className="text-2xl sm:text-3xl text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold break-words">
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="text-xs sm:text-sm text-[#808080] break-words">{cert.issuer}</p>
                      )}
                      {(cert.issueDate || cert.issuedDate) && (
                        <span className="text-xs sm:text-sm text-[#1B66BA] block mt-1">
                          Issued {formatDate(cert.issueDate || cert.issuedDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 gap-3">
                      <p className="text-sm sm:text-base font-semibold text-[#828282]">Verified</p>
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 border-2 border-black/30 cursor-pointer text-[#808080] bg-[#F0F0F0] rounded-[999px] py-1 px-3 text-xs sm:text-sm hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
                      >
                        Show Credential{" "}
                        <Icon icon="ph:arrow-square-out-bold" className="text-xl sm:text-2xl" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#989898] py-5">No certifications yet.</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Skills</h3>
          {profile?.skills && profile.skills.length > 0 ? (
            <div className="mt-4 md:mt-6 pb-6 md:pb-10 border-b border-black/30">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                {/* Hard and Soft Skills */}
                <div className="flex-1">
                  <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Hard and Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills
                      .filter((s: string) => 
                        !['javascript', 'python', 'react', 'sql', 'java', 'c#', 'html', 'css', 'node', 'typescript', 'angular', 'vue', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter'].includes(s.toLowerCase())
                      )
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#E0E0E0] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm text-[#767676] break-words"
                        >
                          {skill}
                        </span>
                      ))}
                    {profile.skills.filter((s: string) => 
                      !['javascript', 'python', 'react', 'sql', 'java', 'c#', 'html', 'css', 'node', 'typescript', 'angular', 'vue', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter'].includes(s.toLowerCase())
                    ).length === 0 && (
                      <p className="text-xs sm:text-sm text-[#989898]">No hard/soft skills added yet.</p>
                    )}
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="flex-1">
                  <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills
                      .filter((s: string) => 
                        ['javascript', 'python', 'react', 'sql', 'java', 'c#', 'html', 'css', 'node', 'typescript', 'angular', 'vue', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter'].includes(s.toLowerCase())
                      )
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#E0E0E0] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm text-[#767676] break-words"
                        >
                          {skill}
                        </span>
                      ))}
                    {profile.skills.filter((s: string) => 
                      ['javascript', 'python', 'react', 'sql', 'java', 'c#', 'html', 'css', 'node', 'typescript', 'angular', 'vue', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter'].includes(s.toLowerCase())
                    ).length === 0 && (
                      <p className="text-xs sm:text-sm text-[#989898]">No technical skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#989898] py-5">No skills added yet.</p>
          )}
        </div>

        {/* Attachment */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Attachment</h3>
          {attachments.length > 0 ? (
            <div className="mt-4 md:mt-6 pb-6 md:pb-10 border-b border-black/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map((attachment) => {
                  const getFileIcon = () => {
                    if (attachment.mimeType?.includes('pdf')) {
                      return 'mdi:file-pdf-box';
                    }
                    if (attachment.mimeType?.includes('image')) {
                      return 'mdi:file-image';
                    }
                    if (attachment.mimeType?.includes('word') || attachment.mimeType?.includes('document')) {
                      return 'mdi:file-word';
                    }
                    return 'mdi:file-document';
                  };

                  const formatFileSize = (bytes?: number | null): string => {
                    if (!bytes) return '';
                    if (bytes < 1024) return `${bytes} B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                  };

                  const getFileName = (): string => {
                    if (attachment.filename) return attachment.filename;
                    // Extract filename from URL if not available
                    const urlParts = attachment.url.split('/');
                    return urlParts[urlParts.length - 1] || 'Attachment';
                  };

                  return (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-black/30 rounded-md hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <Icon 
                          icon={getFileIcon()} 
                          className="text-3xl sm:text-4xl text-gray-600 group-hover:text-[#1B66BA] transition-colors" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate group-hover:text-[#1B66BA] transition-colors">
                          {getFileName()}
                        </p>
                        {attachment.sizeBytes && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {formatFileSize(attachment.sizeBytes)}
                          </p>
                        )}
                      </div>
                      <Icon 
                        icon="ph:arrow-square-out-bold" 
                        className="text-xl sm:text-2xl text-gray-400 group-hover:text-[#1B66BA] transition-colors flex-shrink-0" 
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#989898] py-5">No attachments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
