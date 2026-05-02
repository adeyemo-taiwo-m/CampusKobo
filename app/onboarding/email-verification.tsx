import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_SECONDARY,
  TEXT_PRIMARY,
  SPACING,
  FONT_SIZE,
  Fonts,
} from '../../src/constants';
import { Button } from '../../src/components/Button';
import { authService } from '../../src/services/authService';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste if needed, but standard single digit for now
      value = value.charAt(value.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setError(null);
    try {
      await authService.resendVerification(email!);
      setTimer(60);
      setCanResend(false);
      // Optional: Show toast "Code resent"
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;

    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyEmail({ email: email!, code });
      // On Success, proceed to goal selection
      router.replace('/onboarding/goal-selection');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={72} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.title}>Check your inbox</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to{' '}
              <Text style={styles.emailHighlight}>{email}</Text>. Enter it below to activate your account.
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  index === otp.findIndex((d) => d === '') ? styles.otpInputFocused : null,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend verification email</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendText}>Didn't receive it? Resend in {timer}s</Text>
            )}
          </View>

          <View style={styles.footer}>
            <Button
              title={isLoading ? '' : 'Verify Email'}
              onPress={handleVerify}
              disabled={!isOtpComplete || isLoading}
            >
              {isLoading && <ActivityIndicator size="small" color={WHITE} />}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    padding: SPACING.LG,
    flexGrow: 1,
  },
  backButton: {
    marginTop: SPACING.SM,
    marginBottom: SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  iconContainer: {
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semiBold,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Fonts.regular,
  },
  emailHighlight: {
    color: PRIMARY_GREEN,
    fontWeight: 'bold',
    fontFamily: Fonts.semiBold,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.XL,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    backgroundColor: '#F8FAFC',
  },
  otpInputFocused: {
    borderColor: PRIMARY_GREEN,
    backgroundColor: WHITE,
  },
  otpInputFilled: {
    borderColor: '#3CB96A', // SUCCESS_GREEN equivalent
    backgroundColor: WHITE,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: SPACING.MD,
    fontFamily: Fonts.medium,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  resendText: {
    color: TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
    fontFamily: Fonts.regular,
  },
  resendLink: {
    color: PRIMARY_GREEN,
    fontSize: FONT_SIZE.MD,
    fontWeight: 'bold',
    fontFamily: Fonts.semiBold,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: SPACING.LG,
  },
});
