import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
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
import { useAppContext } from '../../context/AppContext';
import { InputField } from '../../components/InputField';
import { OfflineBanner } from '../../components/OfflineBanner';
import { userService } from '../../services/userService';

const { height } = Dimensions.get('window');

const SettingsRow = ({ 
  icon, 
  title, 
  value, 
  onPress, 
  showArrow = true, 
  isLast = false,
  subtitle
}: { 
  icon: string, 
  title: string, 
  value?: string, 
  onPress?: () => void, 
  showArrow?: boolean,
  isLast?: boolean,
  subtitle?: string
}) => (
  <TouchableOpacity 
    style={[styles.row, isLast && styles.noBorder]} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconWrapper}>
      <Ionicons name={icon as any} size={20} color={PRIMARY_GREEN} />
    </View>
    <View style={styles.rowMain}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
    </View>
    {value && <Text style={styles.rowValue}>{value}</Text>}
    {showArrow && <Ionicons name="arrow-forward" size={18} color="#9CA3AF" />}
  </TouchableOpacity>
);

export const ProfileSettingsScreen = () => {
  const router = useRouter();
  const { 
    logoutFromApi, 
    user, 
    updateUser, 
    isLoading: contextLoading,
    apiUser,
    setApiUser
  } = useAppContext();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const initialName = apiUser?.full_name || user?.name || 'User';
  const initialEmail = apiUser?.email || user?.email || '';
  const initialPhone = user?.phone || '+234 7012345678';

  const [userName, setUserName] = useState(initialName);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [userPhone, setUserPhone] = useState(initialPhone);

  React.useEffect(() => {
    setUserName(apiUser?.full_name || user?.name || 'User');
    setUserEmail(apiUser?.email || user?.email || '');
    setUserPhone(user?.phone || '+234 7012345678');
  }, [user, apiUser]);

  if (contextLoading) return null;

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
        try {
          await logoutFromApi();
          // The navigator will handle the redirect automatically based on isAuthenticated
        } catch (error) {
          console.error('Logout error:', error);
          Alert.alert('Error', 'Failed to log out properly. Please try again.');
        }
      }
    }
      ]
    );
  };

  const handleEditProfile = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      // 1. Update on API
      const updatedApiUser = await userService.updateProfile({ full_name: userName });
      
      // 2. Update context states
      setApiUser(updatedApiUser);
      await updateUser({ name: userName, phone: userPhone });
      
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('Update Failed', error.message || 'Could not update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <OfflineBanner />
      <Header 
        title="Profile & Settings" 
        showBack={true} 
        onBack={() => router.back()} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {apiUser?.avatar_url ? (
            <Image 
              source={{ uri: apiUser.avatar_url }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[styles.avatar, styles.initialsAvatar]}>
              <Text style={styles.avatarInitials}>
                {userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Preferences</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="cash-outline"
              title="Currency"
              value="₦ Nigerian Naira"
              onPress={() => {
                Alert.alert('Currency', 'Choose your preferred currency', [
                  { text: '₦ Nigerian Naira', onPress: () => {} },
                  { text: '$ US Dollar', onPress: () => {} },
                  { text: 'Cancel', style: 'cancel' }
                ]);
              }}
            />
            <SettingsRow
              icon="globe-outline"
              title="Language"
              value="English"
              onPress={() => {}}
            />
            <SettingsRow
              icon="notifications-outline"
              title="Notifications"
              onPress={() => router.push('/profile/notifications')}
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              title="Security & Privacy"
              subtitle="App lock, PIN, Biometric"
              onPress={() => router.push('/profile/security')}
              isLast={true}
            />
          </View>
        </View>

        {/* Support & Help */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Support & Help</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="help-circle-outline"
              title="Help & FAQ"
              onPress={() => router.push('/profile/help')}
            />
            <SettingsRow
              icon="call-outline"
              title="Contact Support"
              onPress={() => router.push('/profile/help?tab=contact')}
              isLast={true}
            />
          </View>
        </View>

        {/* About & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About & Legal</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="information-circle-outline"
              title="About CampusKobo"
              onPress={() => Alert.alert('About', 'CampusKobo is your companion for financial literacy and student money management.')}
            />
            <SettingsRow
              icon="business-outline"
              title="About BOF OAU"
              onPress={() => Alert.alert('BOF OAU', 'The Bureau of Finance, OAU is dedicated to financial excellence among students.')}
              isLast={true}
            />
          </View>
        </View>

        <Text style={styles.versionText}>Version 1.0</Text>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Log out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetContainer}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.modalBackBtn}
                    onPress={() => setIsEditModalVisible(false)}
                  >
                    <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitleText}>Edit Profile</Text>
                  <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                  {/* Modal Avatar */}
                  <View style={styles.modalAvatarContainer}>
                    <View style={styles.modalAvatarWrapper}>
                      {apiUser?.avatar_url ? (
                        <Image 
                          source={{ uri: apiUser.avatar_url }} 
                          style={styles.modalAvatar} 
                        />
                      ) : (
                        <View style={[styles.modalAvatar, styles.initialsAvatarModal]}>
                          <Text style={styles.avatarInitialsModal}>
                            {userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity style={styles.avatarEditBadge}>
                        <Ionicons name="image-outline" size={16} color={WHITE} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <InputField
                    label="Name"
                    placeholder="Enter your name"
                    value={userName}
                    onChangeText={setUserName}
                  />

                  <InputField
                    label="Email address"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChangeText={() => {}}
                    editable={false}
                    state="disabled"
                  />

                  <InputField
                    label="Phone number (Optional)"
                    placeholder="+234 0000000000"
                    value={userPhone}
                    onChangeText={setUserPhone}
                    keyboardType="phone-pad"
                  />
                </ScrollView>

                <TouchableOpacity 
                  style={[styles.saveBtn, isUpdating && styles.disabledBtn]}
                  onPress={handleEditProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator color={WHITE} size="small" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  profileCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 2,
    borderColor: PRIMARY_GREEN,
  },
  initialsAvatar: {
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    marginBottom: 12,
  },
  editBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editBtnText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: Fonts.bold,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowMain: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  rowSubtitle: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  rowValue: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
    marginRight: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts.regular,
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    height: '90%', // Almost full height
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  modalBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalAvatarWrapper: {
    position: 'relative',
  },
  modalAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: PRIMARY_GREEN,
  },
  initialsAvatarModal: {
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsModal: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_GREEN,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
  },
  saveBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.bold,
  }
});
