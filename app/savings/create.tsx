import { Stack } from 'expo-router';
import { CreateSavingsGoalScreen } from '../../src/screens/savings/CreateSavingsGoalScreen';

export default function CreateSavings() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CreateSavingsGoalScreen />
    </>
  );
}
