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
      <Text style={[styles.toggleText, value ? styles.toggleTextOn : styles.toggleTextOff]}>
        {value ? 'ON' : 'OFF'}
      </Text>
      <View style={[styles.toggleCircle, value ? styles.toggleCircleOn : styles.toggleCircleOff]} />
    </TouchableOpacity>
  );
};

const NotificationRow = ({ 
  icon, 
  title, 
  description, 
  value, 
  onValueChange, 
  disabled = false,
  isLast = false
}: { 
  icon: string, 
  title: string, 
  description: string, 
  value: boolean, 
  onValueChange: (v: boolean) => void,
  disabled?: boolean,
  isLast?: boolean
}) => (
  <View style={[styles.row, isLast && styles.noBorder, disabled && { opacity: 0.5 }]}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon as any} size={20} color={PRIMARY_GREEN} />
    </View>
    <View style={styles.rowContent}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
    <CustomToggle value={value} onValueChange={onValueChange} disabled={disabled} />
  </View>
);

export const NotificationSettingsScreen = () => {
  const router = useRouter();
  
  const [allNotifications, setAllNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [savingsReminders, setSavingsReminders] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [newContent, setNewContent] = useState(true);
  const [finance101, setFinance101] = useState(false);
  const [podcastUpdates, setPodcastUpdates] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);
  const [bofAnnouncements, setBofAnnouncements] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const isGlobalDisabled = !allNotifications;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Notifications" showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>Choose what you want to be notified about</Text>

        {/* Master Toggle */}
        <View style={styles.card}>
          <NotificationRow
            icon="notifications-outline"
            title="All Notifications"
            description="Turn off to mute all notifications"
            value={allNotifications}
            onValueChange={setAllNotifications}
            isLast={true}
          />
        </View>

        {/* Money Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Money Alerts</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="wallet-outline"
              title="Budget Alerts"
              description="When you're close to your spending limit"
              value={budgetAlerts}
              onValueChange={setBudgetAlerts}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="leaf-outline"
              title="Savings Reminders"
              description="When to add funds to your goals"
              value={savingsReminders}
              onValueChange={setSavingsReminders}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="receipt-outline"
              title="Bill Reminders"
              description="Recurring expense due date alerts"
              value={billReminders}
              onValueChange={setBillReminders}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        {/* Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="book-outline"
              title="New Content"
              description="When new articles and videos are added"
              value={newContent}
              onValueChange={setNewContent}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="school-outline"
              title="Finance 101"
              description="New episode available alerts"
              value={finance101}
              onValueChange={setFinance101}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="headset-outline"
              title="Podcast Updates"
              description="New Market Pulse episode alerts"
              value={podcastUpdates}
              onValueChange={setPodcastUpdates}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="refresh-outline"
              title="App Updates"
              description="Latest features and improvements"
              value={appUpdates}
              onValueChange={setAppUpdates}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="megaphone-outline"
              title="BOF OAU Announcements"
              description="News from Bureau of Finance OAU"
              value={bofAnnouncements}
              onValueChange={setBofAnnouncements}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        {/* Quiet Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="moon-outline"
              title="Do Not Disturb"
              description="Mute all notifications during set hours"
              value={doNotDisturb}
              onValueChange={setDoNotDisturb}
              disabled={isGlobalDisabled}
              isLast={!doNotDisturb}
            />
            {doNotDisturb && (
              <View style={styles.timePickerContainer}>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>From:</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeValue}>10:00 PM</Text>
                  </View>
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>To:</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeValue}>07:00 AM</Text>
                  </View>
                </View>
              </View>
            )}
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
  sectionTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: Fonts.bold,
    marginBottom: 12,
    textTransform: 'capitalize',
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
    paddingVertical: 16,
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
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  // Custom Toggle Styles
  toggleContainer: {
    width: 60,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 4,
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
    opacity: 0.5,
  },
  toggleText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  toggleTextOn: {
    marginLeft: 4,
  },
  toggleTextOff: {
    marginRight: 4,
    marginLeft: 'auto',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WHITE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleCircleOn: {
    // Circle stays on right
  },
  toggleCircleOff: {
    order: -1, // Moves circle to left
  },
  // Quiet Hours Styles
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  timeField: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    marginRight: 8,
  },
  timeBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeValue: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
});
