import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../utils/networkStatus';
import { WHITE, Fonts } from '../constants';

export const OfflineBanner = () => {
  const { isOnline } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOnline ? 0 : 36,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  if (isOnline && slideAnim._value === 0) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { height: slideAnim, opacity: slideAnim.interpolate({
          inputRange: [0, 36],
          outputRange: [0, 1]
        }) }
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="wifi-outline" size={16} color={WHITE} style={styles.icon} />
        <Text style={styles.text}>You are offline. Showing saved data.</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F59E0B', // Yellow
    width: '100%',
    overflow: 'hidden',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: WHITE,
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
});
