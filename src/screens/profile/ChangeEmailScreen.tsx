import React, { useState } from 'react';
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
  Alert,
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
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { SuccessModal } from '../../components/SuccessScreen';
import { authService } from '../../services/authService';
import { useAppContext } from '../../context/AppContext';

export const ChangeEmailScreen = () => {
  const router = useRouter();
  const { apiUser, setApiUser } = useAppContext();
  
  // Form State
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleSubmit = async () => {
    setApiError(null);
    setSuccessMessage(null);

    // Local validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      setApiError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setApiError("Please enter your current password to confirm.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.changeEmail({ new_email: newEmail, password });
      setSuccessMessage(
        `A verification email has been sent to ${newEmail}. Please verify it to complete the change.`,
      );
      // Update the local apiUser email optimistically
      // @ts-ignore
      setApiUser((prev) => (prev ? { ...prev, email: newEmail } : prev));
    } catch (error: any) {
      setApiError(error.message || "Failed to update email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = newEmail.length > 0 && password.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Email</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            Your current email is <Text style={{ fontFamily: Fonts.bold }}>{apiUser?.email || 'not set'}</Text>. 
            Enter your new email address and confirm with your password.
          </Text>

          {apiError && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          )}

          {successMessage && (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          <View style={styles.form}>
            <InputField
              label="New Email Address"
              placeholder="Enter new email"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.input}
            />

            <InputField
              label="Current Password"
              placeholder="Enter password to confirm"
              value={password}
              onChangeText={setPassword}
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
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLoading ? "" : "Update Email"}
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
  successCard: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  form: {
    gap: 20,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
