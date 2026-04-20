import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { SelectField } from '../../components/SelectField';
import { CategoryBottomSheet } from '../../components/CategoryBottomSheet';
import { useAppContext } from '../../context/AppContext';
import { Budget } from '../../types';

export const CreateBudgetScreen = () => {
  const router = useRouter();
  const { budget: budgetParam } = useLocalSearchParams();
  const { addBudget, updateBudget } = useAppContext();
  
  const editingBudget = budgetParam ? JSON.parse(budgetParam as string) as Budget : null;
  const isEditing = !!editingBudget;

  const [category, setCategory] = useState(editingBudget?.category || '');
  const [categoryIcon, setCategoryIcon] = useState(editingBudget?.categoryIcon || '');
  const [amount, setAmount] = useState(editingBudget?.limitAmount?.toString() || '');
  const [period, setPeriod] = useState<'monthly' | 'termly'>(editingBudget?.period || 'monthly');
  const [note, setNote] = useState(''); // Note field present in screenshots but not in type yet
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  const isFormValid = category.length > 0 && amount.length > 0;

  const handleSave = async () => {
    if (!isFormValid) return;

    const budgetData: Budget = {
      id: editingBudget?.id || Math.random().toString(36).substr(2, 9),
      category,
      categoryIcon: categoryIcon || 'wallet-outline',
      limitAmount: parseFloat(amount),
      spentAmount: editingBudget?.spentAmount || 0,
      period,
      startDate: editingBudget?.startDate || new Date().toISOString(),
      color: editingBudget?.color || PRIMARY_GREEN,
    };

    if (isEditing) {
      await updateBudget(budgetData.id, budgetData);
      router.back();
    } else {
      await addBudget(budgetData);
      router.push('/budget/success');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={isEditing ? "Edit Budget" : "Create Budget"} 
        showBack={true} 
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <SelectField
              label="Category"
              placeholder="Choose a category"
              value={category}
              onPress={() => setShowCategorySheet(true)}
            />

            <InputField
              label="Amount"
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              prefix="₦"
            />

            <View style={styles.periodSection}>
              <Text style={styles.label}>Period</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity 
                  style={[styles.chip, period === 'monthly' && styles.activeChip]}
                  onPress={() => setPeriod('monthly')}
                >
                  <Text style={[styles.chipText, period === 'monthly' && styles.activeChipText]}>Monthly</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.chip, period === 'termly' && styles.activeChip]}
                  onPress={() => setPeriod('termly')}
                >
                  <Text style={[styles.chipText, period === 'termly' && styles.activeChipText]}>Termly</Text>
                </TouchableOpacity>
              </View>
            </View>

            <InputField
              label="Starts on"
              value="October 2025"
              editable={false}
              rightIcon={<Ionicons name="calendar-outline" size={20} color="#9CA3AF" />}
            />

            <InputField
              label="Note (optional)"
              placeholder="Add a description..."
              value={note}
              onChangeText={setNote}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          title={isEditing ? "Save Changes" : "Create Budget"}
          onPress={handleSave}
          disabled={!isFormValid}
          variant="primary"
          fullWidth={true}
        />
      </View>

      <CategoryBottomSheet
        isVisible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelect={(cat) => {
          setCategory(cat.name);
          setCategoryIcon(cat.icon);
        }}
        type="expense"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    gap: 16,
  },
  periodSection: {
    marginBottom: 8,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    marginLeft: 2,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  activeChip: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  chipText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  activeChipText: {
    color: WHITE,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: WHITE,
  },
});

export default CreateBudgetScreen;
