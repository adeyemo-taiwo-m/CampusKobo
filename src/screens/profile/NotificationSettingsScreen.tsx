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
import { Toast, ToastType } from '../../components/Toast';
import { TimePickerModal } from '../../components/TimePickerModal';

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
  const { notificationPrefs, saveNotificationPrefs, prefsLoading, t } = useAppContext();
  
  // Local state for toggles (Step 11)
  const [allNotifications, setAllNotifications] = useState(notificationPrefs?.all_notifications ?? true);
  const [budgetAlerts, setBudgetAlerts] = useState(notificationPrefs?.budget_alerts ?? true);
  const [savingsReminders, setSavingsReminders] = useState(notificationPrefs?.savings_reminders ?? true);
  const [billReminders, setBillReminders] = useState(notificationPrefs?.bill_reminders ?? true);
  const [newContent, setNewContent] = useState(notificationPrefs?.new_content ?? true);
  const [finance101, setFinance101] = useState(notificationPrefs?.finance_101 ?? true);
  const [podcastUpdates, setPodcastUpdates] = useState(notificationPrefs?.podcast_updates ?? false);
  const [appUpdates, setAppUpdates] = useState(notificationPrefs?.app_updates ?? true);
  const [bofAnnouncements, setBofAnnouncements] = useState(notificationPrefs?.bof_announcements ?? true);
  const [doNotDisturb, setDoNotDisturb] = useState(notificationPrefs?.do_not_disturb ?? false);
  
  // Time states
  const [quietHoursStart, setQuietHoursStart] = useState(notificationPrefs?.quiet_hours_start || '22:00:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState(notificationPrefs?.quiet_hours_end || '07:00:00');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Sync from context when notificationPrefs loads
  useEffect(() => {
    if (notificationPrefs) {
      setAllNotifications(notificationPrefs.all_notifications ?? true);
      setBudgetAlerts(notificationPrefs.budget_alerts ?? true);
      setSavingsReminders(notificationPrefs.savings_reminders ?? true);
      setBillReminders(notificationPrefs.bill_reminders ?? true);
      setNewContent(notificationPrefs.new_content ?? true);
      setFinance101(notificationPrefs.finance_101 ?? true);
      setPodcastUpdates(notificationPrefs.podcast_updates ?? false);
      setAppUpdates(notificationPrefs.app_updates ?? true);
      setBofAnnouncements(notificationPrefs.bof_announcements ?? true);
      setDoNotDisturb(notificationPrefs.do_not_disturb ?? false);
      if (notificationPrefs.quiet_hours_start) setQuietHoursStart(notificationPrefs.quiet_hours_start);
      if (notificationPrefs.quiet_hours_end) setQuietHoursEnd(notificationPrefs.quiet_hours_end);
    }
  }, [notificationPrefs]);

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '10:00 PM';
    const [hour] = timeStr.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const getHourFromStr = (timeStr: string) => {
    if (!timeStr) return 7;
    return parseInt(timeStr.split(':')[0], 10);
  };

  const handleTimeSelect = (hour: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00:00`;
    setQuietHoursEnd(timeStr);
    saveNotificationPrefs({ quiet_hours_end: timeStr });
    showToast(`Quiet hours end at ${formatTimeDisplay(timeStr)}`, "success");
  };

  const isGlobalDisabled = !allNotifications;

  if (prefsLoading && Object.keys(notificationPrefs).length === 0) {
    return (
      <View style={styles.container}>
        <Header title={t('notifications.title')} showBack={true} onBack={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={PRIMARY_GREEN} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={t('notifications.title')} showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>{t('notifications.desc')}</Text>

        {/* Master Toggle */}
        <View style={styles.card}>
          <NotificationRow
            icon="notifications-outline"
            title={t('notifications.all')}
            description={t('notifications.allDesc')}
            value={allNotifications}
            onValueChange={(v) => {
              setAllNotifications(v);
              if (!v) {
                // When turning off all notifications, turn off all sub-toggles too
                setBudgetAlerts(false);
                setSavingsReminders(false);
                setBillReminders(false);
                setNewContent(false);
                setFinance101(false);
                setPodcastUpdates(false);
                setAppUpdates(false);
                setBofAnnouncements(false);
                
                saveNotificationPrefs({
                  all_notifications: false,
                  budget_alerts: false,
                  savings_reminders: false,
                  bill_reminders: false,
                  new_content: false,
                  finance_101: false,
                  podcast_updates: false,
                  app_updates: false,
                  bof_announcements: false,
                });
                showToast(t('notifications.toastMuted'), "info");
              } else {
                saveNotificationPrefs({ all_notifications: true });
                showToast(t('notifications.toastUnmuted'), "success");
              }
            }}
            isLast={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('notifications.moneyAlerts')}</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="wallet-outline"
              title={t('notifications.budget')}
              description={t('notifications.budgetDesc')}
              value={budgetAlerts}
              onValueChange={(v) => {
                setBudgetAlerts(v);
                saveNotificationPrefs({ budget_alerts: v });
                showToast(`${t('notifications.budget')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="leaf-outline"
              title={t('notifications.savings')}
              description={t('notifications.savingsDesc')}
              value={savingsReminders}
              onValueChange={(v) => {
                setSavingsReminders(v);
                saveNotificationPrefs({ savings_reminders: v });
                showToast(`${t('notifications.savings')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="receipt-outline"
              title={t('notifications.bill')}
              description={t('notifications.billDesc')}
              value={billReminders}
              onValueChange={(v) => {
                setBillReminders(v);
                saveNotificationPrefs({ bill_reminders: v });
                showToast(`${t('notifications.bill')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('notifications.learning')}</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="book-outline"
              title={t('notifications.newContent')}
              description={t('notifications.newContentDesc')}
              value={newContent}
              onValueChange={(v) => {
                setNewContent(v);
                saveNotificationPrefs({ new_content: v });
                showToast(`${t('notifications.newContent')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="school-outline"
              title={t('notifications.finance101')}
              description={t('notifications.finance101Desc')}
              value={finance101}
              onValueChange={(v) => {
                setFinance101(v);
                saveNotificationPrefs({ finance_101: v });
                showToast(`${t('notifications.finance101')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="headset-outline"
              title={t('notifications.podcast')}
              description={t('notifications.podcastDesc')}
              value={podcastUpdates}
              onValueChange={(v) => {
                setPodcastUpdates(v);
                saveNotificationPrefs({ podcast_updates: v });
                showToast(`${t('notifications.podcast')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('notifications.general')}</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="refresh-outline"
              title={t('notifications.appUpdates')}
              description={t('notifications.appUpdatesDesc')}
              value={appUpdates}
              onValueChange={(v) => {
                setAppUpdates(v);
                saveNotificationPrefs({ app_updates: v });
                showToast(`${t('notifications.appUpdates')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
            />
            <NotificationRow
              icon="megaphone-outline"
              title={t('notifications.bof')}
              description={t('notifications.bofDesc')}
              value={bofAnnouncements}
              onValueChange={(v) => {
                setBofAnnouncements(v);
                saveNotificationPrefs({ bof_announcements: v });
                showToast(`${t('notifications.bof')} ${v ? t('notifications.enabled') : t('notifications.disabled')}`, v ? "success" : "info");
              }}
              disabled={isGlobalDisabled}
              isLast={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('notifications.quiet')}</Text>
          <View style={styles.card}>
            <NotificationRow
              icon="moon-outline"
              title={t('notifications.dnd')}
              description={t('notifications.dndDesc')}
              value={doNotDisturb}
              onValueChange={(v) => {
                setDoNotDisturb(v);
                
                let updates: any = { do_not_disturb: v };
                
                if (v) {
                  // When turning ON, set start hour to current hour
                  const currentHour = new Date().getHours();
                  const startTimeStr = `${currentHour.toString().padStart(2, '0')}:00:00`;
                  setQuietHoursStart(startTimeStr);
                  updates.quiet_hours_start = startTimeStr;
                  showToast(`${t('notifications.dnd')} ${t('notifications.on')} at ${formatTimeDisplay(startTimeStr)}`, "success");
                } else {
                  showToast(`${t('notifications.dnd')} ${t('notifications.off')}`, "info");
                }
                
                saveNotificationPrefs(updates);
              }}
              disabled={isGlobalDisabled}
              isLast={!doNotDisturb}
            />
            {doNotDisturb && (
              <View style={styles.timePickerRow}>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>{t('notifications.startsAt')}</Text>
                  <View style={[styles.timeBox, { opacity: 0.7 }]}>
                    <Text style={styles.timeText}>{formatTimeDisplay(quietHoursStart)}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.timeField}
                  onPress={() => setIsTimePickerVisible(true)}
                >
                  <Text style={styles.timeLabel}>{t('notifications.endsAt')}</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>{formatTimeDisplay(quietHoursEnd)}</Text>
                    <Ionicons name="chevron-down" size={14} color={TEXT_SECONDARY} style={{ marginLeft: 4 }} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Toast 
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      <TimePickerModal
        isVisible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onSelect={handleTimeSelect}
        selectedHour={getHourFromStr(quietHoursEnd)}
        title="Quiet Hours End Time"
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  }
});
