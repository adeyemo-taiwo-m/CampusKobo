import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
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
import { StorageService } from '../../storage/StorageService';
import { useAppContext } from '../../context/AppContext';

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
  const { notificationPrefs, saveNotificationPrefs, prefsLoading } = useAppContext();
  
  const handleToggle = (key: string, value: boolean) => {
    saveNotificationPrefs({ [key]: value });
  };

  const allNotifications = notificationPrefs.allNotifications;
  const isGlobalDisabled = !allNotifications;

  if (prefsLoading && Object.keys(notificationPrefs).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Notifications" showBack={true} onBack={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={PRIMARY_GREEN} size="large" />
        </View>
      </SafeAreaView>
    );
  }

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
            value={notificationPrefs.allNotifications}
            onValueChange={(v) => handleToggle('allNotifications', v)}
            isLast={true}
          />
        </View>

        {/* Money Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Money Alerts</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="wallet-outline"
              title="Budget Alerts"
              description="When you're close to your spending limit"
              value={notificationPrefs.budgetAlerts}
              onValueChange={(v) => handleToggle('budgetAlerts', v)}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="leaf-outline"
              title="Savings Reminders"
              description="When to add funds to your goals"
              value={notificationPrefs.savingsReminders}
              onValueChange={(v) => handleToggle('savingsReminders', v)}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="receipt-outline"
              title="Bill Reminders"
              description="Recurring expense due date alerts"
              value={notificationPrefs.billReminders}
              onValueChange={(v) => handleToggle('billReminders', v)}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        {/* Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Learning</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="book-outline"
              title="New Content"
              description="When new articles and videos are added"
              value={notificationPrefs.newContent}
              onValueChange={(v) => handleToggle('newContent', v)}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="school-outline"
              title="Finance 101"
              description="New episode available alerts"
              value={notificationPrefs.finance101}
              onValueChange={(v) => handleToggle('finance101', v)}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="headset-outline"
              title="Podcast Updates"
              description="New Market Pulse episode alerts"
              value={notificationPrefs.podcastUpdates}
              onValueChange={(v) => handleToggle('podcastUpdates', v)}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>General</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="refresh-outline"
              title="App Updates"
              description="Latest features and improvements"
              value={notificationPrefs.appUpdates}
              onValueChange={(v) => handleToggle('appUpdates', v)}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="megaphone-outline"
              title="BOF OAU Announcements"
              description="News from Bureau of Finance OAU"
              value={notificationPrefs.bofAnnouncements}
              onValueChange={(v) => handleToggle('bofAnnouncements', v)}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        {/* Quiet Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quiet Hours</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="moon-outline"
              title="Do Not Disturb"
              description="Mute all notifications during set hours"
              value={notificationPrefs.doNotDisturb}
              onValueChange={(v) => handleToggle('doNotDisturb', v)}
              disabled={isGlobalDisabled}
              isLast={!notificationPrefs.doNotDisturb}
            />
            {notificationPrefs.doNotDisturb && (
              <View style={styles.timePickerRow}>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>From:</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>10:00 PM</Text>
                  </View>
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>To:</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>07:00 AM</Text>
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
    // Vertical centering is handled by alignItems: 'center' 
    // but we ensure no hidden margins exist
  },
  toggleOn: {
    backgroundColor: PRIMARY_GREEN,
  },
  toggleOff: {
    backgroundColor: '#E5E7EB', // Lighter gray for off state
  },
  toggleDisabled: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6', // Very light gray when locked
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: WHITE,
    // Ensure shadow doesn't create optical offset
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Quiet Hours
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  timeField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    marginRight: 8,
  },
  timeBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  }
});
