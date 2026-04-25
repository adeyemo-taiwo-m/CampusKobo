import { Stack } from 'expo-router';

// UPDATE 2026-04-25: Added budget sub-layout to suppress the auto-generated
// native header bar that was appearing above the custom green hero header
// in BudgetDetailScreen and CreateBudgetScreen.
export default function BudgetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
