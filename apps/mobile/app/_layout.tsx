import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OnboardingProvider, useOnboarding } from '@/components/onboarding-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavigationLayout() {
  const { hasCompletedOnboarding } = useOnboarding();

  // Keep screen blank (or loading) while resolving onboarding state
  if (hasCompletedOnboarding === null) {
    return null;
  }

  return (
    <Stack>
      {/* Onboarding stack is protected: only accessible if onboarding has NOT been completed */}
      <Stack.Protected guard={hasCompletedOnboarding === false}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Main app is protected: only accessible if onboarding HAS been completed */}
      <Stack.Protected guard={hasCompletedOnboarding === true}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <OnboardingProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NavigationLayout />
          <StatusBar style="auto" />
        </ThemeProvider>
      </OnboardingProvider>
    </TamaguiProvider>
  );
}

