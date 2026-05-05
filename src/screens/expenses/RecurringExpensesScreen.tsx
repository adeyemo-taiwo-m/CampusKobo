import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SecondaryHeader } from '../../components/SecondaryHeader';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  SPACING, 
  Fonts,
  BACKGROUND,
  RED,
  BORDER_GRAY
} from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { DarkCard } from '../../components/DarkCard';
import { Button } from '../../components/Button';
import { formatCurrency, getPercentage } from '../../utils/formatters';
import { RecurringExpense } from '../../types';

const { width } = Dimensions.get('window');

export default function RecurringExpensesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recurringExpenses, user, deleteRecurringExpense, pauseAllRecurring, resumeAllRecurring, updateRecurringExpense } = useAppContext();

  // Calculate sum of active recurring expenses only
  const activeRecurringExpenses = recurringExpenses.filter(r => !r.isPaused);
  const activeSum = activeRecurringExpenses.reduce((sum, item) => sum + item.amount, 0);

  const budgetLimit = user?.monthlyBudget || 100000;
  const progress = activeSum / budgetLimit;
  const progressPercent = Math.min(100, Math.round(progress * 100));

  const allPaused = recurringExpenses.length > 0 && recurringExpenses.every(r => r.isPaused);
  const showList = recurringExpenses.length > 0;

  const handleToggleState = () => {
    if (allPaused) {
      resumeAllRecurring();
    } else {
      pauseAllRecurring();
    }
  };

  const handleItemPress = (item: RecurringExpense) => {
    Alert.alert(
      item.name,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: item.isPaused ? 'Resume' : 'Pause', 
          onPress: () => updateRecurringExpense(item.id, { isPaused: !item.isPaused }) 
        },
        { text: 'Edit', onPress: () => router.push({
          pathname: '/expenses/add-recurring',
          params: { recurringExpense: JSON.stringify(item) }
        }) },
        { text: 'Delete', onPress: () => deleteRecurringExpense(item.id), style: 'destructive' },
      ]
    );
  };

  const renderItem = (item: RecurringExpense) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={styles.itemRow}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.categoryIcon as any} size={22} color="#E03A3A" />
        </View>
        <View style={styles.centerText}>
          <Text style={styles.itemCategoryName}>{item.name}</Text>
          <Text style={styles.itemFrequencyText}>
            {item.frequency === 'monthly' ? `Every month on the ${new Date(item.startDate).getDate()}th` : 
             item.frequency === 'weekly' ? 'Every week' : 'Every day'}
          </Text>
          <Text style={styles.itemNextDueText}>
            Next due : <Text style={styles.boldDate}>{new Date(item.nextDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.itemRight}>
        <View style={[
          styles.statusPill, 
          { backgroundColor: item.isPaused ? '#e5e5ea' : '#e8f5ee' }
        ]}>
          <Text style={[
            styles.statusPillText, 
            { color: item.isPaused ? '#6b7280' : '#1a7a3c' }
          ]}>
            {item.isPaused ? 'Paused' : 'Active'}
          </Text>
        </View>
        <Text style={styles.itemAmountText}>−{formatCurrency(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />
      <Stack.Screen options={{ headerShown: false }} />
      {/* ── Green Hero Region ─────────────────────── */}
      <View style={styles.heroRegion}>
        <SecondaryHeader title="Recurring Expenses" variant="light" />

        <View style={styles.summaryCardWrapper}>
          <DarkCard
            type="expenses"
            amount={activeSum}
            income={0}
            expenses={activeSum}
            hideIncomeExpenses={true}
            periodLabel="Recurring this month"
            progress={progress}
            statusCaption="This will be deducted automatically every month"
            progressLabel={`${getPercentage(activeSum, budgetLimit)}% of monthly budget taken`}
            style={styles.summaryCard}
          />
        </View>
      </View>

        {/* SECTION 4 — WHITE BOTTOM CARD */}
        <View style={styles.whiteCard}>
          {showList ? (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              <TouchableOpacity 
                style={styles.toggleStateButton}
                onPress={handleToggleState}
              >
                <Text style={styles.toggleStateText}>{allPaused ? 'Resume All' : 'Pause All'}</Text>
              </TouchableOpacity>

              {recurringExpenses.map(renderItem)}
            </ScrollView>
          ) : (
            /* STATE 3 — EMPTY STATE with asset image */
            <View style={styles.emptyState}>
                <View style={[styles.illustration, { backgroundColor: '#F0F9F4', borderRadius: 60, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }]}>
                   <Ionicons name="calendar-outline" size={60} color={PRIMARY_GREEN} />
                </View>
              <Text style={styles.emptyHeading}>No recurring expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Add bills that repeat automatically like data, transport or rent
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Button 
            title="Add Recurring Expense"
            onPress={() => router.push('/expenses/add-recurring')}
            variant="primary"
            style={styles.ctaButton}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  heroRegion: {
    backgroundColor: BACKGROUND,
    paddingBottom: 20,
  },
  summaryCardWrapper: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  summaryCard: {
    marginBottom: 0,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 100,
  },
  toggleStateButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#e8f5ee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 16,
    marginRight: 16,
    marginBottom: 12,
  },
  toggleStateText: {
    color: '#1a7a3c',
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  itemRow: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // shadow logic
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffe6e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  centerText: {
    flex: 1,
  },
  itemCategoryName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  itemFrequencyText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  itemNextDueText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
  },
  boldDate: {
    color: TEXT_PRIMARY,
    fontFamily: Fonts.bold,
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  itemAmountText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#E03A3A',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    marginBottom: 12,
  },
  emptyImage: {
    width: 220,
    height: 220,
  },
  emptyHeading: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginTop: 24,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 21,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: WHITE,
  },
  ctaButton: {
    height: 56,
    borderRadius: 16,
  }
});
