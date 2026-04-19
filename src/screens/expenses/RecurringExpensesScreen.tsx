import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
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
import { RecurringExpense } from '../../types';

const { width } = Dimensions.get('window');

export default function RecurringExpensesScreen() {
  const router = useRouter();
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
        { text: 'Edit', onPress: () => Alert.alert('Coming Soon', 'Editing recurring expenses is coming soon.') },
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
            {item.frequency === 'monthly' ? 'Every month on the 10th' : 
             item.frequency === 'weekly' ? 'Every week' : 'Every day'}
          </Text>
          <Text style={styles.itemNextDueText}>
            Next due : <Text style={styles.boldDate}>{new Date(item.nextDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
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
        <Text style={styles.itemAmountText}>−₦{item.amount.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* SECTION 2 — NAVIGATION BAR */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recurring Expenses</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mainContainer}>
        {/* SECTION 3 — SUMMARY CARD using DarkCard */}
        <DarkCard
          type="expenses"
          amount={activeSum}
          income={0}
          expenses={activeSum}
          hideIncomeExpenses={true}
          periodLabel="Recurring this month"
          progress={progress}
          statusCaption="This will be deducted automatically every month"
          progressLabel={`${progressPercent}% of monthly budget taken`}
          style={styles.summaryCard}
        />

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
              <View style={styles.illustrationContainer}>
                 <Image 
                   source={require("../../../assets/images/no-recurring.svg")} 
                   style={styles.emptyImage}
                   contentFit="contain"
                 />
              </View>
              <Text style={styles.emptyHeading}>No recurring expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Add bills that repeat automatically like data, transport or rent
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* SECTION 5 — BOTTOM CTA BUTTON */}
      <View style={styles.footer}>
        <Button 
          title="Add Recurring Expense"
          onPress={() => router.push('/expenses/add-recurring')}
          variant="primary"
          style={styles.ctaButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
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
    backgroundColor: '#16773d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  mainContainer: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 12,
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
