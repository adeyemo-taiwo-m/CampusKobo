import { Stack } from 'expo-router';
import TransactionDetailScreen from '../../src/screens/expenses/TransactionDetailScreen';

export default function TransactionDetail() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TransactionDetailScreen />
    </>
  );
}
