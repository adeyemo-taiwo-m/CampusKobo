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
import { securityService, SecurityPreferences } from '../../services/securityService';
import { Toast } from '../../components/Toast';

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
  const { isBalanceHidden, toggleBalanceVisibility, user, logout, t } = useAppContext();
  
  const [appLock, setAppLock] = useState(false);
  const [biometricUnlock, setBiometricUnlock] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [fingerprintLogin, setFingerprintLogin] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState(true);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persistence Logic
  useEffect(() => {
    const loadPrefs = async () => {
      // 1. Try to load from Supabase
      try {
        const remote = await securityService.getSecurityPreferences();
        if (remote) {
          setAppLock(remote.app_lock_enabled);
          setBiometricUnlock(remote.biometric_enabled);
          setPinLock(remote.pin_lock_enabled);
          setFingerprintLogin(remote.fingerprint_enabled);
          setFaceId(remote.face_id_enabled);
          setDataAnalytics(remote.data_analytics_enabled);
          if (remote.hide_balance !== isBalanceHidden) toggleBalanceVisibility();
          
          // Sync to storage
          await StorageService.saveSecurityPreferences({
            appLock: remote.app_lock_enabled,
            biometricUnlock: remote.biometric_enabled,
            pinLock: remote.pin_lock_enabled,
            fingerprintLogin: remote.fingerprint_enabled,
            faceId: remote.face_id_enabled,
            dataAnalytics: remote.data_analytics_enabled,
          });
          return;
        }
      } catch (e) {
        console.warn("Failed to load security prefs from Supabase:", e);
      }

      // 2. Fallback to local storage
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

  const syncSecurityToSupabase = async (updates: Partial<SecurityPreferences>) => {
    try {
      await securityService.updateSecurityPreferences(updates);
      setToastMessage(t('security.toastSynced'));
      setToastVisible(true);
    } catch (error) {
      console.warn("Could not sync biometric settings to Supabase:", error);
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={t('security.title')} showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>{t('security.desc')}</Text>

        {/* App Lock Section */}
        <View style={styles.card}>
          <SecurityRow
            icon="lock-closed-outline"
            title={t('security.appLock')}
            description={t('security.appLockDesc')}
            value={appLock}
            onValueChange={(v) => { 
              setAppLock(v); 
              savePrefs({ appLock: v }); 
              syncSecurityToSupabase({ app_lock_enabled: v });
            }}
            isLast={!appLock}
          />
          {appLock && (
            <>
              <SecurityRow
                icon="finger-print-outline"
                title={t('security.biometric')}
                description={t('security.biometricDesc')}
                value={biometricUnlock}
                onValueChange={(v) => { 
                  setBiometricUnlock(v); 
                  savePrefs({ biometricUnlock: v }); 
                  syncSecurityToSupabase({ biometric_enabled: v });
                }}
              />
              <SecurityRow
                icon="grid-outline"
                title={t('security.pinLock')}
                description={t('security.pinLockDesc')}
                value={pinLock}
                onValueChange={(v) => { 
                  setPinLock(v); 
                  savePrefs({ pinLock: v }); 
                  syncSecurityToSupabase({ pin_lock_enabled: v });
                }}
                isLast={true}
              />
            </>
          )}
        </View>

        {/* PIN Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('security.pinSection')}</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="key-outline"
              title={t('security.setPin')}
              description={user?.hasPIN ? t('security.changePinDesc') : t('security.setPinDesc')}
              type="arrow"
              onPress={() => router.push('/profile/set-pin')}
            />
            <SecurityRow
              icon="create-outline"
              title={t('security.changePin')}
              description={t('security.changePinDesc')}
              type="arrow"
              onPress={() => router.push('/profile/set-pin')}
              isLast={true}
            />
          </View>
        </View>

        {/* Biometric Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('security.biometricSection')}</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="finger-print-outline"
              title={t('security.fingerprint')}
              description={t('security.fingerprintDesc')}
              value={fingerprintLogin}
              onValueChange={(v) => { 
                setFingerprintLogin(v); 
                savePrefs({ fingerprintLogin: v }); 
                syncSecurityToSupabase({ fingerprint_enabled: v });
              }}
            />
            <SecurityRow
              icon="scan-outline"
              title={t('security.faceId')}
              description={t('security.faceIdDesc')}
              value={faceId}
              onValueChange={(v) => { 
                setFaceId(v); 
                savePrefs({ faceId: v }); 
                syncSecurityToSupabase({ face_id_enabled: v });
              }}
              isLast={true}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('security.privacySection')}</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="eye-off-outline"
              title={t('security.hideBalance')}
              description={t('security.hideBalanceDesc')}
              value={isBalanceHidden}
              onValueChange={(v) => {
                toggleBalanceVisibility();
                syncSecurityToSupabase({ hide_balance: v });
              }}
            />
            <SecurityRow
              icon="stats-chart-outline"
              title={t('security.data')}
              description={t('security.dataDesc')}
              value={dataAnalytics}
              onValueChange={(v) => { 
                setDataAnalytics(v); 
                savePrefs({ dataAnalytics: v }); 
                syncSecurityToSupabase({ data_analytics_enabled: v });
              }}
              isLast={true}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('security.accountSection')}</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="key-outline"
              title={t('security.changePassword')}
              description={t('security.changePasswordDesc')}
              type="arrow"
              onPress={() => router.push('/profile/change-password')}
            />
            <SecurityRow
              icon="mail-outline"
              title={t('security.changeEmail')}
              description={t('security.changeEmailDesc')}
              type="arrow"
              onPress={() => router.push('/profile/change-email')}
            />
            <SecurityRow
              icon="trash-outline"
              title={t('security.deleteAccount')}
              description={t('security.deleteAccountDesc')}
              type="arrow"
              isDestructive={true}
              onPress={handleDeleteAccount}
              isLast={true}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Toast 
        visible={toastVisible}
        message={toastMessage}
        type="success"
        onHide={() => setToastVisible(false)}
      />
    </View>
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
