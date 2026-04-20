import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingRow = ({ icon, label, value, onPress, showArrow = true }: SettingRowProps) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <View style={styles.rowLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={TEXT_PRIMARY} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showArrow && <Ionicons name="chevron-forward" size={18} color={TEXT_SECONDARY} />}
    </View>
  </TouchableOpacity>
);

export const ProfileSettingsScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => router.replace("/") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile & Settings" showBack={true} onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarInitials}>TA</Text>
          </View>
          <Text style={styles.userName}>Taiwo Adeyemo</Text>
          <Text style={styles.userEmail}>taiwo.adeyemo@student.oau.edu</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionsContainer}>
          {/* Account Preferences */}
          <Text style={styles.sectionTitle}>Account Preferences</Text>
          <View style={styles.sectionBody}>
            <SettingRow 
              icon="cash-outline" 
              label="Currency" 
              value="₦ Nigerian Naira" 
              onPress={() => {}} 
            />
            <SettingRow 
              icon="language-outline" 
              label="Language" 
              value="English" 
              onPress={() => {}} 
            />
            <SettingRow 
              icon="notifications-outline" 
              label="Notifications" 
              onPress={() => router.push("/profile/notifications")} 
            />
          </View>

          {/* Security & Privacy */}
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <View style={styles.sectionBody}>
            <SettingRow 
              icon="lock-closed-outline" 
              label="Security & Privacy" 
              onPress={() => router.push("/profile/security")} 
            />
          </View>

          {/* Support & Help */}
          <Text style={styles.sectionTitle}>Support & Help</Text>
          <View style={styles.sectionBody}>
            <SettingRow 
              icon="help-circle-outline" 
              label="Help & FAQ" 
              onPress={() => router.push("/profile/help")} 
            />
            <SettingRow 
              icon="mail-outline" 
              label="Contact Support" 
              onPress={() => Alert.alert("Support", "support@campuskobo.com")} 
            />
          </View>

          {/* About & Legal */}
          <Text style={styles.sectionTitle}>About & Legal</Text>
          <View style={styles.sectionBody}>
            <SettingRow icon="information-circle-outline" label="About CampusKobo" onPress={() => {}} />
            <SettingRow icon="business-outline" label="About BOF OAU" onPress={() => {}} />
            <SettingRow 
              icon="git-branch-outline" 
              label="Version" 
              value="1.0.0" 
              onPress={() => {}} 
              showArrow={false}
            />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: WHITE,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: '#16A34A',
  },
  userName: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 20,
  },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: PRIMARY_GREEN,
  },
  editBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  sectionsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionBody: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  logoutBtn: {
    marginTop: 40,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  logoutText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#EF4444',
  },
});

export default ProfileSettingsScreen;
