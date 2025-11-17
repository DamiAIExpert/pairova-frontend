import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingStep {
  id: string;
  name: string;
  path: string;
  completed: boolean;
}

interface OnboardingState {
  steps: OnboardingStep[];
  currentStep: string;
  setStepCompleted: (stepId: string) => void;
  setCurrentStep: (stepId: string) => void;
  getProgress: () => number;
  resetProgress: () => void;
  hydrateSteps: (completedMap: Record<string, boolean>) => void;
}

const initialSteps: OnboardingStep[] = [
  { id: 'account-info', name: 'Account Info', path: '', completed: false },
  { id: 'personal-information', name: 'Personal Information', path: 'personal-information', completed: false },
  { id: 'address', name: 'Address', path: 'address', completed: false },
  { id: 'bio', name: 'Bio', path: 'bio', completed: false },
  { id: 'education', name: 'Education', path: 'education', completed: false },
  { id: 'experience', name: 'Experience', path: 'experience', completed: false },
  { id: 'skill', name: 'Skills', path: 'skill', completed: false },
  { id: 'certificates', name: 'Certificates', path: 'certificates', completed: false },
  { id: 'other-attachments', name: 'Other Attachments', path: 'other-attachments', completed: false },
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      steps: initialSteps,
      currentStep: 'account-info',

      setStepCompleted: (stepId: string) => {
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          ),
        }));
      },

      setCurrentStep: (stepId: string) => {
        set({ currentStep: stepId });
      },

      getProgress: () => {
        const { steps } = get();
        const completedSteps = steps.filter((step) => step.completed).length;
        return Math.round((completedSteps / steps.length) * 100);
      },

      resetProgress: () => {
        set({ steps: initialSteps, currentStep: 'account-info' });
      },

      hydrateSteps: (completedMap: Record<string, boolean>) => {
        set((state) => ({
          steps: state.steps.map((step) => ({
            ...step,
            completed: completedMap[step.id] ?? step.completed,
          })),
        }));
      },
    }),
    {
      name: 'onboarding-progress',
    }
  )
);



