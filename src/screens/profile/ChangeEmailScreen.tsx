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

export const ChangeEmailScreen = () => {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdateEmail = async () => {
    setApiError(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setApiError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changeEmail({
        new_email: newEmail,
        password: password,
      });
      
      Alert.alert(
        'Verification Sent',
        `A verification email has been sent to ${newEmail}. Please verify it to complete the change.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      setApiError(error.message || 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = newEmail && password;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Change Email" showBack={true} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.infoText}>
            To change your email, we need to verify your identity. A verification code will be sent to your new email address.
          </Text>

          <InputField
            label="New Email Address"
            placeholder="example@email.com"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Current Password"
            placeholder="Confirm your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {apiError && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={20} color={WHITE} />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, (!isFormValid || isLoading) && styles.disabledBtn]}
            onPress={handleUpdateEmail}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={WHITE} size="small" />
            ) : (
              <Text style={styles.saveBtnText}>Update Email</Text>
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
  infoText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    marginBottom: 24,
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
