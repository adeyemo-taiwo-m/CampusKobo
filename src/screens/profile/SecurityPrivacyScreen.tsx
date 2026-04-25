import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { useAppContext } from '../../context/AppContext';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
} from '../../constants';

export const SecurityPrivacyScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearAllData } = useAppContext();

  const [appLock, setAppLock] = useState(false);
  const [useBiometric, setUseBiometric] = useState(true);
  const [usePin, setUsePin] = useState(false);
  const [fingerprintLogin, setFingerprintLogin] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [dataAnalytics, setDataAnalytics] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const SecurityRow = ({ 
    label, 
    description, 
    value, 
    onValueChange, 
    isLast = false,
    disabled = false
  }: { 
    label: string; 
    description?: string; 
    value: boolean; 
    onValueChange: (v: boolean) => void;
    isLast?: boolean;
    disabled?: boolean;
  }) => (
    <View style={[styles.row, isLast && { borderBottomWidth: 0 }, disabled && { opacity: 0.5 }]}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && <Text style={styles.rowDesc}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
        thumbColor={Platform.OS === 'ios' ? undefined : WHITE}
      />
    </View>
  );

  const NavRow = ({ 
    label, 
    description, 
    onPress, 
    isLast = false,
    destructive = false
  }: { 
    label: string; 
    description?: string; 
    onPress: () => void;
    isLast?: boolean;
    destructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.row, isLast && { borderBottomWidth: 0 }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowInfo}>
        <Text style={[styles.rowLabel, destructive && { color: '#EF4444' }]}>{label}</Text>
        {description && <Text style={styles.rowDesc}>{description}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={destructive ? '#FEE2E2' : "#9CA3AF"} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.topDesc}>Keep your account safe and secure</Text>

        {/* App Lock Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App Lock</Text>
          <View style={styles.rowsContainer}>
            <SecurityRow 
              label="App Lock" 
              description="Require authentication to open CampusKobo" 
              value={appLock}
              onValueChange={setAppLock}
              isLast={!appLock}
            />
            {appLock && (
              <>
                <SecurityRow 
                  label="Face ID / Fingerprint" 
                  description="Use biometric to unlock the app" 
                  value={useBiometric}
                  onValueChange={setUseBiometric}
                />
                <SecurityRow 
                  label="PIN Lock" 
                  description="Use PIN to unlock the app" 
                  value={usePin}
                  onValueChange={setUsePin}
                  isLast
                />
              </>
            )}
          </View>
        </View>

        {/* PIN Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PIN</Text>
          <View style={styles.rowsContainer}>
            <NavRow 
              label="Set PIN" 
              description="Create a 4-digit PIN for app lock" 
              onPress={() => router.push({ pathname: '/profile/set-pin', params: { mode: 'set' } })}
            />
            <NavRow 
              label="Change PIN" 
              description="Update your current PIN" 
              onPress={() => router.push({ pathname: '/profile/set-pin', params: { mode: 'change' } })}
              isLast
            />
          </View>
        </View>

        {/* Biometric Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Biometric</Text>
          <View style={styles.rowsContainer}>
            <SecurityRow 
              label="Fingerprint Login" 
              description="Use fingerprint to access your account" 
              value={fingerprintLogin}
              onValueChange={setFingerprintLogin}
            />
            <SecurityRow 
              label="Face ID" 
              description="Use Face ID to access your account" 
              value={faceId}
              onValueChange={setFaceId}
              isLast
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Privacy</Text>
          <View style={styles.rowsContainer}>
            <SecurityRow 
              label="Hide Balance" 
              description="Mask your balance on the home screen" 
              value={hideBalance}
              onValueChange={setHideBalance}
            />
            <SecurityRow 
              label="Data & Analytics" 
              description="Help improve CampusKobo with usage data" 
              value={dataAnalytics}
              onValueChange={setDataAnalytics}
              isLast
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.rowsContainer}>
            <NavRow 
              label="Change Password" 
              description="Update your account password" 
              onPress={() => Alert.alert('Coming Soon', 'Password update feature is in development.')}
            />
            <NavRow 
              label="Change Email" 
              description="Update your email address" 
              onPress={() => Alert.alert('Coming Soon', 'Email update feature is in development.')}
            />
            <NavRow 
              label="Delete Account" 
              description="Permanently delete your account" 
              onPress={() => setShowDeleteModal(true)}
              destructive
              isLast
            />
          </View>
        </View>
      </ScrollView>

      <DeleteConfirmModal
        visible={showDeleteModal}
        title="Delete Account?"
        message="This will permanently delete all your data. This action cannot be undone."
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          await clearAllData();
          setShowDeleteModal(false);
          router.replace('/onboarding/welcome-1');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topDesc: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingLeft: 4,
  },
  rowsContainer: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  rowInfo: {
    flex: 1,
    paddingRight: 10,
  },
  rowLabel: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  rowDesc: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
    lineHeight: 16,
  },
});
