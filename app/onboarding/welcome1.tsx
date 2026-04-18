import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, SPACING, FONT_SIZE, LIGHT_GREEN } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { PaginationDots } from '../../src/components/PaginationDots';

export default function WelcomeScreen1() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <Text style={styles.placeholderText}>Illustration 1</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Take Control of Your Money</Text>
          <Text style={styles.subtitle}>
            Track every kobo, build smart habits, and reach your financial goals.
          </Text>
        </View>

        <PaginationDots total={3} activeIndex={0} />

        <View style={styles.buttonContainer}>
          <Button 
            title="Sign Up" 
            onPress={() => router.push('/onboarding/welcome2')} 
            variant="primary"
          />
          <Button 
            title="Log In" 
            onPress={() => router.push('/onboarding/login')} 
            variant="outline"
            style={styles.loginButton}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#F0FDF4', // Very light green
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LIGHT_GREEN,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: PRIMARY_GREEN,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: SPACING.XL,
  },
  title: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: SPACING.MD,
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: SPACING.LG,
  },
  loginButton: {
    borderWidth: 0, // Instructions say "no background, primary green text"
  }
});
