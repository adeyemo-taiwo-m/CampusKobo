import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { WHITE, Fonts, TEXT_SECONDARY, TEXT_PRIMARY } from '../../src/constants';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate to welcome screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding/welcome1');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../../assets/images/logo-vertical.svg')}
          style={styles.logo}
          contentFit="contain"
        />
        
        {/* Attribution Text */}
        <Text style={styles.attributionContainer}>
          <Text style={styles.attributionBy}>by </Text>
          <Text style={styles.attributionBrand}>BOF OAU</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Subtle off-white from your screenshot
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 280, // Sized perfectly for the center
    height: 280,
  },
  attributionContainer: {
    marginTop: -20, // Pull up closer to the logo text
    textAlign: 'center',
  },
  attributionBy: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    opacity: 0.7,
  },
  attributionBrand: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
});
