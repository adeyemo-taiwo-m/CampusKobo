import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE, BORDER_GRAY, Fonts } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { InputField } from '../../src/components/InputField';
import { CategoryBottomSheet } from '../../src/components/CategoryBottomSheet';
import { useAppContext } from '../../src/context/AppContext';

export default function FirstExpenseScreen() {
  const router = useRouter();
  const { addTransaction } = useAppContext();
  
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [note, setNote] = useState('');
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const handleSave = () => {
    if (!amount || !selectedCategory) return;

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      type: 'expense' as const,
      category: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      description: note || `Expense for ${selectedCategory.name}`,
      date: new Date().toISOString(),
      isRecurring: false,
    };

    addTransaction(transaction);
    router.replace('/onboarding/success');
  };

  const numericAmount = parseFloat(amount) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={[styles.dot, i === 4 ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Log Your First Expense</Text>
          <Text style={styles.subtitle}>Start tracking right now — it only takes a few seconds</Text>

          <View style={styles.amountContainer}>
             <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={TEXT_SECONDARY}
              />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity 
              style={styles.categorySelector}
              onPress={() => setIsSheetVisible(true)}
            >
              <View style={styles.selectorLeft}>
                {selectedCategory ? (
                   <View style={[styles.iconBox, { backgroundColor: selectedCategory.color + '20' }]}>
                    <Ionicons name={selectedCategory.icon} size={20} color={selectedCategory.color} />
                  </View>
                ) : (
                  <View style={styles.iconBox}>
                    <Ionicons name="grid-outline" size={20} color={TEXT_SECONDARY} />
                  </View>
                )}
                <Text style={[styles.selectorText, !selectedCategory && { color: TEXT_SECONDARY }]}>
                  {selectedCategory ? selectedCategory.name : 'Select category'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={TEXT_SECONDARY} />
            </TouchableOpacity>

            <InputField 
              label="Note (Optional)" 
              placeholder="e.g. Lunch at Optop kitchen" 
              value={note} 
              onChange={setNote}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Save Expense" 
            onPress={handleSave} 
            disabled={numericAmount === 0 || !selectedCategory}
          />
          <TouchableOpacity onPress={() => router.replace('/onboarding/success')} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CategoryBottomSheet 
        isVisible={isSheetVisible} 
        onClose={() => setIsSheetVisible(false)}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setIsSheetVisible(false);
        }}
      />
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
    fontFamily: Fonts.semiBold,
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    marginBottom: 40,
    fontFamily: Fonts.regular,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginRight: SPACING.XS,
    fontFamily: Fonts.semiBold,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    minWidth: 80,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
    paddingHorizontal: SPACING.SM,
    fontFamily: Fonts.semiBold,
  },
  form: {
    gap: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_SECONDARY,
    marginBottom: -SPACING.SM,
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    paddingHorizontal: SPACING.MD,
    backgroundColor: '#F9FAFB',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.SM,
  },
  selectorText: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_PRIMARY,
    fontWeight: '500',
    fontFamily: Fonts.medium,
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
    fontFamily: Fonts.medium,
  },
});
