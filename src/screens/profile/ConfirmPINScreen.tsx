import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const { width } = Dimensions.get('window');
const PIN_LENGTH = 4;

const KeypadButton = ({ value, letters, onPress }: { value: string, letters?: string, onPress: (v: string) => void }) => (
  <TouchableOpacity 
    style={styles.key} 
    onPress={() => onPress(value)}
    activeOpacity={0.7}
  >
    <Text style={styles.keyText}>{value}</Text>
    {letters && <Text style={styles.keyLetters}>{letters}</Text>}
  </TouchableOpacity>
);

export const ConfirmPINScreen = () => {
  const router = useRouter();
  const { pin: originalPin } = useLocalSearchParams<{ pin: string }>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = (value: string) => {
    if (pin.length < PIN_LENGTH && !error) {
      setPin(prev => prev + value);
    }
  };

  const handleBackspace = () => {
    if (!error) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === originalPin) {
        // Success
        const timer = setTimeout(() => {
          router.push('/profile/pin-success');
        }, 200);
        return () => clearTimeout(timer);
      } else {
        // Mismatch
        setError(true);
        shake();
        const timer = setTimeout(() => {
          setPin('');
          setError(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [pin]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Set PIN" showBack={true} onBack={() => router.back()} />

      <View style={styles.content}>
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
        </View>

        {/* Center Content */}
        <View style={styles.centerSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={40} color={PRIMARY_GREEN} />
          </View>
          <Text style={styles.title}>Confirm your PIN</Text>
          <Text style={styles.subtitle}>Enter your PIN again to confirm</Text>

          {/* PIN Indicators */}
          <Animated.View style={[
            styles.indicatorContainer,
            { transform: [{ translateX: shakeAnim }] }
          ]}>
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.indicator, 
                  i < pin.length && styles.indicatorFilled,
                  error && i < pin.length && styles.indicatorError
                ]} 
              />
            ))}
          </Animated.View>

          {error && (
            <Text style={styles.errorText}>PINs don't match. Try again.</Text>
          )}
        </View>

        {/* Keypad */}
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            <KeypadButton value="1" onPress={handlePress} />
            <KeypadButton value="2" letters="ABC" onPress={handlePress} />
            <KeypadButton value="3" letters="DEF" onPress={handlePress} />
          </View>
          <View style={styles.keypadRow}>
            <KeypadButton value="4" letters="GHI" onPress={handlePress} />
            <KeypadButton value="5" letters="JKL" onPress={handlePress} />
            <KeypadButton value="6" letters="MNO" onPress={handlePress} />
          </View>
          <View style={styles.keypadRow}>
            <KeypadButton value="7" letters="PQRS" onPress={handlePress} />
            <KeypadButton value="8" letters="TUV" onPress={handlePress} />
            <KeypadButton value="9" letters="WXYZ" onPress={handlePress} />
          </View>
          <View style={styles.keypadRow}>
            <View style={styles.key} />
            <KeypadButton value="0" onPress={handlePress} />
            <TouchableOpacity style={styles.key} onPress={handleBackspace}>
              <Ionicons name="backspace-outline" size={28} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="lock-closed-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.footerText}>Your PIN is encrypted and stored securely</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: PRIMARY_GREEN,
  },
  centerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
  },
  indicatorFilled: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  indicatorError: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 16,
    color: '#EF4444',
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  keypadContainer: {
    marginTop: 'auto',
    marginBottom: 40,
    width: '100%',
    maxWidth: 320,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  keyText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  keyLetters: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginTop: -2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
  },
});
