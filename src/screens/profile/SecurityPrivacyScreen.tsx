import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Security & Privacy" showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

        {/* Biometrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BIOMETRICS</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="finger-print-outline"
              title="Fingerprint / Face ID"
              description="Use biometrics to unlock the app"
              onPress={() => {}}
              isLast={true}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRIVACY</Text>
          <View style={styles.card}>
            <SecurityRow
              icon="eye-off-outline"
              title="Hide Balance"
              description="Hide your balance on the home screen"
              onPress={() => {}}
            />
            <SecurityRow
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              description="Read our privacy practices"
              onPress={() => {}}
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
