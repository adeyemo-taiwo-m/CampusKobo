import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// FIX 2026-04-25: Removed SafeAreaView wrapper — replaced with useSafeAreaInsets
// to manually apply only the top inset, preventing the auto-padding that was
// making the native header appear above our custom green hero header.
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
  const insets = useSafeAreaInsets();

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
      {/* FIX 2026-04-25: Hidden system StatusBar so it doesn't overlay the hero */}
      <StatusBar barStyle="light-content" backgroundColor="#0B5E2F" />

      {/* Green Hero Header — insets applied manually via useSafeAreaInsets */}
      <View style={[styles.headerHeroRegion, { paddingTop: insets.top + 10 }]}>
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

        {/* UPDATE 2026-04-25: DarkCard with budget type — renders category icon,
            amount/limit, progress bar, and remaining/days meta line via props */}
        <View style={styles.summaryCardWrapper}>
          <DarkCard
            type="budget"
            categoryName={budget.category}
            categoryIcon={budget.icon}
            amount={budget.spentAmount}
            limitAmount={budget.limitAmount}
            progress={progress}
            progressLabel={`₦${remaining.toLocaleString()} left • ${budget.daysLeft} days remaining`}
          />
        </View>
      </View>

      {/* White curved body */}
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
