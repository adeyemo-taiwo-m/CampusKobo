import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { useAppContext } from '../../context/AppContext';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';

export const PINSuccessScreen = () => {
  const router = useRouter();
  const { t, updateUser } = useAppContext();
  const { pin } = useLocalSearchParams<{ pin: string }>();
  
  const handleDone = async () => {
    if (!pin) {
      router.replace("/profile/security");
      return;
    }

    // 1. Save PIN to local user context (keep existing behaviour)
    await updateUser({ hasPIN: true, pin });

    // 2. Sync to server in the background — do NOT block navigation on failure
    try {
      await authService.createPin({ pin });
    } catch (error) {
      // Log silently — PIN is saved locally, app lock still works
      console.warn("PIN sync to server failed:", error);
    }

    // 3. Navigate back to security settings
    router.replace("/profile/security");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.centerSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={60} color={WHITE} />
          </View>
          
          <Text style={styles.title}>{t('security.pinSuccess')}</Text>
          <Text style={styles.subtitle}>{t('security.pinSuccessDesc')}</Text>
          
          <Text style={styles.note}>
            {t('security.passwordDesc')}
          </Text>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>{t('common.done') || 'Done'}</Text>
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
