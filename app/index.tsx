import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../src/context/AppContext';

export default function Index() {
  const { isAuthenticated, authLoading, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/splash');
      }
    }
  }, [isAuthenticated, authLoading, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#3CB96A" />
    </View>
  );
}
