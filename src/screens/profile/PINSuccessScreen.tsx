import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';

export const PINSuccessScreen = () => {
  const router = useRouter();
  const { pin } = useLocalSearchParams<{ pin: string }>();
  
  const handleDone = async () => {
    // 1. Save to API (Background sync)
    if (pin) {
      try {
        await authService.createPin({ pin });
      } catch (error) {
        console.warn('Failed to sync PIN with server, but saved locally:', error);
      }
    }
    
    // 2. Navigate back
    router.replace('/profile/security');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.centerSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={60} color={WHITE} />
          </View>
          
          <Text style={styles.title}>PIN Created!</Text>
          <Text style={styles.subtitle}>Your account is now protected with a 4-digit PIN</Text>
          
          <Text style={styles.note}>
            You can change your PIN anytime in Security & Privacy settings
          </Text>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981', // SUCCESS_GREEN
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  note: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  doneButton: {
    width: '100%',
    height: 56,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
});
