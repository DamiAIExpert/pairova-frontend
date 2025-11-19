/**
 * Test script to fetch and display user profile data
 * Run this in the browser console while logged in, or use it as a reference
 */

const API_BASE_URL = 'http://localhost:3007';

// Get auth token from localStorage
const token = localStorage.getItem('auth_token');

if (!token) {
  console.error('❌ No auth token found. Please login first.');
} else {
  console.log('✅ Auth token found');
  
  // Fetch all profile data
  async function fetchProfileData() {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      console.log('\n🔄 Fetching profile data...\n');

      // Fetch all data in parallel
      const [profileRes, educationRes, experienceRes, certificationRes] = await Promise.all([
        fetch(`${API_BASE_URL}/profiles/applicant/me`, { headers }),
        fetch(`${API_BASE_URL}/profiles/education`, { headers }),
        fetch(`${API_BASE_URL}/profiles/experience`, { headers }),
        fetch(`${API_BASE_URL}/profiles/certifications`, { headers })
      ]);

      // Parse responses
      const profileData = await profileRes.json();
      const educationData = await educationRes.json();
      const experienceData = await experienceRes.json();
      const certificationData = await certificationRes.json();

      // Extract actual data (backend wraps in { data: ... })
      const profile = profileData.data || profileData;
      const educations = (educationData.data || educationData) || [];
      const experiences = (experienceData.data || experienceData) || [];
      const certifications = (certificationData.data || certificationData) || [];

      // Display formatted results
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📋 PROFILE DATA SUMMARY');
      console.log('═══════════════════════════════════════════════════════════\n');

      // Account Section
      console.log('📌 ACCOUNT INFORMATION:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`Work Position: ${profile.workPosition || 'Not set'}`);
      console.log(`Country: ${profile.country || 'Not set'}`);
      console.log(`Photo URL: ${profile.photoUrl || 'Not set'}`);
      console.log('');

      // Personal Information
      console.log('👤 PERSONAL INFORMATION:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`First Name: ${profile.firstName || 'Not set'}`);
      console.log(`Last Name: ${profile.lastName || 'Not set'}`);
      console.log(`Email: ${profile.email || 'Not set'}`);
      console.log(`Phone: ${profile.phone || 'Not set'}`);
      console.log(`Date of Birth: ${profile.dob || 'Not set'}`);
      console.log(`Gender: ${profile.gender || 'Not set'}`);
      console.log('');

      // Address
      console.log('📍 ADDRESS:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`City: ${profile.city || 'Not set'}`);
      console.log(`State: ${profile.state || 'Not set'}`);
      console.log(`Postal Code: ${profile.postalCode || 'Not set'}`);
      console.log(`Country: ${profile.country || 'Not set'}`);
      console.log('');

      // Bio
      console.log('📝 BIO:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`${profile.bio || 'Not set'}`);
      console.log(`Word Count: ${(profile.bio || '').trim().split(/\s+/).filter(w => w.length > 0).length}`);
      console.log('');

      // Skills
      console.log('💼 SKILLS:');
      console.log('───────────────────────────────────────────────────────────');
      if (profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0) {
        console.log(`Total Skills: ${profile.skills.length}`);
        profile.skills.forEach((skill, index) => {
          console.log(`  ${index + 1}. ${skill}`);
        });
      } else {
        console.log('No skills found');
      }
      console.log('');

      // Education
      console.log('🎓 EDUCATION ENTRIES:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`Total: ${educations.length} entries\n`);
      
      if (educations.length > 0) {
        educations.forEach((edu, index) => {
          console.log(`Education Entry ${index + 1}:`);
          console.log(`  ID: ${edu.id}`);
          console.log(`  School: ${edu.school || 'Not set'}`);
          console.log(`  Degree: ${edu.degree || 'Not set'}`);
          console.log(`  Course (fieldOfStudy): ${edu.fieldOfStudy || edu.field_of_study || 'Not set'}`);
          console.log(`  Grade: ${edu.grade || 'Not set'}`);
          console.log(`  Role: ${edu.role || 'Not set'}`);
          console.log(`  Description: ${edu.description || 'Not set'}`);
          console.log(`  Start Date: ${edu.startDate || 'Not set'}`);
          console.log(`  End Date: ${edu.endDate || 'Not set'}`);
          console.log('');
        });
      } else {
        console.log('No education entries found');
        console.log('');
      }

      // Experience
      console.log('💼 EXPERIENCE ENTRIES:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`Total: ${experiences.length} entries\n`);
      
      if (experiences.length > 0) {
        experiences.forEach((exp, index) => {
          console.log(`Experience Entry ${index + 1}:`);
          console.log(`  ID: ${exp.id}`);
          console.log(`  Employment Type: ${exp.employmentType || 'Not set'}`);
          console.log(`  Company: ${exp.company || 'Not set'}`);
          console.log(`  Job Role (roleTitle): ${exp.roleTitle || 'Not set'}`);
          console.log(`  Start Date: ${exp.startDate || 'Not set'}`);
          console.log(`  End Date: ${exp.endDate || 'Currently Working'}`);
          console.log(`  Location City: ${exp.locationCity || 'Not set'}`);
          console.log(`  Location State: ${exp.locationState || 'Not set'}`);
          console.log(`  Location Country: ${exp.locationCountry || 'Not set'}`);
          console.log(`  Postal Code: ${exp.postal_code || 'Not set'}`);
          console.log(`  Description: ${exp.description || 'Not set'}`);
          console.log('');
        });
      } else {
        console.log('No experience entries found');
        console.log('');
      }

      // Certifications
      console.log('🏆 CERTIFICATION ENTRIES:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`Total: ${certifications.length} entries\n`);
      
      if (certifications.length > 0) {
        certifications.forEach((cert, index) => {
          console.log(`Certificate ${index + 1}:`);
          console.log(`  ID: ${cert.id}`);
          console.log(`  Name: ${cert.name || 'Not set'}`);
          console.log(`  Issuer: ${cert.issuer || 'Not set'}`);
          console.log(`  Issue Date: ${cert.issueDate || cert.issuedDate || 'Not set'}`);
          console.log(`  Credential ID: ${cert.credentialId || 'Not set'}`);
          console.log(`  Credential URL: ${cert.credentialUrl || 'Not set'}`);
          console.log('');
        });
      } else {
        console.log('No certification entries found');
        console.log('');
      }

      // Raw JSON output for inspection
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📦 RAW JSON DATA (for inspection)');
      console.log('═══════════════════════════════════════════════════════════\n');
      console.log('Profile:', JSON.stringify(profile, null, 2));
      console.log('\nEducations:', JSON.stringify(educations, null, 2));
      console.log('\nExperiences:', JSON.stringify(experiences, null, 2));
      console.log('\nCertifications:', JSON.stringify(certifications, null, 2));

      // Comparison with expected data
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('🔍 DATA VALIDATION');
      console.log('═══════════════════════════════════════════════════════════\n');

      // Check for duplicates
      const educationSchools = educations.map(e => e.school).filter(Boolean);
      const uniqueEducationSchools = [...new Set(educationSchools)];
      if (educationSchools.length !== uniqueEducationSchools.length) {
        console.log('⚠️  WARNING: Duplicate education entries detected!');
        console.log(`   Found ${educationSchools.length} entries, but only ${uniqueEducationSchools.length} unique schools`);
      }

      const experienceCompanies = experiences.map(e => e.company).filter(Boolean);
      const uniqueExperienceCompanies = [...new Set(experienceCompanies)];
      if (experienceCompanies.length !== uniqueExperienceCompanies.length) {
        console.log('⚠️  WARNING: Duplicate experience entries detected!');
        console.log(`   Found ${experienceCompanies.length} entries, but only ${uniqueExperienceCompanies.length} unique companies`);
      }

      // Expected counts from user's form
      console.log('\nExpected vs Actual:');
      console.log(`  Education entries: Expected 8, Found ${educations.length}`);
      console.log(`  Experience entries: Expected 7, Found ${experiences.length}`);
      console.log(`  Certification entries: Expected 1, Found ${certifications.length}`);

      return {
        profile,
        educations,
        experiences,
        certifications
      };

    } catch (error) {
      console.error('❌ Error fetching profile data:', error);
      throw error;
    }
  }

  // Run the test
  fetchProfileData()
    .then(data => {
      console.log('\n✅ Profile data fetched successfully!');
      console.log('Data is available in the returned object above.');
    })
    .catch(error => {
      console.error('❌ Failed to fetch profile data:', error);
    });
}







