import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
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
import { SuccessModal } from '../../components/SuccessScreen';
import { useAppContext } from '../../context/AppContext';
import { Budget } from '../../types';

// Period options for the bottom sheet
const PERIOD_OPTIONS = ['Monthly', 'Termly'];

export const CreateBudgetScreen = () => {
  const router = useRouter();
  const { budget: budgetParam } = useLocalSearchParams();
  const { addBudget, updateBudget } = useAppContext();
  
  const editingBudget = budgetParam ? JSON.parse(budgetParam as string) as Budget : null;
  const isEditing = !!editingBudget;

  const [category, setCategory] = useState(editingBudget?.category || '');
  const [categoryIcon, setCategoryIcon] = useState(editingBudget?.categoryIcon || '');
  const [amount, setAmount] = useState(
    editingBudget?.limitAmount 
      ? editingBudget.limitAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
      : ''
  );
  const [period, setPeriod] = useState(
    editingBudget?.period 
      ? editingBudget.period.charAt(0).toUpperCase() + editingBudget.period.slice(1) 
      : 'Monthly'
  );
  const [startsOn] = useState('October 2025');
  const [note, setNote] = useState('');
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showPeriodSheet, setShowPeriodSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = category.length > 0 && amount.length > 0;

  const handleSave = async () => {
    if (!isFormValid) return;

    const budgetData: Budget = {
      id: editingBudget?.id || Math.random().toString(36).substr(2, 9),
      category,
      categoryIcon: categoryIcon || 'wallet-outline',
      limitAmount: parseFloat(amount.replace(/,/g, '')),
      spentAmount: editingBudget?.spentAmount || 0,
      period: (period.toLowerCase() as 'monthly' | 'termly') || 'monthly',
      startDate: editingBudget?.startDate || new Date().toISOString(),
      color: editingBudget?.color || PRIMARY_GREEN,
    };

    if (isEditing) {
      await updateBudget(budgetData.id, budgetData);
      router.back();
    } else {
      await addBudget(budgetData);
      setShowSuccess(true);
    }
  };

  // Format the amount with commas as the user types
  const handleAmountChange = (text: string) => {
    // Strip non-numeric characters except dots
    const cleaned = text.replace(/[^0-9.]/g, '');
    if (cleaned === '') {
      setAmount('');
      return;
    }
    // Format with commas
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(parts.join('.'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={isEditing ? "Edit Budget" : "Create Budget"} 
        showBack={true} 
        onBack={() => router.back()}
      />

      {/* Success Modal — overlays the form */}
      <SuccessModal 
        isVisible={showSuccess}
        title={isEditing ? "Budget edited successfully" : "Budget created successfully"}
        subtitle=""
        onDone={() => {
          setShowSuccess(false);
          router.push('/(tabs)/budget');
        }}
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            
            {/* Category Field */}
            <SelectField
              label="Category"
              placeholder="Choose a category"
              value={category || undefined}
              onPress={() => setShowCategorySheet(true)}
              state={category ? 'active' : 'default'}
            />

            {/* Amount Field */}
            <InputField
              label="Amount"
              placeholder="₦"
              value={amount ? `₦${amount}` : ''}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              state={amount ? 'active' : 'default'}
            />

            {/* Period Field — dropdown style matching screenshots */}
            <SelectField
              label="Period"
              placeholder="e.g. Monthly"
              value={period || undefined}
              onPress={() => setShowPeriodSheet(true)}
              state={period ? 'active' : 'default'}
            />

            {/* Starts On Field */}
            <InputField
              label="Starts on"
              placeholder="e.g. 1 October 2025"
              value={startsOn}
              onChangeText={() => {}}
              editable={false}
              state={startsOn ? 'active' : 'default'}
            />

            {/* Note Field */}
            <InputField
              label="Note (optional)"
              placeholder="Excited to create my first budget..."
              value={note}
              onChangeText={setNote}
              multiline={true}
              numberOfLines={3}
              state={note ? 'active' : 'default'}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <Button
          title={isEditing ? "Save Changes" : "Create Budget"}
          onPress={handleSave}
          disabled={!isFormValid}
          variant="primary"
          fullWidth={true}
        />
      </View>

      {/* Category Bottom Sheet */}
      <CategoryBottomSheet
        isVisible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelect={(cat) => {
          setCategory(cat.name);
          setCategoryIcon(cat.icon);
        }}
        type="expense"
      />

      {/* Period Bottom Sheet */}
      <Modal
        visible={showPeriodSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPeriodSheet(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPeriodSheet(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                <View style={styles.sheetHeader}>
                  <View style={{ width: 24 }} />
                  <Text style={styles.sheetTitle}>Choose Period</Text>
                  <TouchableOpacity onPress={() => setShowPeriodSheet(false)}>
                    <Ionicons name="arrow-forward" size={24} color={TEXT_PRIMARY} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.periodOptions}>
                  {PERIOD_OPTIONS.map((option) => (
                    <TouchableOpacity 
                      key={option}
                      style={[
                        styles.periodOption,
                        period === option && styles.periodOptionActive,
                      ]} 
                      onPress={() => {
                        setPeriod(option);
                        setShowPeriodSheet(false);
                      }}
                    >
                      <View style={[
                        styles.periodIconWrapper,
                        period === option && styles.periodIconWrapperActive,
                      ]}>
                        <Ionicons 
                          name={option === 'Monthly' ? 'calendar-outline' : 'school-outline'} 
                          size={20} 
                          color={PRIMARY_GREEN} 
                        />
                      </View>
                      <Text style={[
                        styles.periodOptionText,
                        period === option && styles.periodOptionTextActive,
                      ]}>{option}</Text>
                      {period === option && (
                        <Ionicons name="checkmark-circle" size={22} color={PRIMARY_GREEN} style={{ marginLeft: 'auto' }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    gap: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: WHITE,
  },
  // Period bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 18,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semiBold,
  },
  periodOptions: {
    gap: 12,
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  periodOptionActive: {
    backgroundColor: '#E7F5ED',
    borderWidth: 1.5,
    borderColor: PRIMARY_GREEN,
  },
  periodIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  periodIconWrapperActive: {
    backgroundColor: WHITE,
  },
  periodOptionText: {
    fontSize: 16,
    color: '#4B5563',
    fontFamily: Fonts.medium,
  },
  periodOptionTextActive: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.semiBold,
  },
});

export default CreateBudgetScreen;
