import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';
import { DarkCard } from '../../components/DarkCard';
import { Button } from '../../components/Button';
import { TransactionCard } from '../../components/TransactionCard';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { useAppContext } from '../../context/AppContext';

export const BudgetDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { budgets, transactions: allTransactions, deleteBudget } = useAppContext();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDelete = async () => {
    if (id) {
      await deleteBudget(id as string);
      setShowDeleteModal(false);
      router.back();
    }
  };

  // Find budget from context
  const foundBudget = budgets.find(b => b.id === id);

  // Icon Mapping function
  const getIconForCategory = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category.toLowerCase()) {
      case 'food': return 'restaurant-outline';
      case 'data & airtime':
      case 'airtime':
      case 'data': return 'wifi-outline';
      case 'transport': return 'car-outline';
      case 'shopping': return 'cart-outline';
      case 'medical':
      case 'health': return 'heart-outline';
      default: return 'wallet-outline';
    }
  };

  if (!foundBudget) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Budget not found</Text>
      </View>
    );
  }

  const budget = {
    ...foundBudget,
    icon: getIconForCategory(foundBudget.category),
    daysLeft: 6, // Mock for now
  };

  const progress = budget.spentAmount / budget.limitAmount;
  const percent = Math.round(progress * 100);
  const remaining = budget.limitAmount - budget.spentAmount;

  // Filter transactions for this budget's category
  const transactions = allTransactions.filter(
    t => t.category.toLowerCase() === budget.category.toLowerCase()
  );

  // Derived stats
  const daysElapsed = 30 - budget.daysLeft;
  const dailyAverage = daysElapsed > 0 ? Math.round(budget.spentAmount / daysElapsed) : 0;
  const highestSpend = transactions.reduce((max, t) => {
    const amt = Math.abs(t.amount);
    return amt > max ? amt : max;
  }, 0);

  return (
    <View style={styles.container}>

      {/* Green Hero Header */}
      <View style={styles.headerHeroRegion}>
        <SafeAreaView>
          {/* Top nav row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn}>
              <Ionicons name="chevron-back" size={20} color={WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Budget Details</Text>
            <Button
              title="Edit"
              variant="secondary"
              size="sm"
              fullWidth={false}
              textStyle={{ color: PRIMARY_GREEN }}
              onPress={() =>
                router.push({
                  pathname: '/budget/create',
                  params: { budget: JSON.stringify(budget) },
                })
              }
            />
          </View>

          {/* Summary DarkCard */}
          <View style={styles.summaryCardWrapper}>
            <DarkCard type="budget">
              <View style={styles.darkCardInner}>
                {/* Category icon + name */}
                <View style={styles.catHeaderRow}>
                  <View style={styles.iconCircleSmall}>
                    <Ionicons name={budget.icon as any} size={18} color="#27AE60" />
                  </View>
                  <Text style={styles.catName}>{budget.category}</Text>
                </View>

                {/* Spent / Limit */}
                <View style={styles.amountRow}>
                  <Text style={styles.spentAmount}>₦{budget.spentAmount.toLocaleString()}</Text>
                  <Text style={styles.limitAmountText}> / ₦{budget.limitAmount.toLocaleString()}</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressRow}>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(100, percent)}%` }]} />
                  </View>
                  <Text style={styles.percentText}>{percent}%</Text>
                </View>

                {/* Meta */}
                <Text style={styles.metaLine}>
                  ₦{remaining.toLocaleString()} left • {budget.daysLeft} days remaining
                </Text>
              </View>
            </DarkCard>
          </View>
        </SafeAreaView>
      </View>

      {/* White curved body */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>

          {/* Mini Stat Cards */}
          <View style={styles.miniStatsGrid}>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatLabel}>Daily Average</Text>
              <Text style={styles.miniStatValue}>
                ₦{dailyAverage.toLocaleString()}
              </Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatLabel}>Highest Spent</Text>
              <Text style={styles.miniStatValue}>
                ₦{highestSpend.toLocaleString()}
              </Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatLabel}>Days left</Text>
              <Text style={styles.miniStatValue}>{budget.daysLeft} days</Text>
            </View>
          </View>

          {/* Status Alert Card */}
          <View
            style={[
              styles.statusCard,
              percent > 90
                ? styles.statusRed
                : percent > 70
                ? styles.statusYellow
                : styles.statusGreen,
            ]}
          >
            <Ionicons
              name={
                percent > 90
                  ? 'warning'
                  : percent > 70
                  ? 'warning-outline'
                  : 'checkmark-circle'
              }
              size={18}
              color={percent > 90 ? '#EF4444' : percent > 70 ? '#F59E0B' : '#10B981'}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.statusText,
                percent > 90
                  ? styles.textRed
                  : percent > 70
                  ? styles.textYellow
                  : styles.textGreen,
              ]}
            >
              {percent > 90
                ? "You've almost exceeded your budget! 🚨"
                : percent > 70
                ? "You're getting close to your limit ⚠️"
                : `You're on track with your ${budget.category} budget 👍`}
            </Text>
          </View>

          {/* Transaction List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{budget.category} Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {transactions.length === 0 ? (
              <Text style={styles.emptyText}>No transactions in this category yet.</Text>
            ) : (
              transactions.map((t: any) => (
                <TransactionCard key={t.id} transaction={t} />
              ))
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                router.push({
                  pathname: '/budget/create',
                  params: { budget: JSON.stringify(budget) },
                })
              }
            >
              <Text style={styles.editBtnText}>Edit Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setShowDeleteModal(true)}
            >
              <Text style={styles.deleteBtnText}>Delete Budget</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      <DeleteConfirmModal
        isVisible={showDeleteModal}
        title="Delete Budget?"
        message={`Are you sure you want to delete your ${budget.category} budget? This action cannot be undone.`}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  // ── Header Hero ─────────────────────────────
  headerHeroRegion: {
    backgroundColor: '#0B5E2F',
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: WHITE,
  },


  // ── DarkCard ────────────────────────────────
  summaryCardWrapper: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  darkCardInner: {
    paddingVertical: 4,
  },
  catHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircleSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  catName: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: WHITE,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  spentAmount: {
    fontFamily: Fonts.bold,
    fontSize: 30,
    color: WHITE,
  },
  limitAmountText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6EE7B7',
    borderRadius: 4,
  },
  percentText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: WHITE,
    minWidth: 32,
    textAlign: 'right',
  },
  metaLine: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },

  // ── Curved white body ────────────────────────
  mainContent: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: BACKGROUND,
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 48,
  },

  // ── Mini Stat Cards ──────────────────────────
  miniStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
    gap: 8,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: WHITE,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  miniStatLabel: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: TEXT_SECONDARY,
    marginBottom: 6,
    textAlign: 'center',
  },
  miniStatValue: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },

  // ── Status Card ──────────────────────────────
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 22,
  },
  statusGreen: { backgroundColor: '#F0FDF4' },
  statusYellow: { backgroundColor: '#FFFBEB' },
  statusRed: { backgroundColor: '#FEF2F2' },
  statusText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  textGreen: { color: '#16A34A' },
  textYellow: { color: '#D97706' },
  textRed: { color: '#DC2626' },

  // ── Transactions ─────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  viewAllText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  transactionList: {
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingVertical: 24,
  },

  // ── Bottom Buttons ───────────────────────────
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: WHITE,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: '#EF4444',
  },
});

export default BudgetDetailScreen;
