import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
} from "../constants";

interface SuccessModalProps {
  isVisible: boolean;
  title: string;
  subtitle: string;
  onDone: () => void;
}

export const SuccessModal = ({
  isVisible,
  title,
  subtitle,
  onDone,
}: SuccessModalProps) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    if (isVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        onDone();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [isVisible, onDone]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={36} color={WHITE} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '75%',
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20, // Slightly smaller for modal
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
});

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  buttonTitle?: string;
  onDone: () => void;
}

export const SuccessScreen = ({ title, subtitle, buttonTitle = "Done", onDone }: SuccessScreenProps) => {
  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.content}>
        <View style={screenStyles.iconCircle}>
          <Ionicons name="checkmark" size={48} color={WHITE} />
        </View>
        <Text style={screenStyles.title}>{title}</Text>
        <Text style={screenStyles.subtitle}>{subtitle}</Text>
      </View>
      <View style={screenStyles.footer}>
        <TouchableOpacity style={screenStyles.button} onPress={onDone}>
          <Text style={screenStyles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: SPACING.LG,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: PRIMARY_GREEN,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: WHITE,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
