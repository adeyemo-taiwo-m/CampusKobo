import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { PRIMARY_GREEN, ACCENT_GREEN } from '../constants';

const { width, height } = Dimensions.get('window');

const CONFETTI_COUNT = 40;
const COLORS = [PRIMARY_GREEN, ACCENT_GREEN, '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece = ({ index }: ConfettiPieceProps) => {
  const yAnim = useRef(new Animated.Value(-20)).current;
  const xAnim = useRef(new Animated.Value(Math.random() * width)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const duration = 2000 + Math.random() * 2000;
    const delay = Math.random() * 1000;

    Animated.parallel([
      Animated.timing(yAnim, {
        toValue: height + 20,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        delay: delay + duration - 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
  });

  const size = 6 + Math.random() * 6;
  const color = COLORS[index % COLORS.length];

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          opacity: opacityAnim,
          transform: [
            { translateY: yAnim },
            { translateX: xAnim },
            { rotate },
          ],
        },
      ]}
    />
  );
};

export const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {[...Array(CONFETTI_COUNT)].map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    top: 0,
  },
});
