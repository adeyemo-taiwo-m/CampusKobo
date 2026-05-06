import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
  RED,
} from '../../constants';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { SuccessModal } from '../../components/SuccessScreen';
import { authService } from '../../services/authService';

export const ChangePasswordScreen = () => {
  const router = useRouter();
  const { t } = useAppContext();
  
  // Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password visibility toggles
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password Strength Logic
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async () => {
    setApiError(null);

    // Local validation first
    if (!oldPassword || !newPassword || !confirmPassword) {
      setApiError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      setApiError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setApiError("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setShowSuccess(true);
    } catch (error: any) {
      setApiError(
        error.message || "Failed to update password. Please try again.",
      );
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

  const isFormValid = oldPassword.length > 0 && newPassword.length >= 6 && confirmPassword.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <SuccessModal
        isVisible={showSuccess}
        title={t('security.passwordSuccess')}
        subtitle={t('security.passwordSuccessDesc')}
        onDone={() => {
          setShowSuccess(false);
          router.back();
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('security.changePasswordTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            {t('security.passwordDesc')}
          </Text>

          {apiError && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <InputField
              label={t('security.oldPassword')}
              placeholder={t('security.oldPassword')}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOld}
              rightIcon={
                <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                  <Ionicons 
                    name={showOld ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={TEXT_SECONDARY} 
                  />
                </TouchableOpacity>
              }
              containerStyle={styles.input}
            />

            <View style={styles.inputGroup}>
              <InputField
                label={t('security.newPassword')}
                placeholder={t('security.newPassword')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    <Ionicons 
                      name={showNew ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={TEXT_SECONDARY} 
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.input}
              />
              
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
                label={t('security.confirmPassword')}
                placeholder={t('security.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Ionicons 
                      name={showConfirm ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={TEXT_SECONDARY} 
                    />
                  </TouchableOpacity>
                }
                containerStyle={styles.input}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLoading ? "" : t('security.updatePassword')}
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
  errorCard: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.regular,
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
