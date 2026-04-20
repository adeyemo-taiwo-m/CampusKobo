import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import {
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  RED,
} from "../constants";
import { Button } from "./Button";

interface DeleteConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isVisible,
  title,
  message,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 50,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="secondary"
                style={styles.cancelBtn}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="Delete"
                onPress={onConfirm}
                variant="danger"
                style={styles.deleteBtn}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
  cancelBtn: {
    height: 52,
    borderRadius: 14,
  },
  deleteBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: RED,
  }
});
