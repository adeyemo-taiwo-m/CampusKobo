import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BACKGROUND,
} from "../constants";
import { ProgressBar } from "./ProgressBar";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { SavingsGoal } from "../types";
import { useAppContext } from "../context/AppContext";

interface AddFundsBottomSheetProps {
  visible: boolean;
  goal: SavingsGoal;
  onClose: () => void;
  onSuccess: () => void;
}

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];
const SOURCE_OPTIONS = ["Main Wallet", "Savings Balance", "Linked Debit Card"];

export const AddFundsBottomSheet = ({
  visible,
  goal,
  onClose,
  onSuccess,
}: AddFundsBottomSheetProps) => {
  const { addFundsToGoal } = useAppContext();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState(SOURCE_OPTIONS[0]);
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successAnim] = useState(new Animated.Value(0));
  const [showSourceSelector, setShowSourceSelector] = useState(false);

  const progress = goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;
  const percent = Math.round(progress * 100);

  const numAmount = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
  const remainingAfter = Math.max(goal.targetAmount - (goal.savedAmount + numAmount), 0);

  const handleAddFunds = async () => {
    if (numAmount <= 0) return;

    await addFundsToGoal(goal.id, numAmount, note, source);
    
    // Show success overlay
    setIsSuccess(true);
    Animated.spring(successAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Auto-dismiss and call onSuccess/onClose after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setAmount("");
      setNote("");
      onSuccess();
      onClose();
      successAnim.setValue(0);
    }, 2000);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={!isSuccess ? onClose : undefined}
      onSwipeComplete={!isSuccess ? onClose : undefined}
      swipeDirection={!isSuccess ? ["down"] : undefined}
      style={styles.modal}
      propagateSwipe
      avoidKeyboard
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={{ width: 24 }} /> {/* Spacer */}
          <Text style={styles.title}>Add Funds</Text>
          <TouchableOpacity onPress={onClose} disabled={isSuccess}>
            <Ionicons name="close" size={24} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Current Progress Label */}
          <Text style={styles.sectionLabel}>Current Progress</Text>
          
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <Text style={styles.cardAmountRow}>
              <Text style={styles.cardSavedAmount}>₦{goal.savedAmount.toLocaleString()}</Text>
              <Text style={styles.cardAmountSeparator}> / </Text>
              <Text style={styles.cardTargetAmount}>₦{goal.targetAmount.toLocaleString()}</Text>
            </Text>
            
            <View style={styles.cardBarRow}>
              <View style={styles.cardBarWrapper}>
                <ProgressBar progress={progress} height={10} fillColor={PRIMARY_GREEN} backgroundColor="#F3F4F6" />
              </View>
              <Text style={styles.cardPercentText}>{percent}%</Text>
            </View>
          </View>

          {/* Amount Input Section using InputField */}
          <InputField
            label="How much do you want to add?"
            placeholder="0"
            prefix="₦"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Quick Amount Chips */}
          <View style={styles.chipsRow}>
            {QUICK_AMOUNTS.map((amt) => {
              const isSelected = numAmount === amt;
              return (
                <TouchableOpacity
                  key={amt}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setAmount(amt.toString())}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    ₦{amt.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Source Selector using SelectField */}
          <SelectField
            label="Add from"
            placeholder="Select source"
            value={source}
            onPress={() => setShowSourceSelector(!showSourceSelector)}
            state={showSourceSelector ? "active" : "default"}
          />

          {/* Static Source Dropdown (simulated) */}
          {showSourceSelector && (
            <View style={styles.sourceDropdown}>
              {SOURCE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.sourceOption}
                  onPress={() => {
                    setSource(opt);
                    setShowSourceSelector(false);
                  }}
                >
                  <Text style={[
                    styles.sourceOptionText,
                    source === opt && { color: PRIMARY_GREEN, fontFamily: Fonts.bold }
                  ]}>{opt}</Text>
                  {source === opt && <Ionicons name="checkmark" size={18} color={PRIMARY_GREEN} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Note Input using InputField */}
          <InputField
            label="Note (Optional)"
            placeholder="e.g. Monthly savings"
            value={note}
            onChangeText={setNote}
          />

          {/* Remaining Text info */}
          {numAmount > 0 && (
            <Text style={styles.remainingInfo}>
              After this top-up, you'll still need ₦{remainingAfter.toLocaleString()} to reach your goal
            </Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              numAmount <= 0 && styles.disabledButton,
            ]}
            onPress={handleAddFunds}
            disabled={numAmount <= 0 || isSuccess}
          >
            <Text style={styles.submitButtonText}>Add Funds</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Success Overlay */}
        {isSuccess && (
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.successBackdrop} />
            <Animated.View 
              style={[
                styles.successCard,
                {
                  transform: [
                    { scale: successAnim },
                    { translateY: successAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })
                    }
                  ],
                  opacity: successAnim
                }
              ]}
            >
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={48} color={WHITE} />
              </View>
              <Text style={styles.successTitle}>Funds added successfully</Text>
            </Animated.View>
          </View>
        )}
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    maxHeight: "90%",
    position: 'relative',
    overflow: 'hidden',
  },
  dragHandle: {
    width: 60,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  sectionLabel: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: "#374151",
    marginBottom: 12,
  },
  // Progress Card
  progressCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 24,
  },
  cardAmountRow: {
    marginBottom: 16,
  },
  cardSavedAmount: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: PRIMARY_GREEN,
  },
  cardAmountSeparator: {
    fontFamily: Fonts.regular,
    fontSize: 24,
    color: "#9CA3AF",
  },
  cardTargetAmount: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: PRIMARY_GREEN,
  },
  cardBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardBarWrapper: {
    flex: 1,
  },
  cardPercentText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  // Chips
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: PRIMARY_GREEN,
  },
  chipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: "#374151",
  },
  chipTextSelected: {
    color: WHITE,
  },
  // Source Dropdown
  sourceDropdown: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  sourceOptionText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  remainingInfo: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: PRIMARY_GREEN,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
  // Success Overlay
  successBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  successCard: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    width: 280,
    backgroundColor: WHITE,
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 30,
  },
});
