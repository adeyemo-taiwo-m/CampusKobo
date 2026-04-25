// UPDATE 2026-04-25: Amended to match exact 3-screen design spec:
//  - Screen 1: Gray background, circular back btn, charcoal disabled button
//  - Screen 2: Green borders on filled fields, green active button
//  - Screen 3: Centered white card overlay, scale-in anim, auto-dismiss after 2s

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { SavingsGoal } from '../../types';

// ── Emoji auto-detection from goal name ──────────────────────────────────────
const getGoalEmoji = (name: string): string => {
  const l = name.toLowerCase();
  if (l.includes('laptop') || l.includes('computer')) return '💻';
  if (l.includes('phone') || l.includes('mobile')) return '📱';
  if (l.includes('trip') || l.includes('travel') || l.includes('flight')) return '✈️';
  if (l.includes('car') || l.includes('vehicle')) return '🚗';
  if (l.includes('house') || l.includes('home') || l.includes('rent')) return '🏠';
  if (l.includes('emergency') || l.includes('fund')) return '🛡️';
  if (l.includes('wedding')) return '💍';
  if (l.includes('school') || l.includes('edu') || l.includes('tuition')) return '🎓';
  if (l.includes('business')) return '💼';
  if (l.includes('health') || l.includes('medical')) return '🏥';
  return '🎯';
};

// ── Inline SuccessOverlay (Screen 3) ────────────────────────────────────────
// Auto-dismisses after 2s with a scale-in animation. No button required.
const SuccessOverlay = ({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Scale + fade in
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      // Auto-dismiss after 2s
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0.75);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      {/* Dimmed overlay */}
      <View style={overlay.backdrop}>
        <Animated.View style={[overlay.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          {/* Green check circle */}
          <View style={overlay.iconCircle}>
            <Ionicons name="checkmark" size={30} color={WHITE} />
          </View>
          <Text style={overlay.title}>Savings created{'\n'}successfully</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const overlay = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    width: 280,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 30,
  },
});

// ── Main Screen ──────────────────────────────────────────────────────────────
export const CreateSavingsGoalScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { goal: goalParam } = useLocalSearchParams();
  const { addSavingsGoal, updateSavingsGoal } = useAppContext();

  const editingGoal = goalParam ? JSON.parse(goalParam as string) as SavingsGoal : null;
  const isEditing = !!editingGoal;

  const [name, setName] = useState(editingGoal?.name || '');
  const [targetAmount, setTargetAmount] = useState(
    editingGoal?.targetAmount
      ? editingGoal.targetAmount.toLocaleString()
      : ''
  );
  const [targetDate, setTargetDate] = useState(
    editingGoal?.deadline
      ? new Date(editingGoal.deadline).toLocaleDateString()
      : ''
  );
  const [initialDeposit, setInitialDeposit] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = name.trim().length > 0 && targetAmount.length > 0;

  const formatAmount = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return parseInt(digits, 10).toLocaleString();
  };
  const parseAmount = (s: string) => parseFloat(s.replace(/,/g, '')) || 0;

  const handleSave = async () => {
    if (!isFormValid) return;
    const deposit = parseAmount(initialDeposit);
    const emoji = editingGoal?.emoji || getGoalEmoji(name);

    if (isEditing && editingGoal) {
      await updateSavingsGoal(editingGoal.id, {
        name,
        targetAmount: parseAmount(targetAmount),
        deadline: targetDate || undefined,
        emoji,
      });
      router.back();
    } else {
      const newGoal: SavingsGoal = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        targetAmount: parseAmount(targetAmount),
        savedAmount: deposit,
        deadline: targetDate || undefined,
        emoji,
        createdAt: new Date().toISOString(),
        contributions: deposit > 0
          ? [{ amount: deposit, date: new Date().toISOString(), note: notes || 'Initial deposit' }]
          : [],
      };
      await addSavingsGoal(newGoal);
      setShowSuccess(true);
    }
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    router.replace('/(tabs)/savings');
  };

  // Field active state helper
  const fieldState = (val: string) => !!val;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* ── Custom Header ──────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Savings Goal' : 'Create Savings Goal'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Form ───────────────────────────────────────── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Goal Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Goal Name</Text>
            <TextInput
              style={[styles.input, fieldState(name) && styles.inputActive]}
              placeholder="e.g. Laptop"
              placeholderTextColor="#BDBDBD"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Target Amount */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Target Amount</Text>
            <TextInput
              style={[styles.input, fieldState(targetAmount) && styles.inputActive]}
              placeholder="₦0"
              placeholderTextColor="#BDBDBD"
              value={targetAmount ? `₦${targetAmount}` : ''}
              onChangeText={(t) => setTargetAmount(formatAmount(t.replace('₦', '')))}
              keyboardType="numeric"
            />
          </View>

          {/* Target Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Target Date{targetDate ? ' (optional)' : ''}
            </Text>
            <TouchableOpacity
              style={[styles.input, styles.inputRow, fieldState(targetDate) && styles.inputActive]}
              activeOpacity={0.7}
            >
              <Text style={targetDate ? styles.inputText : styles.inputPlaceholder}>
                {targetDate || 'Select a date'}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={targetDate ? PRIMARY_GREEN : '#BDBDBD'}
              />
            </TouchableOpacity>
          </View>

          {/* Initial Deposit (create mode only) */}
          {!isEditing && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Initial Deposit</Text>
              <TextInput
                style={[styles.input, fieldState(initialDeposit) && styles.inputActive]}
                placeholder="₦0"
                placeholderTextColor="#BDBDBD"
                value={initialDeposit ? `₦${initialDeposit}` : ''}
                onChangeText={(t) => setInitialDeposit(formatAmount(t.replace('₦', '')))}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Note */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, fieldState(notes) && styles.inputActive]}
              placeholder=""
              placeholderTextColor="#BDBDBD"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Footer Button ──────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.createBtn, isFormValid ? styles.createBtnActive : styles.createBtnDisabled]}
          onPress={handleSave}
          disabled={!isFormValid}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>
            {isEditing ? 'Save Changes' : 'Create Goal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Screen 3: Success Overlay ──────────────────── */}
      <SuccessOverlay visible={showSuccess} onDismiss={handleSuccessDismiss} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },

  // ── Form ────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  inputActive: {
    // UPDATE 2026-04-25: Green border when field has a value (active state)
    borderColor: PRIMARY_GREEN,
    borderWidth: 1.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputMultiline: {
    height: 88,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_PRIMARY,
    flex: 1,
  },
  inputPlaceholder: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#BDBDBD',
    flex: 1,
  },

  // ── Footer ──────────────────────────────────────────
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#F5F5F5',
  },
  createBtn: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // UPDATE 2026-04-25: Disabled = charcoal (#374151) per design spec
  createBtnDisabled: {
    backgroundColor: '#374151',
  },
  // UPDATE 2026-04-25: Active = PRIMARY_GREEN per design spec
  createBtnActive: {
    backgroundColor: PRIMARY_GREEN,
  },
  createBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: WHITE,
  },
});

export default CreateSavingsGoalScreen;
