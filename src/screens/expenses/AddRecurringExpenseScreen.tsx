import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  SPACING, 
  Fonts,
  BORDER_GRAY,
  BACKGROUND 
} from '../../constants';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { CategoryBottomSheet } from '../../components/CategoryBottomSheet';
import { SuccessScreen } from '../../components/SuccessScreen';
import { useAppContext } from '../../context/AppContext';
import { RecurringExpense } from '../../types';

export default function AddRecurringExpenseScreen() {
  const router = useRouter();
  const { addRecurringExpense } = useAppContext();
  
  // Form State
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<{name: string, icon: string, color: string} | null>(null);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [startDate, setStartDate] = useState(new Date());
  const [note, setNote] = useState('');

  // UI State
  const [isCategorySheetVisible, setIsCategorySheetVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation
  useEffect(() => {
    setIsValid(!!amount && parseFloat(amount) > 0 && !!name && !!category);
  }, [amount, name, category]);

  // Calculate Next Due Date
  const calculateNextDue = () => {
    const next = new Date(startDate);
    if (!startDate) return next;
    if (frequency === 'daily') next.setDate(next.getDate() + 1);
    else if (frequency === 'weekly') next.setDate(next.getDate() + 7);
    else if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
    return next;
  };

  const nextDueDate = calculateNextDue();

  const handleSave = async () => {
    if (!isValid) return;

    const newExpense: RecurringExpense = {
      id: Math.random().toString(36).substring(7),
      name: name,
      amount: parseFloat(amount),
      category: category!.name,
      categoryIcon: category!.icon,
      categoryColor: category!.color,
      frequency: frequency,
      startDate: startDate.toISOString(),
      nextDueDate: nextDueDate.toISOString(),
      isPaused: false,
    };

    await addRecurringExpense(newExpense);
    setShowSuccess(true);
  };

  const handleDatePress = () => {
    // For prototype, we'll just cycle through a few dates or show a message
    // In a real app, use DateTimePicker
    const tomorrow = new Date(startDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow);
  };

  if (showSuccess) {
    return (
      <SuccessScreen 
        title="Recurring Expense Added!"
        subtitle="Your recurring payment has been scheduled successfully."
        onDone={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Recurring Expense</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Label (Top) */}
          <View style={styles.dateGroup}>
            <Ionicons name="calendar-outline" size={16} color={PRIMARY_GREEN} />
            <Text style={styles.dateLabelText}>
              {new Date().toLocaleDateString('en-GB', { 
                weekday: 'short', 
                day: '2-digit', 
                month: 'short', 
                year: '2-digit' 
              })}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <InputField
              label="Amount"
              placeholder=""
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              prefix="₦"
              prefixStyle={styles.amountPrefix}
              containerStyle={styles.inputField}
              labelStyle={styles.fieldLabel}
              outerContainerStyle={styles.fieldGroup}
            />

            <InputField
              label="Expense Name"
              placeholder="e.g. MTN Data Subscription"
              value={name}
              onChangeText={setName}
              containerStyle={styles.inputField}
              labelStyle={styles.fieldLabel}
              outerContainerStyle={styles.fieldGroup}
            />

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setIsCategorySheetVisible(true)}
              style={styles.fieldGroup}
            >
              <InputField
                label="Category"
                placeholder="Choose a category"
                value={category?.name || ''}
                editable={false}
                pointerEvents="none"
                rightIcon={<Ionicons name="chevron-down" size={20} color="#9CA3AF" />}
                containerStyle={styles.inputField}
                labelStyle={styles.fieldLabel}
              />
            </TouchableOpacity>

            {/* Frequency Chips */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Repeats</Text>
              <View style={styles.frequencyRow}>
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.freqChip,
                      frequency === freq ? styles.activeFreqChip : styles.inactiveFreqChip
                    ]}
                    onPress={() => setFrequency(freq)}
                  >
                    <Text style={[
                      styles.freqChipText,
                      frequency === freq ? styles.activeFreqText : styles.inactiveFreqText
                    ]}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowFields}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleDatePress}
                style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}
              >
                <InputField
                  label="Starts on"
                  value={startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  editable={false}
                  pointerEvents="none"
                  rightIcon={<Ionicons name="calendar-outline" size={20} color={PRIMARY_GREEN} />}
                  containerStyle={styles.inputField}
                  labelStyle={styles.fieldLabel}
                />
              </TouchableOpacity>
              <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
                <InputField
                  label="Next due"
                  value={nextDueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  editable={false}
                  rightIcon={<Ionicons name="calendar-outline" size={20} color="#E5E7EB" />}
                  containerStyle={[styles.inputField, { backgroundColor: '#F9FAFB' }]}
                  labelStyle={styles.fieldLabel}
                />
              </View>
            </View>

            <InputField
              label="Note (optional)"
              placeholder=""
              value={note}
              onChangeText={setNote}
              multiline
              containerStyle={[styles.inputField, styles.textArea]}
              labelStyle={styles.fieldLabel}
              outerContainerStyle={styles.fieldGroup}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button 
          title="Add Recurring Expense"
          onPress={handleSave}
          variant="primary"
          disabled={!isValid}
          style={[styles.saveButton, !isValid && { opacity: 0.6 }]}
        />
      </View>

      <CategoryBottomSheet 
        isVisible={isCategorySheetVisible}
        type="expense"
        onClose={() => setIsCategorySheetVisible(false)}
        onSelect={setCategory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dateLabelText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#4B5563',
  },
  formSection: {
    gap: 0,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#374151',
    marginBottom: 8,
  },
  inputField: {
    height: 52,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  amountPrefix: {
    color: PRIMARY_GREEN,
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  freqChip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  activeFreqChip: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  inactiveFreqChip: {
    backgroundColor: WHITE,
    borderColor: '#E0E0E0',
  },
  freqChipText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  activeFreqText: {
    color: WHITE,
  },
  inactiveFreqText: {
    color: TEXT_SECONDARY,
  },
  rowFields: {
    flexDirection: 'row',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: BACKGROUND,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
  }
});
