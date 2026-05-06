import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
} from '../../constants';
import { Header } from '../../components/Header';
import { useAppContext } from '../../context/AppContext';
import { StorageService } from '../../storage/StorageService';
import { userService } from '../../services/userService';

const CustomToggle = ({ value, onValueChange, disabled = false }: { value: boolean, onValueChange: (v: boolean) => void, disabled?: boolean }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange(!value)}
      style={[
        styles.toggleContainer,
        value ? styles.toggleOn : styles.toggleOff,
        { justifyContent: value ? 'flex-end' : 'flex-start' },
        disabled && styles.toggleDisabled
      ]}
    >
      <View style={styles.toggleCircle} />
    </TouchableOpacity>
  );
};

const SecurityRow = ({ 
  icon, 
  title, 
  description, 
  type = 'toggle',
  value, 
  onValueChange, 
  onPress,
  isLast = false,
  isDestructive = false
}: { 
  icon: string, 
  title: string, 
  description: string, 
  type?: 'toggle' | 'arrow',
  value?: boolean, 
  onValueChange?: (v: boolean) => void,
  onPress?: () => void,
  isLast?: boolean,
  isDestructive?: boolean
}) => (
  <TouchableOpacity 
    activeOpacity={type === 'arrow' ? 0.7 : 1}
    onPress={type === 'arrow' ? onPress : undefined}
    style={[styles.row, isLast && styles.noBorder]}
  >
    <View style={styles.iconWrapper}>
      <Ionicons name={icon as any} size={20} color={PRIMARY_GREEN} />
    </View>
    <View style={styles.rowContent}>
      <Text style={[styles.rowTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
    {type === 'toggle' ? (
      <CustomToggle value={value || false} onValueChange={onValueChange || (() => {})} />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    )}
  </TouchableOpacity>
);

export const SecurityPrivacyScreen = () => {
  const router = useRouter();
  const { isBalanceHidden, toggleBalanceVisibility, user, logout } = useAppContext();
  
  const [appLock, setAppLock] = useState(false);
  const [biometricUnlock, setBiometricUnlock] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [fingerprintLogin, setFingerprintLogin] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState(true);

  // Persistence Logic
  useEffect(() => {
    const loadPrefs = async () => {
      const saved = await StorageService.getSecurityPreferences();
      if (saved) {
        if (saved.appLock !== undefined) setAppLock(saved.appLock);
        if (saved.biometricUnlock !== undefined) setBiometricUnlock(saved.biometricUnlock);
        if (saved.pinLock !== undefined) setPinLock(saved.pinLock);
        if (saved.fingerprintLogin !== undefined) setFingerprintLogin(saved.fingerprintLogin);
        if (saved.faceId !== undefined) setFaceId(saved.faceId);
        if (saved.dataAnalytics !== undefined) setDataAnalytics(saved.dataAnalytics);
      }
    };
    loadPrefs();
  }, []);

  const savePrefs = async (overrides: Record<string, boolean> = {}) => {
    await StorageService.saveSecurityPreferences({
      appLock,
      biometricUnlock,
      pinLock,
      fingerprintLogin,
      faceId,
      dataAnalytics,
      ...overrides,
    });
  };

  const syncSecurityToServer = async (overrides: Record<string, boolean> = {}) => {
    try {
      await userService.updateBiometricSettings({
        biometric_enabled: overrides.biometricUnlock ?? biometricUnlock,
        app_lock_enabled: overrides.appLock ?? appLock,
        pin_lock_enabled: overrides.pinLock ?? pinLock,
      });
    } catch (e) {
      console.warn('Could not sync security settings to server', e);
    }
  };

  const syncPrivacyToServer = async (overrides: Record<string, boolean> = {}) => {
    try {
      await userService.updatePrivacySettings({
        hide_balance: overrides.hideBalance ?? isBalanceHidden,
        data_analytics: overrides.dataAnalytics ?? dataAnalytics,
      });
    } catch (e) {
      console.warn('Could not sync privacy settings to server', e);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              await logout();
              router.replace('/(onboarding)/welcome-1');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Security & Privacy" showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>Keep your account safe and secure</Text>

        {/* App Lock Section */}
        <View style={styles.card}>
          <SecurityRow
            icon="lock-closed-outline"
            title="App Lock"
            description="Require authentication to open CampusKobo"
            value={appLock}
            onValueChange={(v) => { 
              setAppLock(v); 
              savePrefs({ appLock: v }); 
              syncSecurityToServer({ appLock: v });
            }}
            isLast={!appLock}
          />
          {appLock && (
            <>
              <SecurityRow
                icon="finger-print-outline"
                title="Face ID / Fingerprint"
                description="Use biometric to unlock the app"
                value={biometricUnlock}
                onValueChange={(v) => { 
                  setBiometricUnlock(v); 
                  savePrefs({ biometricUnlock: v }); 
                  syncSecurityToServer({ biometricUnlock: v });
                }}
              />
              <SecurityRow
                icon="grid-outline"
                title="PIN Lock"
                description="Use a 4-digit PIN to unlock the app"
                value={pinLock}
                onValueChange={(v) => { 
                  setPinLock(v); 
                  savePrefs({ pinLock: v }); 
                  syncSecurityToServer({ pinLock: v });
                }}
                isLast={true}
              />
            </>
          )}
        </View>

        {/* PIN Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PIN</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="key-outline"
              title="Set PIN"
              description={user?.hasPIN ? "PIN is set — tap to change" : "Create a 4-digit PIN for app lock"}
              type="arrow"
              onPress={() => router.push('/profile/set-pin')}
            />
            <SecurityRow
              icon="create-outline"
              title="Change PIN"
              description="Update your current PIN"
              type="arrow"
              onPress={() => router.push('/profile/set-pin')}
              isLast={true}
            />
          </View>
        </View>

        {/* Biometric Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Biometric</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="finger-print-outline"
              title="Fingerprint Login"
              description="Use fingerprint to access your account"
              value={fingerprintLogin}
              onValueChange={(v) => { 
                setFingerprintLogin(v); 
                savePrefs({ fingerprintLogin: v }); 
                // Biometric login often maps to the same setting on backend
                syncSecurityToServer({ biometricUnlock: v });
              }}
            />
            <SecurityRow
              icon="scan-outline"
              title="Face ID"
              description="Use Face ID to access your account"
              value={faceId}
              onValueChange={(v) => { 
                setFaceId(v); 
                savePrefs({ faceId: v }); 
                syncSecurityToServer({ biometricUnlock: v });
              }}
              isLast={true}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Privacy</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="eye-off-outline"
              title="Hide Balance"
              description="Mask your account balance on the dashboard"
              value={isBalanceHidden}
              onValueChange={(v) => {
                toggleBalanceVisibility();
                syncPrivacyToServer({ hideBalance: v });
              }}
            />
            <SecurityRow
              icon="stats-chart-outline"
              title="Data & Analytics"
              description="Help improve CampusKobo with usage data"
              value={dataAnalytics}
              onValueChange={(v) => { 
                setDataAnalytics(v); 
                savePrefs({ dataAnalytics: v }); 
                syncPrivacyToServer({ dataAnalytics: v });
              }}
              isLast={true}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="key-outline"
              title="Change Password"
              description="Update your account password"
              type="arrow"
              onPress={() => router.push('/profile/change-password')}
            />
            <SecurityRow
              icon="mail-outline"
              title="Change Email"
              description="Update your email address"
              type="arrow"
              onPress={() => router.push('/profile/change-email')}
            />
            <SecurityRow
              icon="trash-outline"
              title="Delete Account"
              description="Permanently delete your account"
              type="arrow"
              isDestructive={true}
              onPress={handleDeleteAccount}
              isLast={true}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    marginBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: Fonts.medium,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  rowDescription: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  // Custom Toggle Styles
  toggleContainer: {
    width: 50,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: PRIMARY_GREEN,
  },
  toggleOff: {
    backgroundColor: '#9CA3AF',
  },
  toggleDisabled: {
    opacity: 0.4,
  },
  toggleText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: WHITE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
