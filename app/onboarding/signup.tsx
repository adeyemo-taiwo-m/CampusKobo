import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE, Fonts } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { InputField } from '../../src/components/InputField';
import { useAppContext } from '../../src/context/AppContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser } = useAppContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validate()) {
      // For prototype, just create a user object
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        currency: 'NGN' as const,
        monthlyBudget: 0,
        selectedGoals: [],
        selectedCategories: [],
        hasPIN: false,
        hasCompletedOnboarding: false,
      };
      
      setUser(newUser);
      // Navigate to the next onboarding step
      router.push('/onboarding/goal-selection');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CampusKobo and take control of your money</Text>
        </View>

        <View style={styles.form}>
          <InputField 
            label="Full Name" 
            placeholder="Enter your full name" 
            value={name} 
            onChangeText={setName}
            state={errors.name ? 'error' : 'default'}
            error={errors.name}
          />
          <InputField 
            label="Email Address" 
            placeholder="Enter your email" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            state={errors.email ? 'error' : 'default'}
            error={errors.email}
          />
          <InputField 
            label="Password" 
            placeholder="Create a password" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            state={errors.password ? 'error' : 'default'}
            error={errors.password}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            }
          />

          <View style={styles.passwordStrengthContainer}>
             {password.length > 0 && (
               <Text style={[
                 styles.strengthText, 
                 { color: password.length > 8 ? PRIMARY_GREEN : password.length > 5 ? '#F59E0B' : '#EF4444' }
               ]}>
                 Strength: {password.length > 8 ? 'Strong' : password.length > 5 ? 'Fair' : 'Weak'}
               </Text>
             )}
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Create Account" 
            onPress={handleSignUp} 
            disabled={!name || !email || !password}
          />
          
          <View style={styles.loginLinkContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/login')}>
              <Text style={styles.linkText}>Log In</Text>
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
  passwordStrengthContainer: {
    marginTop: -SPACING.SM,
    marginBottom: SPACING.MD,
  },
  strengthText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
  footer: {
    marginTop: SPACING.MD,
  },
  loginLinkContainer: {
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
