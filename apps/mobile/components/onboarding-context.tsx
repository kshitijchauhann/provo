import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

const ONBOARDING_KEY = 'provo_onboarding_completed';

interface OnboardingContextProps {
  hasCompletedOnboarding: boolean | null; // null represents loading state
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        if (Platform.OS === 'web') {
          const value = localStorage.getItem(ONBOARDING_KEY);
          setHasCompletedOnboarding(value === 'true');
        } else {
          // Native fallback: resets on session restart for testing/simplicity
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
        setHasCompletedOnboarding(false);
      }
    };
    loadState();
  }, []);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(ONBOARDING_KEY, 'true');
      } catch (error) {
        console.error('Failed to save onboarding state:', error);
      }
    }
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(ONBOARDING_KEY);
      } catch (error) {
        console.error('Failed to clear onboarding state:', error);
      }
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
