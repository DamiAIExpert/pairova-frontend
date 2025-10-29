# 🎯 NGO ONBOARDING - ONE ENDPOINT IMPLEMENTATION

## **Overview**

Implemented a comprehensive single-endpoint approach for NGO onboarding where ALL data from steps 1-7 is collected locally and submitted in ONE API call at the end.

---

## **✅ What Was Implemented**

### **Backend Changes**

#### **1. Created Comprehensive DTO**
**File:** `pairova-backend/src/users/nonprofit/dto/complete-onboarding.dto.ts`

Collects ALL data from all 7 onboarding steps:
```typescript
export class CompleteOnboardingDto {
  // Step 1: Account Info
  orgName: string;
  country: string;
  logoUrl?: string;

  // Step 2: Company Information
  contactEmail?: string;
  phone: string;
  foundedOn?: string;
  orgType: string;
  industry: string;
  sizeLabel: string;
  website?: string;
  registrationNumber?: string;

  // Step 3: Address
  addressCountry: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;

  // Step 4: Bio
  bio: string;

  // Step 5: Mission Statement
  missionStatement: string;

  // Step 6: Our Values
  values: string;

  // Step 7: Skills
  requiredSkills: string[];

  // Optional fields
  firstName?: string;
  lastName?: string;
  position?: string;
  socialMediaLinks?: Record<string, string>;
}
```

#### **2. Added New Backend Endpoint**
**File:** `pairova-backend/src/users/nonprofit/nonprofit.controller.ts`

```typescript
@Post('onboarding')
@Roles(Role.NONPROFIT)
async completeOnboarding(
  @CurrentUser() user: User,
  @Body() onboardingDto: CompleteOnboardingDto,
): Promise<NonprofitOrg>
```

**Endpoint:** `POST /profiles/nonprofit/onboarding`

**Features:**
- ✅ Accepts complete onboarding data from all 7 steps
- ✅ Protected with JWT auth
- ✅ Requires NONPROFIT role
- ✅ Detailed logging for debugging
- ✅ Comprehensive validation via class-validator

#### **3. Implemented Service Logic**
**File:** `pairova-backend/src/users/nonprofit/nonprofit.service.ts`

```typescript
async completeOnboarding(user: User, onboardingDto: CompleteOnboardingDto): Promise<NonprofitOrg>
```

**What it does:**
1. ✅ Checks if nonprofit profile exists
2. ✅ Creates profile if it doesn't exist
3. ✅ Maps all 7 steps of data to the entity
4. ✅ Saves everything in ONE database transaction
5. ✅ Returns complete profile
6. ✅ Detailed emoji logging for easy debugging:
   - 🚀 Starting onboarding
   - 🔍 Checking for existing profile
   - ✅ Profile found/created
   - 📝 Mapping data
   - 🔄 Merging data
   - 💾 Saving to database
   - 🎉 Onboarding completed
   - 📊 Final profile data

#### **4. Database Migration**
**File:** `pairova-backend/database/migrations/1730140000000-AddOnboardingFieldsToNonprofit.ts`

Added missing fields to `nonprofit_orgs` table:
- ✅ `mission_statement` (text) - Mission statement from step 5
- ✅ `phone` (varchar 20) - Contact phone from step 2
- ✅ `postal_code` (varchar 20) - Postal code from step 3

**Migration executed successfully:** ✅

---

### **Frontend Changes**

#### **1. Updated Frontend Service**
**File:** `pairova-frontend/src/services/nonprofit.service.ts`

**New Interface:**
```typescript
export interface CompleteOnboardingDto {
  // All fields from steps 1-7
}
```

**New Methods:**

##### **`completeOnboarding(data)`** - Main submission method
```typescript
static async completeOnboarding(data: CompleteOnboardingDto): Promise<NonprofitProfile>
```
- Submits ALL onboarding data to backend in ONE API call
- Returns complete profile

##### **`saveToLocalStorage(step, data)`** - Save step data locally
```typescript
static saveToLocalStorage(step: string, data: any): void
```
- Saves form data to localStorage as user progresses
- Key format: `npo_onboarding_{step}`
- Example: `npo_onboarding_accountInfo`

##### **`getFromLocalStorage(step)`** - Retrieve step data
```typescript
static getFromLocalStorage(step: string): any
```
- Retrieves previously saved step data
- Returns `null` if no data exists

##### **`getAllOnboardingData()`** - Get all data at once
```typescript
static getAllOnboardingData(): Partial<CompleteOnboardingDto>
```
- Retrieves ALL onboarding data from localStorage
- Combines data from all 7 steps
- Ready to submit to backend

##### **`clearOnboardingData()`** - Clean up after submission
```typescript
static clearOnboardingData(): void
```
- Clears all onboarding data from localStorage
- Clears all completion flags
- Called after successful submission

---

## **🔄 How It Works - User Flow**

### **Current Behavior (Individual Steps)**
```
Step 1: Account Info
  ↓ Click "Save and Continue"
  ✅ Save to backend: NonprofitService.updateProfileStep()
  ✅ Mark complete: localStorage.setItem('npo_accountInfo', 'completed')
  ✅ Navigate to Step 2

Step 2: Company Information
  ↓ Click "Save and Continue"
  ❌ Only updates localStorage flag (data lost!)
  ✅ Navigate to Step 3

... and so on ...
```

### **NEW Recommended Behavior (One Endpoint)**
```
Step 1: Account Info
  ↓ User fills form
  ↓ Click "Save and Continue"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('accountInfo', data)
  ✅ Mark complete: localStorage.setItem('npo_accountInfo', 'completed')
  ✅ Navigate to Step 2

Step 2: Company Information
  ↓ User fills form
  ↓ Click "Save and Continue"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('companyInfo', data)
  ✅ Mark complete: localStorage.setItem('npo_companyInfo', 'completed')
  ✅ Navigate to Step 3

Step 3: Address
  ↓ User fills form
  ↓ Click "Save and Continue"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('address', data)
  ✅ Mark complete: localStorage.setItem('npo_address', 'completed')
  ✅ Navigate to Step 4

Step 4: Bio
  ↓ User fills form
  ↓ Click "Save and Continue"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('bio', data)
  ✅ Mark complete: localStorage.setItem('npo_bio', 'completed')
  ✅ Navigate to Step 5

Step 5: Mission Statement
  ↓ User fills form
  ↓ Click "Save and Continue"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('missionStatement', data)
  ✅ Mark complete: localStorage.setItem('npo_missionStatement', 'completed')
  ✅ Navigate to Step 6

Step 6: Our Values
  ↓ User fills form
  ↓ Click "Save and Continue"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('values', data)
  ✅ Mark complete: localStorage.setItem('npo_values', 'completed')
  ✅ Navigate to Step 7

Step 7: Skills (FINAL STEP)
  ↓ User fills form
  ↓ Click "Complete Onboarding" / "Finish"
  ✅ Save to localStorage: NonprofitService.saveToLocalStorage('skills', data)
  ✅ Get all data: const allData = NonprofitService.getAllOnboardingData()
  ✅ Submit to backend: await NonprofitService.completeOnboarding(allData)
  ✅ Clear localStorage: NonprofitService.clearOnboardingData()
  ✅ Mark user as onboarded: update has_completed_onboarding flag
  ✅ Navigate to dashboard
```

---

## **📝 Implementation Guide - What You Need To Do**

### **For Each Form (Steps 1-6):**

#### **1. Update "Save and Continue" Handler**

**Before (Current - Data Lost):**
```typescript
<button 
  onClick={() => {
    localStorage.setItem('npo_companyInfo', 'completed');
    window.dispatchEvent(new Event('npoProgressUpdate'));
  }}
>
  Save and Continue
</button>
```

**After (New - Data Saved):**
```typescript
const handleSaveAndContinue = () => {
  // 1. Save form data to localStorage
  NonprofitService.saveToLocalStorage('companyInfo', {
    phone: formData.phone,
    foundedOn: formData.foundedOn,
    orgType: formData.orgType,
    industry: formData.industry,
    sizeLabel: formData.sizeLabel,
    website: formData.website,
    registrationNumber: formData.registrationNumber,
  });

  // 2. Mark section as complete
  localStorage.setItem('npo_companyInfo', 'completed');
  window.dispatchEvent(new Event('npoProgressUpdate'));

  // 3. Navigate to next step
  navigate('/non-profit/create-account/address');
};

<button onClick={handleSaveAndContinue}>
  Save and Continue
</button>
```

#### **2. Load Existing Data on Mount**

```typescript
useEffect(() => {
  // Load previously saved data from localStorage
  const savedData = NonprofitService.getFromLocalStorage('companyInfo');
  if (savedData) {
    setFormData(prev => ({ ...prev, ...savedData }));
  }
}, []);
```

---

### **For Step 7 (Skills - FINAL STEP):**

#### **Update "Complete Onboarding" Handler**

```typescript
const handleCompleteOnboarding = async () => {
  try {
    setLoading(true);
    setError("");

    // 1. Save current step (skills) to localStorage
    NonprofitService.saveToLocalStorage('skills', {
      requiredSkills: selectedSkills,
    });

    // 2. Get ALL onboarding data from localStorage
    const allData = NonprofitService.getAllOnboardingData();

    // 3. Validate we have all required fields
    if (!allData.orgName || !allData.phone || !allData.bio) {
      setError("Please complete all required steps");
      return;
    }

    // 4. Submit ALL data to backend in ONE API call
    await NonprofitService.completeOnboarding(allData as CompleteOnboardingDto);

    // 5. Clear all onboarding data from localStorage
    NonprofitService.clearOnboardingData();

    // 6. Navigate to dashboard or success page
    navigate('/ngo/dashboard');
  } catch (err: any) {
    console.error("Failed to complete onboarding:", err);
    setError(err.response?.data?.message || "Failed to complete onboarding");
  } finally {
    setLoading(false);
  }
};
```

---

## **🎯 Benefits of This Approach**

### **1. Performance**
- ✅ Only ONE API call instead of 7
- ✅ Reduced server load
- ✅ Faster for users (no waiting between steps)

### **2. Data Integrity**
- ✅ All data submitted as ONE transaction
- ✅ Either everything is saved or nothing (atomic operation)
- ✅ No partial profiles in database

### **3. User Experience**
- ✅ Forms save locally as user progresses
- ✅ User can go back and see their previous data
- ✅ User can close browser and resume later
- ✅ Only final step actually submits to server

### **4. Offline Support**
- ✅ User can fill forms offline
- ✅ Data saved in localStorage
- ✅ Submitted when they reach final step and have internet

### **5. Error Handling**
- ✅ If submission fails, all data is still in localStorage
- ✅ User can retry without re-filling forms
- ✅ Easy to add "Save as Draft" functionality

---

## **🚨 Important Notes**

### **localStorage Keys Used:**

**Form Data (actual user input):**
- `npo_onboarding_accountInfo` → { orgName, country, logoUrl }
- `npo_onboarding_companyInfo` → { phone, foundedOn, orgType, ... }
- `npo_onboarding_address` → { addressCountry, state, city, ... }
- `npo_onboarding_bio` → { bio }
- `npo_onboarding_missionStatement` → { missionStatement }
- `npo_onboarding_values` → { values }
- `npo_onboarding_skills` → { requiredSkills }

**Progress Tracking (completion flags):**
- `npo_accountInfo` → "completed"
- `npo_companyInfo` → "completed"
- `npo_address` → "completed"
- `npo_bio` → "completed"
- `npo_missionStatement` → "completed" (changed from `npo_mission`)
- `npo_values` → "completed"
- `npo_skills` → "completed"

### **Migration Status:**
✅ Database migration executed successfully
✅ New fields added: `mission_statement`, `phone`, `postal_code`
✅ All existing data preserved

### **Backend Endpoint:**
```
POST /profiles/nonprofit/onboarding
Authorization: Bearer <token>
Content-Type: application/json

{
  "orgName": "Save the Children Foundation",
  "country": "NG",
  "phone": "+234 800 000 0000",
  "foundedOn": "2010-01-15",
  "orgType": "NGO",
  "industry": "Social Services",
  "sizeLabel": "51-200",
  "website": "https://www.organization.org",
  "registrationNumber": "REG-123456",
  "addressCountry": "Nigeria",
  "state": "Lagos",
  "city": "Ikeja",
  "addressLine1": "123 Main Street",
  "addressLine2": "Suite 456",
  "postalCode": "100001",
  "bio": "We are a leading organization...",
  "missionStatement": "Our mission is to empower...",
  "values": "Integrity, Compassion, Excellence...",
  "requiredSkills": ["Project Management", "Fundraising"]
}
```

---

## **📋 Next Steps**

### **Frontend Forms to Update:**

1. ✅ **Account Info** - Already working (Step 1)
   - Update to use `saveToLocalStorage` instead of `updateProfileStep`

2. ❌ **Company Information** (Step 2)
   - Add `saveToLocalStorage` on submit
   - Add data loading from localStorage on mount

3. ❌ **Address** (Step 3)
   - Add `saveToLocalStorage` on submit
   - Add data loading from localStorage on mount

4. ✅ **Bio** - Already working (Step 4)
   - Update to use `saveToLocalStorage` instead of `updateProfileStep`

5. ❌ **Mission Statement** (Step 5)
   - Make textarea controlled (add state)
   - Add `saveToLocalStorage` on submit
   - Add data loading from localStorage on mount

6. ❌ **Our Values** (Step 6)
   - Make textarea controlled (add state)
   - Add `saveToLocalStorage` on submit
   - Add data loading from localStorage on mount

7. ❌ **Skills** (Step 7) - **MOST IMPORTANT**
   - Add final submission using `completeOnboarding()`
   - Add data loading from localStorage on mount
   - Clear localStorage after successful submission
   - Navigate to dashboard

---

## **🔧 Testing Checklist**

- [ ] Fill all 7 steps with data
- [ ] Verify data persists when navigating back
- [ ] Verify data persists after browser refresh
- [ ] Submit from final step (Skills)
- [ ] Check backend logs for detailed emoji logs
- [ ] Verify profile is created in database
- [ ] Verify all fields are saved correctly
- [ ] Verify localStorage is cleared after success
- [ ] Test error handling (network failure)
- [ ] Test partial completion (close browser midway)
- [ ] Test resume after partial completion

---

**Created:** October 28, 2025  
**Status:** Backend Complete ✅ | Frontend Pending ⏳  
**Next Action:** Update all frontend forms to use the new localStorage approach

