import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE, Fonts } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { InputField } from '../../src/components/InputField';
import { useAppContext } from '../../src/context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithApi, isAuthenticated, authLoading } = useAppContext();
  
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, authLoading]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setApiError(null);
    setIsLoading(true);
    
    try {
      await loginWithApi(email, password);
      // The useEffect above will handle the navigation
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      
      // Check if user needs verification
      if (errorMessage.toLowerCase().includes('not verified') || errorMessage.toLowerCase().includes('verify')) {
        router.push({
          pathname: '/onboarding/email-verification',
          params: { email }
        });
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your financial journey</Text>
        </View>

        <View style={styles.form}>
          <InputField 
            label="Email Address" 
            placeholder="Enter your email" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
          />
          <InputField 
            label="Password" 
            placeholder="Enter your password" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity 
            onPress={() => router.push('/(auth)/forgot-password' as any)} 
            style={styles.forgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {apiError && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={20} color={WHITE} />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Button 
            title={isLoading ? "" : "Log In"} 
            onPress={handleLogin} 
            disabled={!email || !password || isLoading}
          >
            {isLoading && <ActivityIndicator size="small" color={WHITE} />}
          </Button>
          
          <View style={styles.signupLinkContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/signup')} disabled={isLoading}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  },
  backButton: {
    marginTop: SPACING.SM,
    marginBottom: SPACING.LG,
  },
  header: {
    marginBottom: SPACING.XL,
  },
  title: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semiBold,
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    marginTop: SPACING.XS,
    fontFamily: Fonts.regular,
  },
  form: {
    marginBottom: SPACING.XL,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -SPACING.SM,
  },
  forgotPasswordText: {
    color: PRIMARY_GREEN,
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
  errorCard: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
    borderRadius: 8,
    marginTop: SPACING.MD,
  },
  errorText: {
    color: WHITE,
    fontSize: FONT_SIZE.MD,
    marginLeft: SPACING.SM,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  footer: {
    marginTop: SPACING.MD,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.LG,
  },
  footerText: {
    color: TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
    fontFamily: Fonts.regular,
  },
  linkText: {
    color: PRIMARY_GREEN,
    fontSize: FONT_SIZE.MD,
    fontWeight: 'bold',
    fontFamily: Fonts.semiBold,
  },
});
