import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
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
import { useAppContext } from '../../context/AppContext';
import { InputField } from '../../components/InputField';
import { OfflineBanner } from '../../components/OfflineBanner';
import { userService } from '../../services/userService';
import * as ImagePicker from 'expo-image-picker';

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
    logout, 
    user, 
    updateUser, 
    isLoading: contextLoading,
    apiUser,
    setApiUser,
    logoutFromApi,
    currency,
    setCurrency,
    language,
    setLanguage
  } = useAppContext();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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


  const handleSaveProfile = async (newName: string) => {
    setSaveError(null);
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({ full_name: newName });
      // Update API user in context
      setApiUser(updated);
      // Also update local user name for consistency
      await updateUser({ name: updated.full_name });
      // Close the edit modal
      setIsEditModalVisible(false);
    } catch (error: any) {
      setSaveError(
        error.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const imageUri = result.assets[0].uri;
    setIsUploadingAvatar(true);
    try {
      const { avatar_url } = await userService.uploadAvatar(imageUri);
      setApiUser(prev => prev ? { ...prev, avatar_url } : prev);
    } catch (error: any) {
      Alert.alert('Upload failed', error.message || 'Could not upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logoutFromApi();
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
    );
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
          <View style={styles.modalAvatarWrapper}>
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
            {isUploadingAvatar && (
              <View style={[styles.avatarLoadingOverlay, { borderRadius: 40 }]}>
                <ActivityIndicator color={PRIMARY_GREEN} size="small" />
              </View>
            )}
            <TouchableOpacity 
              style={styles.avatarEditBadge}
              onPress={handleAvatarUpload}
              disabled={isUploadingAvatar}
            >
              <Ionicons name="camera-outline" size={16} color={WHITE} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => {
                setSaveError(null);
                setIsEditModalVisible(true);
              }}
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
              value={`${currency.symbol} ${currency.code}`}
              onPress={() => setIsCurrencyModalVisible(true)}
            />
            <SettingsRow
              icon="globe-outline"
              title="Language"
              value={language.name}
              onPress={() => setIsLanguageModalVisible(true)}
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
              onPress={() => router.push('/profile/about-campuskobo')}
            />
            <SettingsRow
              icon="business-outline"
              title="About BOF OAU"
              onPress={() => router.push('/profile/about-bof')}
              isLast={true}
            />
          </View>
        </View>

        <Text style={styles.versionText}>Version 1.0</Text>

        <TouchableOpacity 
          style={[styles.logoutBtn, isLoggingOut && styles.disabledBtn]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#EF4444" size="small" />
          ) : (
            <Text style={styles.logoutBtnText}>Log out</Text>
          )}
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
                      {isUploadingAvatar && (
                        <View style={styles.avatarLoadingOverlay}>
                          <ActivityIndicator color={PRIMARY_GREEN} size="small" />
                        </View>
                      )}
                      <TouchableOpacity 
                        style={styles.avatarEditBadge}
                        onPress={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                      >
                        <Ionicons name="camera-outline" size={16} color={WHITE} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <InputField
                    label="Name"
                    placeholder="Enter your name"
                    value={userName}
                    onChangeText={(text) => {
                      setUserName(text);
                      if (saveError) setSaveError(null);
                    }}
                    error={saveError || undefined}
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
                  style={[styles.saveBtn, isSaving && styles.disabledBtn]}
                  onPress={() => handleSaveProfile(userName)}
                  disabled={isSaving}
                >
                  {isSaving ? (
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
      {/* Currency Selection Modal */}
      <SelectionSheet
        visible={isCurrencyModalVisible}
        onClose={() => setIsCurrencyModalVisible(false)}
        title="Select Currency"
        options={[
          { label: 'Nigerian Naira', value: 'NGN', sublabel: '₦', extra: { symbol: '₦', name: 'Nigerian Naira' } },
          { label: 'US Dollar', value: 'USD', sublabel: '$', extra: { symbol: '$', name: 'US Dollar' } },
          { label: 'British Pound', value: 'GBP', sublabel: '£', extra: { symbol: '£', name: 'British Pound' } },
          { label: 'Euro', value: 'EUR', sublabel: '€', extra: { symbol: '€', name: 'Euro' } },
        ]}
        selectedValue={currency.code}
        onSelect={(item) => {
          setCurrency({ code: item.value, symbol: item.extra.symbol, name: item.extra.name });
          setIsCurrencyModalVisible(false);
        }}
      />

      {/* Language Selection Modal */}
      <SelectionSheet
        visible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
        title="Select Language"
        options={[
          { label: 'English', value: 'en' },
          { label: 'French', value: 'fr' },
          { label: 'Spanish', value: 'es' },
          { label: 'Yoruba', value: 'yo' },
          { label: 'Hausa', value: 'ha' },
          { label: 'Igbo', value: 'ig' },
        ]}
        selectedValue={language.code}
        onSelect={(item) => {
          setLanguage({ code: item.value, name: item.label });
          setIsLanguageModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

interface SelectionOption {
  label: string;
  value: string;
  sublabel?: string;
  extra?: any;
}

const SelectionSheet = ({ 
  visible, 
  onClose, 
  title, 
  options, 
  selectedValue, 
  onSelect 
}: { 
  visible: boolean, 
  onClose: () => void, 
  title: string, 
  options: SelectionOption[], 
  selectedValue: string,
  onSelect: (item: SelectionOption) => void
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetContainerHalf}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>{title}</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option, index) => {
                const isSelected = option.value === selectedValue;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                      index === options.length - 1 && styles.noBorder
                    ]}
                    onPress={() => onSelect(option)}
                  >
                    <View style={styles.optionMain}>
                      <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>
                        {option.label}
                      </Text>
                      {option.sublabel && (
                        <Text style={styles.optionSublabel}>{option.sublabel}</Text>
                      )}
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={PRIMARY_GREEN} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

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
    bottom: 5,
    right: 5,
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
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContainerHalf: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '60%',
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  selectedOptionItem: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  optionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  selectedOptionLabel: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.bold,
  },
  optionSublabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  }
});
