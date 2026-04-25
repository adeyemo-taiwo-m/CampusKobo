import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
} from '../../constants';

export const NotificationSettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Toggles State
  const [allNotifications, setAllNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [savingsReminders, setSavingsReminders] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [newContent, setNewContent] = useState(true);
  const [finance101, setFinance101] = useState(false);
  const [podcastUpdates, setPodcastUpdates] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);
  const [bofAnnouncements, setBofAnnouncements] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  const isMuted = !allNotifications;

  const NotificationRow = ({ 
    label, 
    description, 
    value, 
    onValueChange, 
    isLast = false 
  }: { 
    label: string; 
    description: string; 
    value: boolean; 
    onValueChange: (v: boolean) => void;
    isLast?: boolean;
  }) => (
    <View style={[styles.row, isLast && { borderBottomWidth: 0 }, isMuted && styles.mutedRow]}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch
        value={value && allNotifications}
        onValueChange={onValueChange}
        disabled={isMuted}
        trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
        thumbColor={Platform.OS === 'ios' ? undefined : WHITE}
      />
    </View>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.topDesc}>Choose what you want to be notified about</Text>

        {/* Master Toggle */}
        <View style={styles.masterCard}>
          <View style={styles.masterInfo}>
            <Text style={styles.masterLabel}>All Notifications</Text>
            <Text style={styles.masterDesc}>Turn off to mute all notifications</Text>
          </View>
          <Switch
            value={allNotifications}
            onValueChange={setAllNotifications}
            trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
            thumbColor={Platform.OS === 'ios' ? undefined : WHITE}
          />
        </View>

        {/* Money Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Money Alerts</Text>
          <View style={styles.rowsContainer}>
            <NotificationRow 
              label="Budget Alerts" 
              description="When you're close to your spending limit" 
              value={budgetAlerts}
              onValueChange={setBudgetAlerts}
            />
            <NotificationRow 
              label="Savings Reminders" 
              description="When to add funds to your goals" 
              value={savingsReminders}
              onValueChange={setSavingsReminders}
            />
            <NotificationRow 
              label="Bill Reminders" 
              description="Recurring expense due date alerts" 
              value={billReminders}
              onValueChange={setBillReminders}
              isLast
            />
          </View>
        </View>

        {/* Learning */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Learning</Text>
          <View style={styles.rowsContainer}>
            <NotificationRow 
              label="New Content" 
              description="When new articles and videos are added" 
              value={newContent}
              onValueChange={setNewContent}
            />
            <NotificationRow 
              label="Finance 101" 
              description="New episode available alerts" 
              value={finance101}
              onValueChange={setFinance101}
            />
            <NotificationRow 
              label="Podcast Updates" 
              description="New Market Pulse episode alerts" 
              value={podcastUpdates}
              onValueChange={setPodcastUpdates}
              isLast
            />
          </View>
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>General</Text>
          <View style={styles.rowsContainer}>
            <NotificationRow 
              label="App Updates" 
              description="Latest features and improvements" 
              value={appUpdates}
              onValueChange={setAppUpdates}
            />
            <NotificationRow 
              label="BOF OAU Announcements" 
              description="News from Bureau of Finance OAU" 
              value={bofAnnouncements}
              onValueChange={setBofAnnouncements}
              isLast
            />
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quiet Hours</Text>
          <View style={styles.rowsContainer}>
            <View style={[styles.row, { borderBottomWidth: quietHours ? 1 : 0 }, isMuted && styles.mutedRow]}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Do Not Disturb</Text>
                <Text style={styles.rowDesc}>Mute all notifications during set hours</Text>
              </View>
              <Switch
                value={quietHours && allNotifications}
                onValueChange={setQuietHours}
                disabled={isMuted}
                trackColor={{ false: '#D1D5DB', true: PRIMARY_GREEN }}
              />
            </View>
            {quietHours && !isMuted && (
              <View style={styles.timePickersRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>From:</Text>
                  <Text style={styles.timeValue}>10:00 PM</Text>
                </View>
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>To:</Text>
                  <Text style={styles.timeValue}>07:00 AM</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  masterCard: {
    marginHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  masterInfo: {
    flex: 1,
  },
  masterLabel: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  masterDesc: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
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
  mutedRow: {
    opacity: 0.5,
  },
  timePickersRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    backgroundColor: '#F9FAFB',
  },
  timeBox: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeLabel: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  timeValue: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
});
