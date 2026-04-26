import { Stack } from 'expo-router';

export default function LearningLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="podcast" />
      <Stack.Screen name="finance101" />
      <Stack.Screen name="glossary" />
    </Stack>
  );
}
