import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="welcome1" />
      <Stack.Screen name="welcome2" />
      <Stack.Screen name="welcome3" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="goal-selection" />
      <Stack.Screen name="set-budget" />
      <Stack.Screen name="quick-setup" />
      <Stack.Screen name="first-expense" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
