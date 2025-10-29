# 🔄 NGO ONBOARDING DATA FLOW ANALYSIS

## **Route: http://localhost:5173/non-profit/create-account**

---

## **📊 Current Implementation Status**

### **✅ WORKING: Account Info (Step 1 of 7)**
**Route:** `/non-profit/create-account`  
**Component:** `pairova-frontend/src/components/nonProfile/onboarding/account.tsx`

#### **Data Collected:**
- ✅ Company Name (`orgName`)
- ✅ Country (`country`)
- 📸 Organization Logo (file upload - UI ready, backend TODO)

#### **How It Works:**
1. **Loading:** Fetches existing profile from backend on mount
   ```typescript
   const profile = await NonprofitService.getProfile();
   ```

2. **Form State:** Stores data in React state
   ```typescript
   const [formData, setFormData] = useState({
     companyName: "",
     country: "",
     profilePhoto: null
   });
   ```

3. **Saving:** Sends to backend when "Save and Continue" is clicked
   ```typescript
   await NonprofitService.updateProfileStep({
     orgName: formData.companyName,
     country: formData.country,
   });
   ```

4. **Progress Tracking:** Marks section as complete in localStorage
   ```typescript
   localStorage.setItem('npo_accountInfo', 'completed');
   window.dispatchEvent(new Event('npoProgressUpdate'));
   ```

5. **Navigation:** Navigates to Company Info page
   ```typescript
   navigate('/non-profit/create-account/company-info');
   ```

#### **Backend API:**
- ✅ `PUT /profiles/nonprofit/me` - Updates nonprofit profile
- ✅ `GET /profiles/nonprofit/me` - Fetches nonprofit profile

---

### **❌ NOT SAVING: Company Information (Step 2 of 7)**
**Route:** `/non-profit/create-account/company-info`  
**Component:** `pairova-frontend/src/components/nonProfile/onboarding/companyInfo.tsx`

#### **Data Collected (NOT SENT TO BACKEND):**
- 📧 Company Email (pre-filled from user account, read-only)
- ❌ Phone Number
- ❌ Date Founded
- ❌ Organization Type (NGO, Charity, Foundation, etc.)
- ❌ Industry/Sector
- ❌ Organization Size (1-10, 11-50, 51-200, etc.)
- ❌ Website URL
- ❌ Registration Number

#### **Problem:**
**All form data is stored ONLY in React state (lines 18-27)**
```typescript
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
```

**"Save and Continue" button (lines 213-223) only:**
- ✅ Updates localStorage for progress tracking
- ✅ Navigates to next page
- ❌ **DOES NOT SAVE TO BACKEND**

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

#### **What Happens:**
When you click "Save and Continue":
1. ✅ Progress bar updates (localStorage flag set)
2. ✅ Page navigates to `/non-profit/create-account/address`
3. ❌ **Form data is lost forever (only existed in React state)**
4. ❌ When you navigate back, the form is empty again

---

### **❌ NOT SAVING: Address (Step 3 of 7)**
**Route:** `/non-profit/create-account/address`  
**Component:** `pairova-frontend/src/components/nonProfile/onboarding/address.tsx`

#### **Data Collected (NOT SENT TO BACKEND):**
- ❌ Country
- ❌ State/Province
- ❌ City
- ❌ Street Address (Line 1)
- ❌ Address Line 2
- ❌ Postal/ZIP Code

#### **Problem:**
Same issue as Company Info - data stored only in React state (lines 20-27), never sent to backend.

**"Save and Continue" button (lines 182-188):**
```typescript
const handleSubmit = () => {
  // Validation only
  if (!formData.country || !formData.state || !formData.city || !formData.addressLine1) {
    alert("Please fill in all required fields");
    return;
  }

  // ✅ Progress tracking
  localStorage.setItem('npo_address', 'completed');
  window.dispatchEvent(new Event('npoProgressUpdate'));

  // ✅ Navigation
  navigate('/non-profit/create-account/bio');

  // ❌ NO BACKEND CALL
}
```

---

### **✅ WORKING: Bio (Step 4 of 7)**
**Route:** `/non-profit/create-account/bio`  
**Component:** `pairova-frontend/src/pages/npo/bioNpo.tsx`

#### **Data Collected:**
- ✅ Bio (organization description, max 150 words)

#### **How It Works:**
1. **Loading:** Fetches existing bio from backend (lines 16-30)
2. **Validation:** Word count limit, minimum 10 characters
3. **Saving:** Sends to backend when "Save and Continue" is clicked (lines 45-78)
   ```typescript
   await NonprofitService.updateProfileStep({
     bio: bio.trim(),
   });
   ```
4. **Progress Tracking:** Marks section complete
5. **Navigation:** Goes to Mission Statement page

#### **Backend API:**
- ✅ `PUT /profiles/nonprofit/me` - Updates nonprofit profile

---

### **❌ NOT SAVING: Mission Statement (Step 5 of 7)**
**Route:** `/non-profit/create-account/mission-statement`  
**Component:** `pairova-frontend/src/components/nonProfile/onboarding/missionStatement.tsx`

#### **Data Collected (NOT SENT TO BACKEND):**
- ❌ Mission Statement (max 150 words)

#### **Problem:**
**Textarea is uncontrolled (lines 21-27)** - no `value` or `onChange`:
```typescript
<textarea
  name=""
  id=""
  className="resize-none w-full focus:outline-none"
  rows={8}
  placeholder="Enter a brief description about yourself..."
></textarea>
```

**"Save and Continue" button (lines 44-52):**
- ✅ Updates localStorage
- ✅ Navigates to next page
- ❌ **NO BACKEND CALL**

---

### **❌ NOT SAVING: Our Values (Step 6 of 7)**
**Route:** `/non-profit/create-account/values`  
**Component:** `pairova-frontend/src/components/nonProfile/onboarding/ourValues.tsx`

#### **Data Collected (NOT SENT TO BACKEND):**
- ❌ Our Values (max 150 words)

#### **Problem:**
**Identical issue to Mission Statement:**
- Uncontrolled textarea (no state management)
- No backend call on save
- Data lost when navigating away

---

### **❓ UNKNOWN: Skills (Step 7 of 7)**
**Route:** `/non-profit/create-account/skills`  
**Component:** `pairova-frontend/src/pages/npo/skillsNpo.tsx`

#### **Data Collected:**
- Uses shared component: `pairova-frontend/src/components/jobSeeker/onboarding/skill.tsx`
- Need to investigate this component to understand data collection

#### **Progress Tracking:**
Uses `useEffect` cleanup to mark as complete when navigating away (lines 6-12).

---

## **🔍 Summary**

### **Forms That Save Data ✅**
| Step | Form | Backend API | Status |
|------|------|-------------|--------|
| 1 | Account Info | `PUT /profiles/nonprofit/me` | ✅ Working |
| 4 | Bio | `PUT /profiles/nonprofit/me` | ✅ Working |

### **Forms That DON'T Save Data ❌**
| Step | Form | Problem | Impact |
|------|------|---------|--------|
| 2 | Company Information | No backend call | Data lost on navigation |
| 3 | Address | No backend call | Data lost on navigation |
| 5 | Mission Statement | Uncontrolled textarea + No backend call | Data never captured |
| 6 | Our Values | Uncontrolled textarea + No backend call | Data never captured |
| 7 | Skills | Unknown (uses shared component) | Need to investigate |

---

## **🎯 Why Progress Bar Works But Data Doesn't Persist**

### **Progress Tracking (Works ✅)**
```typescript
// Every form does this:
localStorage.setItem('npo_companyInfo', 'completed');
window.dispatchEvent(new Event('npoProgressUpdate'));
```

The progress bar (in `index.tsx`) calculates completion based on localStorage flags:
```typescript
const sections = [
  'npo_accountInfo',     // ✅ Set
  'npo_companyInfo',     // ✅ Set
  'npo_address',         // ✅ Set
  'npo_bio',             // ✅ Set
  'npo_mission',         // ✅ Set
  'npo_values',          // ✅ Set
  'npo_skills'           // ✅ Set
];

const completedSections = sections.filter(section => 
  localStorage.getItem(section) === 'completed'
).length;

const progressPercentage = Math.round((completedSections / sections.length) * 100);
```

**Result:** Progress bar shows 100% even if no data was saved to backend!

### **Data Persistence (Broken ❌)**
- Only **Account Info** and **Bio** actually call `NonprofitService.updateProfileStep()`
- All other forms just set localStorage flags and navigate
- When you go back, React state is reset to empty initial values
- No data is fetched from backend because **nothing was saved**

---

## **🛠️ What Needs To Be Fixed**

### **1. Company Information**
```typescript
// Add this handler:
const handleSubmit = async () => {
  try {
    setLoading(true);
    await NonprofitService.updateProfileStep({
      phone: formData.phone,
      foundedOn: formData.foundedOn,
      orgType: formData.orgType,
      industry: formData.industry,
      sizeLabel: formData.sizeLabel,
      website: formData.website,
      registrationNumber: formData.registrationNumber,
    });
    
    localStorage.setItem('npo_companyInfo', 'completed');
    window.dispatchEvent(new Event('npoProgressUpdate'));
    navigate('/non-profit/create-account/address');
  } catch (err) {
    setError("Failed to save");
  } finally {
    setLoading(false);
  }
};
```

### **2. Address**
```typescript
// Update handleSubmit to call backend:
await NonprofitService.updateProfileStep({
  country: formData.country,
  state: formData.state,
  city: formData.city,
  addressLine1: formData.addressLine1,
  addressLine2: formData.addressLine2,
  postalCode: formData.postalCode,
});
```

### **3. Mission Statement & Our Values**
```typescript
// Add state management:
const [missionStatement, setMissionStatement] = useState("");

// Make textarea controlled:
<textarea
  value={missionStatement}
  onChange={(e) => setMissionStatement(e.target.value)}
  ...
/>

// Add backend call:
await NonprofitService.updateProfileStep({
  missionStatement: missionStatement.trim(),
});
```

### **4. Skills**
Need to investigate the shared component and ensure it calls the nonprofit backend, not the job seeker backend.

---

## **✅ Next Steps**

1. ✅ Fix Company Information form to save to backend
2. ✅ Fix Address form to save to backend
3. ✅ Fix Mission Statement form to save to backend
4. ✅ Fix Our Values form to save to backend
5. ❓ Investigate and fix Skills form
6. ✅ Verify backend DTO supports all fields
7. ✅ Add data loading on form mount for all forms
8. ✅ Test full onboarding flow end-to-end

---

**Created:** October 28, 2025  
**Status:** Analysis Complete - Ready for Implementation

