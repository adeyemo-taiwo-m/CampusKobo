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
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { SuccessModal } from '../../components/SuccessScreen';
import { Toast } from '../../components/Toast';
import { CategoryBottomSheet } from '../../components/CategoryBottomSheet';
import { useToast } from '../../hooks/useToast';
import { useAppContext } from '../../context/AppContext';
import { Transaction } from '../../types';

export default function AddTransactionScreen() {
  if (__DEV__) console.log('🚀 AddTransactionScreen Component Rendered');
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTransaction, updateTransaction } = useAppContext();
  const { toastProps, showToast } = useToast();
  
  // Edit mode check
  const editTransaction = params.transaction ? JSON.parse(params.transaction as string) as Transaction : null;
  const isEditMode = !!editTransaction;

  // Form State
  const [type, setType] = useState<'expense' | 'income'>(editTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editTransaction?.amount.toString() || '');
  const [category, setCategory] = useState<{name: string, icon: string, color: string} | null>(
    editTransaction ? { 
      name: editTransaction.category, 
      icon: editTransaction.categoryIcon, 
      color: editTransaction.categoryColor 
    } : null
  );
  const [description, setDescription] = useState(editTransaction?.description || '');  const [customCategoryName, setCustomCategoryName] = useState('');
  
  // UI & Validation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCategorySheetVisible, setIsCategorySheetVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const handleSave = async () => {
    if (__DEV__) console.log('💾 handleSave started. isEditMode:', isEditMode);
    if (isProcessing) return;

    // Basic validation
    const errors: Record<string, boolean> = {};
    const cleanAmount = amount.replace(/[^0-9.]/g, ''); // Strip commas, currency, etc.
    const parsedAmount = parseFloat(cleanAmount);

    if (__DEV__) console.log('📊 Validation check:', { amount, cleanAmount, parsedAmount, category: category?.name });

    if (!cleanAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = true;
      if (__DEV__) console.warn('❌ Validation failed: Invalid amount');
    }
    if (!category) {
      errors.category = true;
      if (__DEV__) console.warn('❌ Validation failed: No category selected');
    }
    if (category?.name === 'Others' && !customCategoryName) {
      errors.customCategory = true;
      if (__DEV__) console.warn('❌ Validation failed: Custom category name missing');
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsProcessing(true);
    try {
      const transactionData: Transaction = {
        id: isEditMode ? editTransaction.id : Math.random().toString(36).substring(7),
        amount: parsedAmount,
        type: type,
        category: category?.name === 'Others' ? customCategoryName : category!.name,
        categoryIcon: category!.icon,
        categoryColor: category!.color,
        description: description || (category?.name === 'Others' ? customCategoryName : category!.name),
        note: description,
        date: isEditMode ? editTransaction.date : new Date().toISOString(),
        isRecurring: isEditMode ? editTransaction.isRecurring : false,
      };

      if (__DEV__) console.log('📦 Sending to sync:', transactionData);

      if (isEditMode) {
        await updateTransaction(editTransaction.id, transactionData);
        if (__DEV__) console.log('✨ updateTransaction finished');
        setShowSuccess(true);
      } else {
        await addTransaction(transactionData);
        if (__DEV__) console.log('✨ addTransaction finished');
        setShowSuccess(true);
      }
    } catch (error) {
      if (__DEV__) console.error('🔥 handleSave error:', error);
      showToast("Failed to save transaction. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Success Modal */}
      <SuccessModal 
        isVisible={showSuccess}
        title={isEditMode ? 'Changes Saved!' : `${type === 'expense' ? 'Expense' : 'Income'} Added!`}
        subtitle={isEditMode ? 'Your transaction details have been updated.' : 'Your transaction has been recorded successfully.'}
        onDone={() => {
          setShowSuccess(false);
          isEditMode ? router.back() : router.push('/(tabs)');
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
        </Text>
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
          {/* Date Group */}
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

          {/* Toggle Tabs (Dot style) */}
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={styles.radioButton} 
              onPress={() => setType('expense')}
            >
              <View style={[
                styles.dot, 
                type === 'expense' ? styles.activeDot : styles.inactiveDot
              ]} />
              <Text style={[
                styles.radioLabel, 
                type === 'expense' ? styles.activeRadioLabel : styles.inactiveRadioLabel
              ]}>Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.radioButton} 
              onPress={() => setType('income')}
            >
              <View style={[
                styles.dot, 
                type === 'income' ? styles.activeDot : styles.inactiveDot
              ]} />
              <Text style={[
                styles.radioLabel, 
                type === 'income' ? styles.activeRadioLabel : styles.inactiveRadioLabel
              ]}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <InputField
              label="Amount"
              placeholder=""
              value={amount}
              onChangeText={(val) => {
                setAmount(val);
                if (validationErrors.amount) setValidationErrors({...validationErrors, amount: false});
              }}
              keyboardType="numeric"
              prefix="₦"
              prefixStyle={styles.amountPrefix}
              containerStyle={[styles.inputField, validationErrors.amount && styles.errorField]}
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
                containerStyle={[styles.inputField, validationErrors.category && styles.errorField]}
                labelStyle={styles.fieldLabel}
                outerContainerStyle={{ marginBottom: category?.name === 'Others' ? 12 : 20 }}
              />
            </TouchableOpacity>

            {category?.name === 'Others' && (
              <InputField
                label="Specify Category"
                placeholder="e.g. Club Dues"
                value={customCategoryName}
                onChangeText={(val) => {
                  setCustomCategoryName(val);
                  if (validationErrors.customCategory) setValidationErrors({...validationErrors, customCategory: false});
                }}
                containerStyle={[styles.inputField, validationErrors.customCategory && styles.errorField]}
                labelStyle={styles.fieldLabel}
                outerContainerStyle={styles.fieldGroup}
                autoFocus
              />
            )}

            <InputField
              label="Description (e.g. Lunch with friends)"
              placeholder=""
              value={description}
              onChangeText={setDescription}
              containerStyle={styles.inputField}
              labelStyle={styles.fieldLabel}
              outerContainerStyle={styles.fieldGroup}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button 
          title={isEditMode ? 'Save Changes' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
          onPress={handleSave}
          variant="primary"
          loading={isProcessing}
          style={styles.saveButton}
        />
      </View>

      <CategoryBottomSheet 
        isVisible={isCategorySheetVisible}
        type={type}
        onClose={() => setIsCategorySheetVisible(false)}
        onSelect={(cat) => {
          setCategory(cat);
          if (validationErrors.category) setValidationErrors({...validationErrors, category: false});
        }}
      />
      <Toast {...toastProps} />
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    marginBottom: 32,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
  activeDot: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  inactiveDot: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  activeRadioLabel: {
    color: TEXT_PRIMARY,
  },
  inactiveRadioLabel: {
    color: '#9CA3AF',
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
  errorField: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  amountPrefix: {
    color: PRIMARY_GREEN,
    fontSize: 18,
    fontFamily: Fonts.semiBold,
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
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: BACKGROUND,
    zIndex: 9999,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
  }
});
