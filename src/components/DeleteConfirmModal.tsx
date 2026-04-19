import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
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
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonRow}>
                <View style={styles.buttonWrapper}>
                  <Button
                    title="Cancel"
                    onPress={onClose}
                    variant="secondary"
                    size="md"
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    title="Delete"
                    onPress={onConfirm}
                    variant="danger"
                    size="md"
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.LG,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: SPACING.LG,
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: TEXT_PRIMARY,
    marginBottom: SPACING.MD,
    textAlign: "center",
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: SPACING.XL,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.MD,
  },
  buttonWrapper: {
    flex: 1,
  },
});
