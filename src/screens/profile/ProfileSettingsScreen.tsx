import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { useAppContext } from '../../context/AppContext';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  Colors,
} from '../../constants';

export const ProfileSettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, clearAllData } = useAppContext();
  
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            // In a real app, clear tokens/session
            // For prototype, we can just navigate to welcome
            router.replace('/onboarding/welcome-1');
          }
        }
      ]
    );
  };

  const SettingRow = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    showArrow = true,
    destructive = false 
  }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    label: string; 
    value?: string; 
    onPress?: () => void;
    showArrow?: boolean;
    destructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIconBox, destructive && styles.destructiveIconBox]}>
        <Ionicons name={icon} size={20} color={destructive ? '#EF4444' : PRIMARY_GREEN} />
      </View>
      <Text style={[styles.settingLabel, destructive && styles.destructiveLabel]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
      </View>
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
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => setIsEditSheetVisible(true)}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Preferences</Text>
          <View style={styles.rowsContainer}>
            <SettingRow 
              icon="cash-outline" 
              label="Currency" 
              value="₦ Nigerian Naira" 
              onPress={() => Alert.alert('Currency', 'Multi-currency support coming soon!')}
            />
            <SettingRow 
              icon="language-outline" 
              label="Language" 
              value="English" 
            />
            <SettingRow 
              icon="notifications-outline" 
              label="Notifications" 
              onPress={() => router.push('/profile/notifications')}
            />
          </View>
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Security & Privacy</Text>
          <View style={styles.rowsContainer}>
            <SettingRow 
              icon="shield-checkmark-outline" 
              label="Security & Privacy" 
              onPress={() => router.push('/profile/security')}
            />
          </View>
        </View>

        {/* Support & Help */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Support & Help</Text>
          <View style={styles.rowsContainer}>
            <SettingRow 
              icon="help-circle-outline" 
              label="Help & FAQ" 
              onPress={() => router.push('/profile/help')}
            />
            <SettingRow 
              icon="mail-outline" 
              label="Contact Support" 
              onPress={() => Alert.alert('Support', 'Email us at support@campuskobo.com')}
            />
          </View>
        </View>

        {/* About & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About & Legal</Text>
          <View style={styles.rowsContainer}>
            <SettingRow 
              icon="information-circle-outline" 
              label="About CampusKobo" 
              onPress={() => Alert.alert('About CampusKobo', 'CampusKobo is your all-in-one financial companion for student life.')}
            />
            <SettingRow 
              icon="business-outline" 
              label="About BOF OAU" 
              onPress={() => Alert.alert('About BOF OAU', 'The Bureau of Finance (BOF) at OAU provides financial literacy and empowerment for students.')}
            />
            <SettingRow 
              icon="code-working-outline" 
              label="Version" 
              value="1.0.0" 
              showArrow={false}
            />
          </View>
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerNote}>Made with ❤️ for OAU Students</Text>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <Modal
        isVisible={isEditSheetVisible}
        onBackdropPress={() => setIsEditSheetVisible(false)}
        onSwipeComplete={() => setIsEditSheetVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        avoidKeyboard
      >
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetTitle}>Edit Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={() => {
              // In real app: updateUser(editName, editEmail)
              setIsEditSheetVisible(false);
              Alert.alert('Profile Updated', 'Your changes have been saved.');
            }}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 8,
    borderBottomColor: '#F9FAFB',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarText: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: WHITE,
  },
  userName: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 20,
  },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  editBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  section: {
    marginTop: 24,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary.P100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  logoutBtn: {
    margin: 20,
    marginTop: 40,
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#EF4444',
  },
  footerNote: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
  },
  // Modal Sheet
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheetContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  saveBtn: {
    backgroundColor: PRIMARY_GREEN,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
});
