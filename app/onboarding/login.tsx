import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { InputField } from '../../src/components/InputField';
import { useAppContext } from '../../src/context/AppContext';
import { StorageService } from '../../src/storage/StorageService';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // For prototype purposes, any non-empty combination succeeds
    if (email && password) {
      const existingUser = await StorageService.getUser();
      
      if (existingUser && existingUser.email === email) {
        setUser(existingUser);
        if (existingUser.hasCompletedOnboarding) {
          router.replace('/(tabs)');
        } else {
          router.push('/onboarding/goal-selection');
        }
      } else {
        // Mocking a successful login for a new user entry
        const mockUser = {
          id: '123',
          name: 'Student User',
          email: email,
          currency: 'NGN' as const,
          monthlyBudget: 0,
          selectedGoals: [],
          selectedCategories: [],
          hasPIN: false,
          hasCompletedOnboarding: false,
        };
        setUser(mockUser);
        router.push('/onboarding/goal-selection');
      }
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
            onChange={setEmail}
            keyboardType="email-address"
          />
          <InputField 
            label="Password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Password reset sent to your email')} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Log In" 
            onPress={handleLogin} 
            disabled={!email || !password}
          />
          
          <View style={styles.signupLinkContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/signup')}>
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
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    marginTop: SPACING.XS,
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
  },
  linkText: {
    color: PRIMARY_GREEN,
    fontSize: FONT_SIZE.MD,
    fontWeight: 'bold',
  },
});
