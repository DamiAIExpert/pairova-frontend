import Skill from "@/components/jobSeeker/onboarding/skill"
import { useEffect } from "react";

const SkillsNpo = () => {
  // Mark as completed when navigating away
  useEffect(() => {
    return () => {
      // Mark section as complete when leaving this page
      localStorage.setItem('npo_skills', 'completed');
      window.dispatchEvent(new Event('npoProgressUpdate'));
    };
  }, []);

  return (
    <div>
      <Skill />
    </div>
  )
}

export default SkillsNpo
