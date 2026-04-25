import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';

const { width } = Dimensions.get('window');

export const ConfirmPINScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pin: originalPin } = useLocalSearchParams();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const shakeAnim = useState(new Animated.Value(0))[0];

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setError(false);
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === originalPin) {
        // Success!
        const timer = setTimeout(() => {
          router.push('/profile/pin-success');
        }, 300);
        return () => clearTimeout(timer);
      } else {
        // Mismatch
        setError(true);
        shake();
        const timer = setTimeout(() => {
          setPin('');
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [pin]);

  const Key = ({ value, subText }: { value: string; subText?: string }) => (
    <TouchableOpacity 
      style={styles.key} 
      onPress={() => handlePress(value)}
      activeOpacity={0.7}
    >
      <Text style={styles.keyText}>{value}</Text>
      {subText && <Text style={styles.keySubText}>{subText}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm PIN</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={40} color={PRIMARY_GREEN} />
          </View>
        </View>

        <Text style={styles.title}>Confirm your PIN</Text>
        <Text style={styles.subtitle}>Enter your PIN again to confirm</Text>

        {/* PIN Indicators */}
        <Animated.View style={[styles.pinRow, { transform: [{ translateX: shakeAnim }] }]}>
          {[1, 2, 3, 4].map((i) => (
            <View 
              key={i} 
              style={[
                styles.pinDot, 
                pin.length >= i && styles.pinDotFilled,
                error && styles.pinDotError
              ]} 
            />
          ))}
        </Animated.View>

        {error && (
          <Text style={styles.errorText}>PINs don't match. Try again.</Text>
        )}

        {/* Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            <Key value="1" />
            <Key value="2" subText="ABC" />
            <Key value="3" subText="DEF" />
          </View>
          <View style={styles.keypadRow}>
            <Key value="4" subText="GHI" />
            <Key value="5" subText="JKL" />
            <Key value="6" subText="MNO" />
          </View>
          <View style={styles.keypadRow}>
            <Key value="7" subText="PQRS" />
            <Key value="8" subText="TUV" />
            <Key value="9" subText="WXYZ" />
          </View>
          <View style={styles.keypadRow}>
            <View style={styles.key} />
            <Key value="0" />
            <TouchableOpacity style={styles.key} onPress={handleBackspace}>
              <Ionicons name="backspace-outline" size={28} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  stepDotActive: {
    backgroundColor: PRIMARY_GREEN,
    width: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
    marginBottom: 40,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  pinDotError: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  errorText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 26,
  },
  keypad: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  key: {
    width: (width - 60) / 3 - 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
  },
  keySubText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: TEXT_SECONDARY,
    letterSpacing: 1,
  },
});
