import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
  BACKGROUND,
} from "../constants";
import { ProgressBar } from "./ProgressBar";
import { SavingsGoal } from "../types";
import { useAppContext } from "../context/AppContext";

interface AddFundsBottomSheetProps {
  visible: boolean;
  goal: SavingsGoal;
  onClose: () => void;
  onSuccess: () => void;
}

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

export const AddFundsBottomSheet = ({
  visible,
  goal,
  onClose,
  onSuccess,
}: AddFundsBottomSheetProps) => {
  const { addFundsToGoal } = useAppContext();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const progress = goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;
  const percent = Math.round(progress * 100);

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) return;

    await addFundsToGoal(goal.id, numAmount, note);
    setAmount("");
    setNote("");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={styles.modal}
      propagateSwipe
      avoidKeyboard
    >
      <View style={styles.container}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        <View style={styles.header}>
          <Text style={styles.title}>Add Funds</Text>
          <Text style={styles.subtitle}>Saving for: {goal.name}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <ProgressBar progress={progress} height={8} />
            <Text style={styles.progressText}>
              ₦{goal.savedAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()} • {percent}%
            </Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>How much do you want to add?</Text>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currency}>₦</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>
          </View>

          {/* Quick Amount Chips */}
          <View style={styles.chipsRow}>
            {QUICK_AMOUNTS.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={styles.chip}
                onPress={() => setAmount(amt.toString())}
              >
                <Text style={styles.chipText}>₦{amt.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Source Row */}
          <View style={styles.sourceSection}>
            <Text style={styles.label}>Add from</Text>
            <TouchableOpacity style={styles.sourceSelector} activeOpacity={0.7}>
              <View style={styles.sourceLeft}>
                <View style={styles.sourceIcon}>
                  <Ionicons name="wallet-outline" size={20} color={PRIMARY_GREEN} />
                </View>
                <Text style={styles.sourceName}>Main Wallet</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>

          {/* Note Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. Monthly savings"
              value={note}
              onChangeText={setNote}
              placeholderTextColor={TEXT_SECONDARY}
            />
          </View>

          {/* Bottom Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!amount || parseFloat(amount) <= 0) && styles.disabledButton,
            ]}
            onPress={handleAddFunds}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Text style={styles.submitButtonText}>Add Funds</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    maxHeight: "85%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginTop: 10,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 12,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  currency: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: TEXT_PRIMARY,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: TEXT_PRIMARY,
    padding: 0,
  },
  chipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  chip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  sourceSection: {
    marginBottom: 32,
  },
  sourceSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  sourceLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sourceName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  noteInput: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  submitButton: {
    backgroundColor: PRIMARY_GREEN,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  submitButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
});
