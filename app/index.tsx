import { Redirect } from 'expo-router';
import { useAppContext } from '../src/context/AppContext';

export default function Index() {
  const { user, isLoading } = useAppContext();

  if (isLoading) return null;

  // If user has not completed onboarding, send them to the splash screen
  if (!user || !user.hasCompletedOnboarding) {
    return <Redirect href="/onboarding/splash" />;
  }

  // Otherwise, send them to the main dashboard
  return <Redirect href="/(tabs)" />;
}
