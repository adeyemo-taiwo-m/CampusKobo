import { Stack } from 'expo-router';
import AddTransactionScreen from '../src/screens/expenses/AddTransactionScreen';

export default function AddTransaction() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddTransactionScreen />
    </>
  );
}
