import { Tabs } from 'expo-router';
import React from 'react';
import { CustomTabBar } from '../../src/components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="expenses"
        options={{ title: 'Expenses' }}
      />
      <Tabs.Screen
        name="savings"
        options={{ title: 'Savings' }}
      />
      <Tabs.Screen
        name="budget"
        options={{ title: 'Budget' }}
      />
    </Tabs>
  );
}
