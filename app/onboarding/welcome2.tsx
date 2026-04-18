import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { WHITE, TEXT_SECONDARY, SPACING, Fonts } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { PaginationDots } from '../../src/components/PaginationDots';

export default function WelcomeScreen2() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/welcome-2.svg')}
            style={styles.illustration}
            contentFit="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Know where your money goes</Text>
          <Text style={styles.subtitle}>
            Track every expense in seconds
          </Text>
        </View>

        <View style={styles.dotsWrapper}>
          <PaginationDots total={3} activeIndex={1} />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Login" 
            onPress={() => router.push('/onboarding/login')} 
            variant="tertiary"
            style={styles.topButton}
          />
          <Button 
            title="Sign Up" 
            onPress={() => router.push('/onboarding/welcome3')} 
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    padding: SPACING.LG,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '110%',
    marginLeft: '-5%',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: SPACING.SM,
    fontFamily: Fonts.semiBold,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  dotsWrapper: {
    marginBottom: SPACING.XL,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: SPACING.LG,
  },
  topButton: {
    marginBottom: SPACING.MD,
  },
});
