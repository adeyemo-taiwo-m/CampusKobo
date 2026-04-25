import { Stack } from 'expo-router';

// UPDATE 2026-04-25: Added savings sub-layout to suppress the auto-generated
// native header bar that would appear above custom screens in the savings route group.
export default function SavingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
