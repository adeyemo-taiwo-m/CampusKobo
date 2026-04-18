import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { PRIMARY_GREEN, WHITE, TEXT_SECONDARY, FONT_SIZE } from '../../src/constants';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Auto-navigate after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding/welcome1');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>CampusKobo</Text>
        </View>
        <Text style={styles.brandText}>CampusKobo</Text>
        <Text style={styles.subText}>by BOF OAU</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brandText: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    color: PRIMARY_GREEN,
    marginBottom: 4,
  },
  subText: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_SECONDARY,
  },
});
