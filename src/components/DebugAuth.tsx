import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';

export const DebugAuth = () => {
  const { isAuthenticated, authLoading, apiUser, networkError } = useAppContext();

  if (!__DEV__) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Auth: {authLoading ? 'Loading...' : isAuthenticated ? '✅ Authenticated' : '❌ Guest'}
        {networkError && ' | ⚠️ Network Error'}
      </Text>
      {apiUser && <Text style={styles.subText}>User: {apiUser.full_name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subText: {
    color: '#ddd',
    fontSize: 10,
  },
});
