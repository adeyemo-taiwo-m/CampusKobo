import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE, BORDER_GRAY, SURFACE_GREEN } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { useAppContext } from '../../src/context/AppContext';

const BUDGET_SUGGESTIONS = [
  { label: '₦20,000', value: 20000 },
  { label: '₦30,000', value: 30000 },
  { label: '₦50,000', value: 50000 },
  { label: '₦60,000', value: 60000 },
  { label: '₦80,000', value: 80000 },
];

export default function SetMonthlyBudgetScreen() {
  const router = useRouter();
  const { updateUser } = useAppContext();
  const [budget, setBudget] = useState('0');

  const handleContinue = () => {
    const amount = parseFloat(budget.replace(/[^0-9]/g, ''));
    updateUser({ monthlyBudget: amount });
    router.push('/onboarding/quick-setup');
  };

  const selectSuggestion = (value: number) => {
    setBudget(value.toString());
  };

  const formatCurrency = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, '');
    if (!cleanNumber) return '0';
    return parseInt(cleanNumber, 10).toLocaleString();
  };

  const handleInputChange = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, '');
    setBudget(cleanNumber);
  };

  const numericValue = parseInt(budget, 10) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={[styles.dot, i === 2 ? styles.activeDot : styles.inactiveDot]} />
              ))}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Set Your Monthly Budget</Text>
            <Text style={styles.subtitle}>How much do you plan to spend this month?</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={styles.amountInput}
                value={numericValue === 0 ? '' : numericValue.toLocaleString()}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={TEXT_SECONDARY}
                autoFocus
              />
            </View>

            <View style={styles.suggestionsContainer}>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {BUDGET_SUGGESTIONS.map((item) => {
                  const isSelected = numericValue === item.value;
                  return (
                    <TouchableOpacity 
                      key={item.value} 
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => selectSuggestion(item.value)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.helperBox}>
              <Ionicons name="bulb-outline" size={20} color={PRIMARY_GREEN} />
              <Text style={styles.helperText}>
                Most students set between ₦30,000 – ₦80,000
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="Continue" 
              onPress={handleContinue} 
              disabled={numericValue === 0}
            />
            <TouchableOpacity onPress={() => router.push('/onboarding/quick-setup')} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    padding: SPACING.LG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  backButton: {
    marginRight: SPACING.LG,
  },
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginRight: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: PRIMARY_GREEN,
    width: SPACING.LG,
  },
  inactiveDot: {
    backgroundColor: BORDER_GRAY,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    marginBottom: 60,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_GREEN,
    paddingBottom: SPACING.SM,
    marginHorizontal: SPACING.XL,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginRight: SPACING.XS,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    minWidth: 100,
  },
  suggestionsContainer: {
    marginTop: 40,
    marginBottom: SPACING.XL,
  },
  chipsScroll: {
    paddingVertical: SPACING.SM,
  },
  chip: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    marginRight: SPACING.SM,
    backgroundColor: WHITE,
  },
  selectedChip: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  chipText: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
  selectedChipText: {
    color: WHITE,
  },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: SPACING.MD,
    borderRadius: 12,
    marginTop: SPACING.MD,
  },
  helperText: {
    fontSize: FONT_SIZE.MD,
    color: PRIMARY_GREEN,
    marginLeft: SPACING.SM,
    fontWeight: '500',
  },
  footer: {
    marginTop: SPACING.XL,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  skipText: {
    color: TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
  },
});
