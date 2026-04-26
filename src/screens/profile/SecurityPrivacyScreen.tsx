import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
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

const SecurityRow = ({ 
  icon, 
  title, 
  description, 
  onPress,
  isLast = false 
}: { 
  icon: string, 
  title: string, 
  description: string, 
  onPress: () => void,
  isLast?: boolean
}) => (
  <TouchableOpacity 
    style={[styles.row, isLast && styles.noBorder]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconWrapper}>
      <Ionicons name={icon as any} size={22} color={PRIMARY_GREEN} />
    </View>
    <View style={styles.rowContent}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
    <Ionicons name="arrow-forward" size={20} color={TEXT_PRIMARY} />
  </TouchableOpacity>
);

export const SecurityPrivacyScreen = () => {
  const router = useRouter();
  const [appLock, setAppLock] = useState(false);
  const [useBiometric, setUseBiometric] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [fingerprintLogin, setFingerprintLogin] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
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
            // clearAllData() logic
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
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APP LOCK</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Ionicons name="lock-closed-outline" size={22} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>App Lock</Text>
                <Text style={styles.rowDescription}>Require authentication to open CampusKobo</Text>
              </View>
              <Switch 
                value={appLock} 
                onValueChange={setAppLock} 
                trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                thumbColor={WHITE}
              />
            </View>
            
            {appLock && (
              <>
                <View style={styles.row}>
                  <View style={styles.iconWrapper}>
                    <Ionicons name="finger-print-outline" size={22} color={PRIMARY_GREEN} />
                  </View>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>Face ID / Fingerprint</Text>
                    <Text style={styles.rowDescription}>Use biometric to unlock the app</Text>
                  </View>
                  <Switch 
                    value={useBiometric} 
                    onValueChange={setUseBiometric}
                    trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                    thumbColor={WHITE}
                  />
                </View>
                <View style={[styles.row, styles.noBorder]}>
                  <View style={styles.iconWrapper}>
                    <Ionicons name="keypad-outline" size={22} color={PRIMARY_GREEN} />
                  </View>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>PIN Lock</Text>
                    <Text style={styles.rowDescription}>Use PIN to unlock the app</Text>
                  </View>
                  <Switch 
                    value={pinLock} 
                    onValueChange={setPinLock}
                    trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                    thumbColor={WHITE}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* PIN Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PIN</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="key-outline"
              title="Set PIN"
              description="Create a 4-digit PIN for app lock"
              onPress={() => {}}
            />
            <SecurityRow
              icon="create-outline"
              title="Change PIN"
              description="Update your current PIN"
              onPress={() => {}}
              isLast={true}
            />
          </View>
        </View>

        {/* Biometric Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BIOMETRIC</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Ionicons name="finger-print-outline" size={22} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Fingerprint Login</Text>
                <Text style={styles.rowDescription}>Use fingerprint to access your account</Text>
              </View>
              <Switch 
                value={fingerprintLogin} 
                onValueChange={setFingerprintLogin}
                trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                thumbColor={WHITE}
              />
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={styles.iconWrapper}>
                <Ionicons name="scan-outline" size={22} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Face ID</Text>
                <Text style={styles.rowDescription}>Use Face ID to access your account</Text>
              </View>
              <Switch 
                value={faceId} 
                onValueChange={setFaceId}
                trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                thumbColor={WHITE}
              />
            </View>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRIVACY</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Ionicons name="eye-off-outline" size={22} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Hide Balance</Text>
                <Text style={styles.rowDescription}>Mask your balance on the home screen</Text>
              </View>
              <Switch 
                value={hideBalance} 
                onValueChange={setHideBalance}
                trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                thumbColor={WHITE}
              />
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={styles.iconWrapper}>
                <Ionicons name="analytics-outline" size={22} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Data & Analytics</Text>
                <Text style={styles.rowDescription}>Help improve CampusKobo with usage data</Text>
              </View>
              <Switch 
                value={dataAnalytics} 
                onValueChange={setDataAnalytics}
                trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
                thumbColor={WHITE}
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="lock-open-outline"
              title="Change Password"
              description="Update your account password"
              onPress={() => Alert.alert('Coming soon')}
            />
            <SecurityRow
              icon="mail-outline"
              title="Change Email"
              description="Update your email address"
              onPress={() => Alert.alert('Coming soon')}
            />
            <TouchableOpacity 
              style={[styles.row, styles.noBorder]}
              onPress={handleDeleteAccount}
            >
              <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: '#EF4444' }]}>Delete Account</Text>
                <Text style={styles.rowDescription}>Permanently delete your account</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#EF4444" />
            </TouchableOpacity>
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
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: Fonts.bold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    color: '#4B5563',
    marginBottom: 4,
  },
  rowDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: Fonts.regular,
  },
});
