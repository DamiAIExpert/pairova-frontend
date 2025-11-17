/**
 * Node.js script to fetch and display user profile data
 * Usage: node test-profile-data-node.js <auth_token>
 * Or set TOKEN environment variable: TOKEN=your_token node test-profile-data-node.js
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3007';

// Get token from command line argument or environment variable
const token = process.argv[2] || process.env.TOKEN;

if (!token) {
  console.error('❌ Error: Auth token is required!');
  console.log('\nUsage:');
  console.log('  node test-profile-data-node.js <auth_token>');
  console.log('  OR');
  console.log('  TOKEN=your_token node test-profile-data-node.js');
  console.log('\nTo get your token:');
  console.log('  1. Open browser DevTools (F12)');
  console.log('  2. Go to Application/Storage tab');
  console.log('  3. Check localStorage for "auth_token"');
  process.exit(1);
}

async function fetchProfileData() {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('\n🔄 Fetching profile data from:', API_BASE_URL);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Fetch all data in parallel
    const [profileRes, educationRes, experienceRes, certificationRes] = await Promise.all([
      fetch(`${API_BASE_URL}/profiles/applicant/me`, { headers }),
      fetch(`${API_BASE_URL}/profiles/education`, { headers }),
      fetch(`${API_BASE_URL}/profiles/experience`, { headers }),
      fetch(`${API_BASE_URL}/profiles/certifications`, { headers })
    ]);

    // Check for errors
    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      throw new Error(`Profile request failed: ${profileRes.status} ${profileRes.statusText}\n${errorText}`);
    }
    if (!educationRes.ok) {
      const errorText = await educationRes.text();
      throw new Error(`Education request failed: ${educationRes.status} ${educationRes.statusText}\n${errorText}`);
    }
    if (!experienceRes.ok) {
      const errorText = await experienceRes.text();
      throw new Error(`Experience request failed: ${experienceRes.status} ${experienceRes.statusText}\n${errorText}`);
    }
    if (!certificationRes.ok) {
      const errorText = await certificationRes.text();
      throw new Error(`Certification request failed: ${certificationRes.status} ${certificationRes.statusText}\n${errorText}`);
    }

    // Parse responses
    const profileData = await profileRes.json();
    const educationData = await educationRes.json();
    const experienceData = await experienceRes.json();
    const certificationData = await certificationRes.json();

    // Extract actual data (backend wraps in { data: ... })
    const profile = profileData.data || profileData;
    const educations = Array.isArray(educationData.data) ? educationData.data : (Array.isArray(educationData) ? educationData : []);
    const experiences = Array.isArray(experienceData.data) ? experienceData.data : (Array.isArray(experienceData) ? experienceData : []);
    const certifications = Array.isArray(certificationData.data) ? certificationData.data : (Array.isArray(certificationData) ? certificationData : []);

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
    const wordCount = (profile.bio || '').trim().split(/\s+/).filter(w => w.length > 0).length;
    console.log(`Word Count: ${wordCount}`);
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

    // Validation
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 DATA VALIDATION');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Check for duplicates
    const educationSchools = educations.map(e => e.school).filter(Boolean);
    const uniqueEducationSchools = [...new Set(educationSchools)];
    if (educationSchools.length !== uniqueEducationSchools.length) {
      console.log('⚠️  WARNING: Duplicate education entries detected!');
      console.log(`   Found ${educationSchools.length} entries, but only ${uniqueEducationSchools.length} unique schools`);
      console.log(`   Duplicate schools: ${educationSchools.filter((school, index) => educationSchools.indexOf(school) !== index).join(', ')}`);
    } else {
      console.log('✅ No duplicate education entries detected');
    }

    const experienceCompanies = experiences.map(e => e.company).filter(Boolean);
    const uniqueExperienceCompanies = [...new Set(experienceCompanies)];
    if (experienceCompanies.length !== uniqueExperienceCompanies.length) {
      console.log('⚠️  WARNING: Duplicate experience entries detected!');
      console.log(`   Found ${experienceCompanies.length} entries, but only ${uniqueExperienceCompanies.length} unique companies`);
      console.log(`   Duplicate companies: ${experienceCompanies.filter((company, index) => experienceCompanies.indexOf(company) !== index).join(', ')}`);
    } else {
      console.log('✅ No duplicate experience entries detected');
    }

    // Expected counts from user's form
    console.log('\nExpected vs Actual:');
    console.log(`  Education entries: Expected 8, Found ${educations.length} ${educations.length === 8 ? '✅' : '❌'}`);
    console.log(`  Experience entries: Expected 7, Found ${experiences.length} ${experiences.length === 7 ? '✅' : '❌'}`);
    console.log(`  Certification entries: Expected 1, Found ${certifications.length} ${certifications.length === 1 ? '✅' : '❌'}`);

    // Raw JSON output
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📦 RAW JSON DATA');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(JSON.stringify({ profile, educations, experiences, certifications }, null, 2));

    return {
      profile,
      educations,
      experiences,
      certifications
    };

  } catch (error) {
    console.error('❌ Error fetching profile data:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
fetchProfileData()
  .then(data => {
    console.log('\n✅ Profile data fetched successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to fetch profile data:', error);
    process.exit(1);
  });


