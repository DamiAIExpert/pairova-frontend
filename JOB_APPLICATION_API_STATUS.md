# Job Application API - Current Status & Requirements

## Current Backend API Status

### ✅ What Exists
The backend currently has a **basic job application API**:

**Endpoint**: `POST /applicants/me/jobs/:jobId/apply`

**Current DTO** (`CreateApplicationDto`):
```typescript
{
  jobId: string;           // Required - UUID of the job
  coverLetter?: string;    // Optional - Cover letter text
  resumeUploadId?: string; // Optional - UUID of uploaded resume
}
```

**Current Database Schema** (`applications` table):
- `id` - UUID
- `job_id` - UUID (foreign key)
- `applicant_id` - UUID (foreign key)
- `status` - enum (PENDING, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED)
- `cover_letter` - text (nullable)
- `resume_upload_id` - UUID (nullable, foreign key to uploads)
- `resume_url` - text (nullable)
- `match_score` - numeric (nullable)
- `notes` - text (nullable)
- `applied_at` - timestamp
- `created_at` - timestamp
- `updated_at` - timestamp

### ❌ What's Missing

The current API **does NOT handle** the following data we're collecting in the frontend:

1. **Personal Application Details**:
   - Full Name
   - Email
   - Phone Number
   - LinkedIn URL
   - Portfolio URL
   - Years of Experience
   - Current Employer
   - Expected Salary
   - Availability Date
   - Willing to Relocate
   - Reference Contact

2. **Experience Entries** (multiple):
   - Company
   - Position
   - Employment Type
   - Start Date
   - End Date
   - Currently Working
   - Location
   - State
   - Postal Code
   - Description

3. **Education Entries** (multiple):
   - School
   - Degree
   - Field of Study
   - Start Date
   - End Date
   - Grade
   - Description

4. **Certifications** (multiple):
   - File Upload
   - Name
   - Issuing Organization
   - Issue Date
   - Credential ID
   - Credential URL

5. **Skills**:
   - Hard/Soft Skills (array)
   - Technical Skills (array)

## Current Data Storage Strategy

The additional data (experience, education, certifications, skills) is **already stored in the user's profile** through separate entities:

- ✅ **Experience**: `experiences` table (via `ProfileService`)
- ✅ **Education**: `educations` table (via `ProfileService`)
- ✅ **Skills**: Stored in `applicant_profiles.skills` (JSON array)
- ❌ **Certifications**: Need to verify if this exists

## Recommended Solutions

### Option 1: Use Existing Profile Data (Current Approach)
**Status**: ✅ **This is what we're doing now**

The application form collects comprehensive data, but:
1. **Basic application** is submitted via `/applicants/me/jobs/:jobId/apply`
2. **Additional data** (experience, education, skills) is saved to the user's profile
3. When reviewing applications, the nonprofit can view the applicant's full profile

**Pros**:
- No backend changes needed
- Data is already structured and stored
- Applicants maintain one source of truth for their profile

**Cons**:
- Application doesn't capture a "snapshot" of the applicant at application time
- If user updates profile later, historical applications reflect new data

### Option 2: Extend Application Entity (Future Enhancement)
Create a comprehensive application submission that includes all data:

**New DTO**:
```typescript
{
  jobId: string;
  coverLetter: string;
  resumeUploadId?: string;
  
  // Personal Details
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: string;
  currentEmployer?: string;
  expectedSalary?: string;
  availabilityDate?: string;
  willingToRelocate?: boolean;
  referenceContact?: string;
  
  // Nested Arrays
  experiences?: ExperienceDto[];
  education?: EducationDto[];
  certifications?: CertificationDto[];
  hardSkills?: string[];
  techSkills?: string[];
}
```

**Pros**:
- Complete snapshot of applicant at application time
- Self-contained application data
- Better for historical tracking

**Cons**:
- Requires significant backend changes
- Data duplication
- More complex to maintain

## Current Frontend Implementation

The frontend form (`apply.tsx`) collects all the comprehensive data and:

1. ✅ Pre-fills user data from profile
2. ✅ Allows dynamic addition of experience, education, certifications, skills
3. ✅ Validates required fields
4. ✅ Handles file uploads
5. ⚠️ **Currently submits only basic data** (jobId, coverLetter, resumeUploadId)

## What Happens on Submit (Current)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Only these fields are sent to the backend
  const applicationData = {
    jobId: id,
    coverLetter: formData.coverLetter,
    resumeUploadId: formData.resume ? uploadedResumeId : undefined
  };
  
  // All other data (experiences, education, etc.) is NOT sent
  // It exists only in the user's profile
};
```

## Recommendations for Production

### Immediate (Current Implementation)
1. ✅ Keep the comprehensive form for better UX
2. ✅ Submit basic application (jobId, coverLetter, resume)
3. ✅ Ensure user profile is up-to-date before applying
4. ✅ Display full profile when reviewing applications

### Short-term Enhancement
1. **Save profile data before submitting application**:
   - Update experience, education, skills via ProfileService
   - Then submit application
   - This ensures profile is current at application time

### Long-term Enhancement
1. **Create comprehensive application API**:
   - Extend CreateApplicationDto
   - Add database columns or JSON field
   - Store complete snapshot with application

## Filter Sidebar

The filter sidebar has been added to the application page for consistency with the job finder page. It includes:
- ✅ Job Type (Contract, Full Time, Part Time, Internship)
- ✅ Experience (Less than a year, 1-3 years, 3-5 years, 5-10 years)
- ✅ Open to volunteer
- ✅ Job Timeline (Less than 24 hours, 1-3 weeks, 1 month, 2-10 months)
- ✅ Expected Salary (Under $1000, $1000-$10000, My own preference)

**Note**: The filters on the application page are for display consistency but don't affect the application submission.

## Summary

**Current Status**: ✅ **Working with basic application submission**

The form collects comprehensive data for a great user experience, but the backend currently only stores:
- Job ID
- Cover Letter
- Resume Upload ID

All other data (experience, education, skills) exists in the user's profile and can be viewed when reviewing applications.

**For production**, this approach works well because:
1. Users maintain one profile
2. Applications reference the profile
3. No data duplication
4. Simpler backend logic

If you need application snapshots in the future, we can enhance the backend API.


