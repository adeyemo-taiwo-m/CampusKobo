import React from 'react';
import { useRouter } from 'expo-router';
import { SuccessScreen } from '../../components/SuccessScreen';

export const BudgetCreatedSuccessScreen = () => {
  const router = useRouter();

  return (
    <SuccessScreen 
      title="Budget Created!"
      subtitle="Your budget is now active. We will alert you when you are nearing your limit."
      onDone={() => router.push('/(tabs)/budget')}
    />
  );
};

export default BudgetCreatedSuccessScreen;
