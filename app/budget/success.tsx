import { Stack } from 'expo-router';
import { BudgetCreatedSuccessScreen } from '../../src/screens/budget/BudgetCreatedSuccessScreen';

export default function BudgetSuccess() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BudgetCreatedSuccessScreen />
    </>
  );
}
