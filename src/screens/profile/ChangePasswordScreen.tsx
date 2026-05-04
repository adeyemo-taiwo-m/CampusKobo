import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
  RED,
} from '../../constants';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { SuccessModal } from '../../components/SuccessScreen';
import { authService } from '../../services/authService';

export const ChangePasswordScreen = () => {
  const router = useRouter();
  
  // Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Strength Logic
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await authService.changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      });
      setShowSuccess(true);
    } catch (error: any) {
      console.error('Change password error:', error);
      setErrors({ api: error.message || 'Failed to update password. Please check your current password.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return '#EF4444';
    if (passwordStrength <= 2) return '#F59E0B';
    if (passwordStrength <= 3) return '#10B981';
    return '#059669';
  };

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return '';
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const isFormValid = currentPassword.length > 0 && newPassword.length >= 6 && confirmPassword.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <SuccessModal
        isVisible={showSuccess}
        title="Password Updated!"
        subtitle="Your account security has been updated successfully."
        onDone={() => {
          setShowSuccess(false);
          router.back();
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            Your new password must be different from previously used passwords.
          </Text>

          {errors.api && (
            <View style={styles.apiErrorCard}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text style={styles.apiErrorText}>{errors.api}</Text>
            </View>
          )}

          <View style={styles.form}>
            <InputField
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons 
                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={TEXT_SECONDARY} 
                  />
                </TouchableOpacity>
              }
              containerStyle={styles.input}
            />

            <View style={styles.inputGroup}>
              <InputField
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Ionicons 
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={TEXT_SECONDARY} 
                    />
                  </TouchableOpacity>
                }
                containerStyle={[styles.input, errors.newPassword ? styles.inputError : null]}
              />
              {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
              
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarWrapper}>
                    {[1, 2, 3, 4].map((i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.strengthBar, 
                          i <= passwordStrength ? { backgroundColor: getStrengthColor() } : null
                        ]} 
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: getStrengthColor() }]}>
                    {getStrengthLabel()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <InputField
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={TEXT_SECONDARY} 
                    />
                  </TouchableOpacity>
                }
                containerStyle={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLoading ? "" : "Update Password"}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            variant="primary"
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            icon={isLoading ? <ActivityIndicator color={WHITE} /> : null}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    lineHeight: 22,
    marginBottom: 24,
  },
  apiErrorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  apiErrorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: Fonts.medium,
    marginLeft: 10,
    flex: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontFamily: Fonts.regular,
    marginLeft: 4,
  },
  strengthContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthBarWrapper: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    marginRight: 12,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  footer: {
    padding: 20,
    backgroundColor: BACKGROUND,
  },
  button: {
    height: 56,
    borderRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
