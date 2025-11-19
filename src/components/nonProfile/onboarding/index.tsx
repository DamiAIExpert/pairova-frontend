import { Progress } from "@/components/ui/progress";
import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const Index = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  // Calculate progress based on completed sections
  useEffect(() => {
    const calculateProgress = () => {
      const sections = [
        'npo_accountInfo',
        'npo_companyInfo',
        'npo_address',
        'npo_bio',
        'npo_mission',
        'npo_values',
        'npo_skills'
      ];
      
      const completedSections = sections.filter(section => 
        localStorage.getItem(section) === 'completed'
      ).length;
      
      const progressPercentage = Math.round((completedSections / sections.length) * 100);
      setProgress(progressPercentage);
    };

    // Calculate on mount
    calculateProgress();

    // Listen for storage changes (when sections are completed)
    const handleStorageChange = () => {
      calculateProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-window updates
    window.addEventListener('npoProgressUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('npoProgressUpdate', handleStorageChange);
    };
  }, [location.pathname]); // Recalculate when location changes

  // Check if a step is completed
  const isStepCompleted = (stepKey: string) => {
    return localStorage.getItem(stepKey) === 'completed';
  };

  // Check if a step is active
  const isStepActive = (path: string) => {
    if (path === '' && location.pathname === '/non-profit/create-account') {
      return true;
    }
    return location.pathname.includes(path);
  };

  return (
    <div>
      <div>
        <div className="py-5 px-5 bg-white">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />
        </div>

        <div className="bg-[#F1F1F1] px-3 flex gap-5">
          <div className="w-[400px] py-8 hidden md:block">
            <h2 className="text-xl font-semibold">Create Account</h2>

            <div className="bg-white border border-black/30 my-5 rounded-md">
              <div className="border-b border-black/30 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-[500]">Completion</p>
                  </div>

                  <p className="font-[500]">{progress}%</p>
                </div>

                <div className="my-3 border border-[#0E0E0E33] p-3 rounded-[999px]">
                  <Progress value={progress} />
                </div>
              </div>

              <Link to="">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('') ? 'bg-gray-100' : ''
                }`}>
                  <p>Account Info</p>
                  {isStepCompleted('npo_accountInfo') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>

              <Link to="company-info">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('company-info') ? 'bg-gray-100' : ''
                }`}>
                  <p>Company Information</p>
                  {isStepCompleted('npo_companyInfo') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>

              <Link to="address">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('address') ? 'bg-gray-100' : ''
                }`}>
                  <p>Address</p>
                  {isStepCompleted('npo_address') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>

              <Link to="bio">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('bio') ? 'bg-gray-100' : ''
                }`}>
                  <p>Bio</p>
                  {isStepCompleted('npo_bio') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>

              <Link to="mission-statement">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('mission-statement') ? 'bg-gray-100' : ''
                }`}>
                  <p>Mission Statement</p>
                  {isStepCompleted('npo_mission') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>

              <Link to="values">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('values') ? 'bg-gray-100' : ''
                }`}>
                  <p>Our Values</p>
                  {isStepCompleted('npo_values') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>

              <Link to="skills">
                <div className={`border-b border-black/30 p-5 flex items-center justify-between ${
                  isStepActive('skills') ? 'bg-gray-100' : ''
                }`}>
                  <p>Skills</p>
                  {isStepCompleted('npo_skills') && (
                    <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                  )}
                </div>
              </Link>
            </div>
          </div>

          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
