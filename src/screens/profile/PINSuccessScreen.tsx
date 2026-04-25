import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';

export const PINSuccessScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color={PRIMARY_GREEN} />
        </View>

        <Text style={styles.title}>PIN Set Successfully!</Text>
        <Text style={styles.subtitle}>
          Your account is now more secure. You'll be asked for this PIN when you open the app.
        </Text>

        <TouchableOpacity 
          style={styles.doneBtn}
          onPress={() => router.replace('/profile/security')}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 40,
    elevation: 8,
    shadowColor: PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: TEXT_PRIMARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  doneBtn: {
    backgroundColor: PRIMARY_GREEN,
    width: '100%',
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  doneBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
});
