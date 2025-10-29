import { Progress } from "@/components/ui/progress";
import { Outlet, Link, useLocation } from "react-router";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useEffect } from "react";
import { Icon } from "@iconify/react";

const Index = () => {
  const { steps, getProgress, setCurrentStep } = useOnboardingStore();
  const location = useLocation();
  const progress = getProgress();

  // Update current step based on route
  useEffect(() => {
    const path = location.pathname.split('/').pop() || '';
    const currentStep = steps.find(step => step.path === path);
    if (currentStep) {
      setCurrentStep(currentStep.id);
    }
  }, [location.pathname, steps, setCurrentStep]);

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

              {steps.map((step) => (
                <Link key={step.id} to={step.path}>
                  <div className="border-b border-black/30 p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <p className={step.completed ? "text-green-600" : ""}>{step.name}</p>
                    {step.completed && (
                      <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                    )}
                  </div>
                </Link>
              ))}
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
