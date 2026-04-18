import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { DARK_CARD, WHITE, PRIMARY_GREEN, SPACING, FONT_SIZE, Fonts } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { useAppContext } from '../../src/context/AppContext';

export default function OnboardingSuccessScreen() {
  const router = useRouter();
  const { updateUser } = useAppContext();

  useEffect(() => {
    // Update user status
    updateUser({ hasCompletedOnboarding: true });

    // Auto-navigate after 5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={true}
        fadeOut={true}
        colors={[WHITE, '#86EFAC', '#FEF08A']}
      />

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={60} color={PRIMARY_GREEN} />
        </View>
        
        <Text style={styles.title}>You're All Set! 🎉</Text>
        <Text style={styles.subtitle}>
          Welcome to CampusKobo. Your financial journey starts today.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Go to Dashboard" 
          onPress={() => router.replace('/(tabs)')} 
          variant="outline"
          style={styles.button}
          textStyle={{ color: WHITE }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_CARD,
    padding: SPACING.LG,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.XL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    color: WHITE,
    textAlign: 'center',
    marginBottom: SPACING.MD,
    fontFamily: Fonts.semiBold,
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: '#D1D5DB', // light gray
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.MD,
    fontFamily: Fonts.regular,
  },
  footer: {
    marginBottom: SPACING.LG,
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: WHITE,
    borderWidth: 2,
  },
});
