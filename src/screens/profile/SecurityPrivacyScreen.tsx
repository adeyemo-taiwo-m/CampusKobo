import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
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

const CustomToggle = ({ value, onValueChange, disabled = false }: { value: boolean, onValueChange: (v: boolean) => void, disabled?: boolean }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange(!value)}
      style={[
        styles.toggleContainer,
        value ? styles.toggleOn : styles.toggleOff,
        disabled && styles.toggleDisabled
      ]}
    >
      {value ? (
        <>
          <Text style={styles.toggleText}>ON</Text>
          <View style={styles.toggleCircle} />
        </>
      ) : (
        <>
          <View style={styles.toggleCircle} />
          <Text style={styles.toggleText}>OFF</Text>
        </>
      )}
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
  const { isBalanceHidden, toggleBalanceVisibility } = useAppContext();
  
  const [appLock, setAppLock] = useState(false);
  const [biometricUnlock, setBiometricUnlock] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [fingerprintLogin, setFingerprintLogin] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // clearAllData();
            router.replace('/(onboarding)/welcome-1');
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
            onValueChange={setAppLock}
            isLast={!appLock}
          />
          {appLock && (
            <>
              <SecurityRow
                icon="finger-print-outline"
                title="Face ID / Fingerprint"
                description="Use biometric to unlock the app"
                value={biometricUnlock}
                onValueChange={setBiometricUnlock}
              />
              <SecurityRow
                icon="grid-outline"
                title="PIN Lock"
                description="Use a 4-digit PIN to unlock the app"
                value={pinLock}
                onValueChange={setPinLock}
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
              description="Create a 4-digit PIN for app lock"
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
              onValueChange={setFingerprintLogin}
            />
            <SecurityRow
              icon="scan-outline"
              title="Face ID"
              description="Use Face ID to access your account"
              value={faceId}
              onValueChange={setFaceId}
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
              onValueChange={toggleBalanceVisibility}
            />
            <SecurityRow
              icon="stats-chart-outline"
              title="Data & Analytics"
              description="Help improve CampusKobo with usage data"
              value={dataAnalytics}
              onValueChange={setDataAnalytics}
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
    fontFamily: Fonts.bold,
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
    width: 60,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
