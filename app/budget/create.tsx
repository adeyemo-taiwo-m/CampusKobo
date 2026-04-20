import { Stack } from 'expo-router';
import { CreateBudgetScreen } from '../../src/screens/budget/CreateBudgetScreen';

export default function CreateBudget() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CreateBudgetScreen />
    </>
  );
}
