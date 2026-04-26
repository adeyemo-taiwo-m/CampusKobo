import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="security" />
      <Stack.Screen name="help" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="set-pin" />
      <Stack.Screen name="confirm-pin" />
      <Stack.Screen name="pin-success" />
    </Stack>
  );
}
