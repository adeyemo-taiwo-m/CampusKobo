import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';

export const SecurityPrivacyScreen = () => {
  const router = useRouter();
  const [appLock, setAppLock] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Security & Privacy" showBack={true} onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageDescription}>Keep your account safe and secure</Text>

        <Text style={styles.sectionTitle}>App Lock</Text>
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.textCol}>
              <Text style={styles.toggleLabel}>App Lock</Text>
              <Text style={styles.toggleDescription}>Require authentication to open CampusKobo</Text>
            </View>
            <Switch 
              value={appLock} 
              onValueChange={setAppLock}
              trackColor={{ false: '#E5E7EB', true: PRIMARY_GREEN }}
            />
          </View>

          {appLock && (
            <View style={styles.subRows}>
              <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                <View style={styles.textCol}>
                  <Text style={styles.toggleLabel}>Face ID / Fingerprint</Text>
                  <Text style={styles.toggleDescription}>Use biometric to unlock the app</Text>
                </View>
                <Switch 
                  value={biometric} 
                  onValueChange={setBiometric}
                  trackColor={{ false: '#E5E7EB', true: PRIMARY_GREEN }}
                />
              </View>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>PIN</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionRow} onPress={() => router.push("/profile/set-pin")}>
            <Text style={styles.actionLabel}>Set PIN</Text>
            <Ionicons name="chevron-forward" size={18} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.textCol}>
              <Text style={styles.toggleLabel}>Hide Balance</Text>
              <Text style={styles.toggleDescription}>Mask your balance on the home screen</Text>
            </View>
            <Switch 
              value={hideBalance} 
              onValueChange={setHideBalance}
              trackColor={{ false: '#E5E7EB', true: PRIMARY_GREEN }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
  },
  pageDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 24,
  },
  section: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subRows: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  textCol: {
    flex: 1,
    paddingRight: 16,
  },
  toggleLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  toggleDescription: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  actionLabel: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  deleteBtn: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  deleteText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#EF4444',
  },
});

export default SecurityPrivacyScreen;
