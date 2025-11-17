/**
 * Quick test script - Copy and paste this into browser console
 * Make sure you're logged in as damitobex7@gmail.com
 */

(async function() {
  const API_BASE_URL = 'http://localhost:3007';
  const token = localStorage.getItem('auth_token');

  if (!token) {
    console.error('❌ No auth token found. Please login first.');
    return;
  }

  console.log('✅ Auth token found');
  console.log('🔄 Fetching profile data for: damitobex7@gmail.com\n');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const [profileRes, educationRes, experienceRes, certificationRes] = await Promise.all([
      fetch(`${API_BASE_URL}/profiles/applicant/me`, { headers }),
      fetch(`${API_BASE_URL}/profiles/education`, { headers }),
      fetch(`${API_BASE_URL}/profiles/experience`, { headers }),
      fetch(`${API_BASE_URL}/profiles/certifications`, { headers })
    ]);

    const profileData = await profileRes.json();
    const educationData = await educationRes.json();
    const experienceData = await experienceRes.json();
    const certificationData = await certificationRes.json();

    const profile = profileData.data || profileData;
    const educations = Array.isArray(educationData.data) ? educationData.data : (Array.isArray(educationData) ? educationData : []);
    const experiences = Array.isArray(experienceData.data) ? experienceData.data : (Array.isArray(experienceData) ? experienceData : []);
    const certifications = Array.isArray(certificationData.data) ? certificationData.data : (Array.isArray(certificationData) ? certificationData : []);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 PROFILE DATA FOR: ' + (profile.email || profile.firstName + ' ' + profile.lastName));
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📊 SUMMARY:');
    console.log(`  Education Entries: ${educations.length} (Expected: 8)`);
    console.log(`  Experience Entries: ${experiences.length} (Expected: 7)`);
    console.log(`  Certification Entries: ${certifications.length} (Expected: 1)\n`);

    // Check for duplicates
    const eduSchools = educations.map(e => e.school).filter(Boolean);
    const uniqueEdu = [...new Set(eduSchools)];
    if (eduSchools.length !== uniqueEdu.length) {
      console.log('⚠️  DUPLICATE EDUCATION ENTRIES DETECTED!');
      console.log(`   Found ${eduSchools.length} entries, but only ${uniqueEdu.length} unique schools\n`);
    }

    const expCompanies = experiences.map(e => e.company).filter(Boolean);
    const uniqueExp = [...new Set(expCompanies)];
    if (expCompanies.length !== uniqueExp.length) {
      console.log('⚠️  DUPLICATE EXPERIENCE ENTRIES DETECTED!');
      console.log(`   Found ${expCompanies.length} entries, but only ${uniqueExp.length} unique companies\n`);
    }

    console.log('🎓 EDUCATION ENTRIES:');
    educations.forEach((edu, i) => {
      console.log(`  ${i+1}. ${edu.school || 'N/A'} - ${edu.degree || 'N/A'} (ID: ${edu.id})`);
    });

    console.log('\n💼 EXPERIENCE ENTRIES:');
    experiences.forEach((exp, i) => {
      console.log(`  ${i+1}. ${exp.company || 'N/A'} - ${exp.roleTitle || 'N/A'} (ID: ${exp.id})`);
    });

    console.log('\n🏆 CERTIFICATIONS:');
    certifications.forEach((cert, i) => {
      console.log(`  ${i+1}. ${cert.name || 'N/A'} - ${cert.issuer || 'N/A'} (ID: ${cert.id})`);
    });

    console.log('\n📦 FULL DATA:');
    console.log({ profile, educations, experiences, certifications });

    return { profile, educations, experiences, certifications };
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();

