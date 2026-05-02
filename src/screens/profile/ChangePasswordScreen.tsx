import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
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
import { InputField } from '../../components/InputField';
import { authService } from '../../services/authService';

export const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async () => {
    setApiError(null);

    if (newPassword.length < 6) {
      setApiError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setApiError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      });
      
      Alert.alert(
        'Success',
        'Password updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      setApiError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = currentPassword && newPassword && confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Change Password" showBack={true} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <InputField
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            rightIcon={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          <InputField
            label="New Password"
            placeholder="Min. 6 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            rightIcon={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowNewPassword(!showNewPassword)}
          />

          <InputField
            label="Confirm New Password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {apiError && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={20} color={WHITE} />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, (!isFormValid || isLoading) && styles.disabledBtn]}
            onPress={handleUpdatePassword}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={WHITE} size="small" />
            ) : (
              <Text style={styles.saveBtnText}>Update Password</Text>
            )}
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
  scrollContent: {
    padding: 20,
  },
  form: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  errorCard: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.medium,
    marginLeft: 8,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
  saveBtnText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
