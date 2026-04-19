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
  BORDER_GRAY 
} from '../../constants';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { CategoryBottomSheet } from '../../components/CategoryBottomSheet';
import { SuccessScreen } from '../../components/SuccessScreen';
import { useAppContext } from '../../context/AppContext';
import { Transaction } from '../../types';

export default function AddTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTransaction, updateTransaction } = useAppContext();
  
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
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [note, setNote] = useState(editTransaction?.description || ''); // Using description as placeholder for note if not exists
  
  // UI State
  const [isCategorySheetVisible, setIsCategorySheetVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = parseFloat(amount) > 0 && category !== null;

  const handleSave = async () => {
    if (!isFormValid) return;

    const transactionData: Transaction = {
      id: isEditMode ? editTransaction.id : Math.random().toString(36).substring(7),
      amount: parseFloat(amount),
      type: type,
      category: category!.name,
      categoryIcon: category!.icon,
      categoryColor: category!.color,
      description: description || category!.name,
      date: isEditMode ? editTransaction.date : new Date().toISOString(),
      isRecurring: isEditMode ? editTransaction.isRecurring : false,
    };

    if (isEditMode) {
      await updateTransaction(editTransaction.id, transactionData);
      router.back();
    } else {
      await addTransaction(transactionData);
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <SuccessScreen 
        title={`${type === 'expense' ? 'Expense' : 'Income'} Added!`}
        subtitle="Your transaction has been recorded successfully."
        onDone={() => router.push('/(tabs)')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
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
          showsVerticalScrollIndicator={false}
        >
          {/* Date Display */}
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={18} color={PRIMARY_GREEN} />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-GB', { 
                weekday: 'short', 
                day: '2-digit', 
                month: 'short', 
                year: '2-digit' 
              })}
            </Text>
          </View>

          {/* Toggle Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={styles.tabItem}
              onPress={() => setType('expense')}
            >
              <View style={[
                styles.tabIndicator, 
                { backgroundColor: type === 'expense' ? PRIMARY_GREEN : '#E5E7EB' }
              ]} />
              <Text style={[
                styles.tabLabel,
                { color: type === 'expense' ? TEXT_PRIMARY : TEXT_SECONDARY }
              ]}>Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabItem}
              onPress={() => setType('income')}
            >
              <View style={[
                styles.tabIndicator, 
                { backgroundColor: type === 'income' ? PRIMARY_GREEN : '#E5E7EB' }
              ]} />
              <Text style={[
                styles.tabLabel,
                { color: type === 'income' ? TEXT_PRIMARY : TEXT_SECONDARY }
              ]}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              prefix="₦"
              style={styles.amountInput}
            />

            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setIsCategorySheetVisible(true)}
            >
              <InputField
                label="Category"
                placeholder="Choose a category"
                value={category?.name || ''}
                onChangeText={() => {}} // Read only
                editable={false}
                pointerEvents="none"
                rightIcon={<Ionicons name="chevron-down" size={20} color={TEXT_SECONDARY} />}
              />
            </TouchableOpacity>

            <InputField
              label="Description"
              placeholder="e.g. Lunch at Optop kitchen"
              value={description}
              onChangeText={setDescription}
            />

            <InputField
              label="Note (optional)"
              placeholder="Add a note..."
              value={note}
              onChangeText={setNote}
              multiline
              style={styles.noteInput}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button 
          title={isEditMode ? 'Save Changes' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
          onPress={handleSave}
          disabled={!isFormValid}
          variant="primary"
        />
      </View>

      <CategoryBottomSheet 
        isVisible={isCategorySheetVisible}
        onClose={() => setIsCategorySheetVisible(false)}
        onSelect={(cat) => setCategory(cat)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginBottom: SPACING.XL,
  },
  dateText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: SPACING.XL,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  form: {
    gap: SPACING.MD,
  },
  amountInput: {
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  footer: {
    padding: SPACING.LG,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.LG,
  }
});
