import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
  BACKGROUND,
} from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { DarkCard } from "../../components/DarkCard";
import { ProgressBar } from "../../components/ProgressBar";
import { TransactionCard } from "../../components/TransactionCard";
import { EmptyState } from "../../components/EmptyState";
import { AddFundsBottomSheet } from "../../components/AddFundsBottomSheet";

export default function DashboardScreen() {
  const router = useRouter();
  const { user, transactions, budgets, savingsGoals } = useAppContext();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isAddFundsVisible, setIsAddFundsVisible] = useState(false);
  console.log(transactions);

  // Helper Functions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [transactions, currentMonth, currentYear]);

  const totalIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const totalExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const totalBalance = totalIncome - totalExpenses;

  const budgetTotal = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  }, [budgets]);

  const budgetSpent = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  }, [budgets]);

  const budgetProgress = budgetTotal > 0 ? budgetSpent / budgetTotal : 0;

  const getDaysLeftInMonth = () => {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    return lastDay - now.getDate();
  };

  const primaryGoal = savingsGoals.length > 0 ? savingsGoals[0] : null;

  const initials = useMemo(() => {
    if (!user?.name) return "CK";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header Area */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.profileSection}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={styles.avatar}>
                <Image
                  source={require("../../../assets/images/avatar.jpeg")}
                  style={styles.avatarImage}
                />
              </View>
              <Text style={styles.welcomeText}>Hi, Taiwo</Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/(tabs)/learning")}
              >
                <Ionicons name="school-outline" size={24} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/profile/notifications")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={WHITE}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card Section */}
          <DarkCard
            type="balance"
            amount={totalBalance}
            income={totalIncome}
            expenses={totalExpenses}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            style={styles.balanceCard}
          />
        </SafeAreaView>
      </View>

      <View style={styles.mainContentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Date Filter Bar */}
        <View style={styles.dateFilter}>
          <TouchableOpacity style={styles.dateSelector}>
            <Text style={styles.dateText}>OCTOBER 2025</Text>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={TEXT_SECONDARY}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
          {transactions.length > 0 && (
            <>
              <View style={styles.vDivider} />
              <View style={styles.growthBadge}>
                <Ionicons name="arrow-up" size={14} color="#10B981" />
                <Text style={styles.growthText}>12% vs Last month</Text>
              </View>
            </>
          )}
        </View>

        {/* Section 2 — Budget Overview */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget</Text>
            {budgets.length > 0 && (
              <Text style={styles.percentageText}>
                {Math.round(budgetProgress * 100)}%
              </Text>
            )}
          </View>

          {budgets.length > 0 ? (
            <TouchableOpacity onPress={() => router.push("/(tabs)/budget")}>
              <View style={styles.amountRowBaseline}>
                <Text style={styles.budgetValue}>
                  ₦{budgetSpent.toLocaleString()}
                </Text>
                <Text style={styles.budgetTotal}>
                  /₦{budgetTotal.toLocaleString()}
                </Text>
              </View>
              <ProgressBar progress={budgetProgress} />
              <View style={styles.budgetFooter}>
                <Text style={styles.budgetLeft}>
                  ₦{(budgetTotal - budgetSpent).toLocaleString()} left
                </Text>
                <Text style={styles.budgetStatus}> • You are doing well</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyCardContent}>
              <Text style={styles.emptyCardTitle}>No budget set yet</Text>
              <Text style={styles.emptyCardSubtitle}>
                Set a budget to track your spending
              </Text>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => router.push("/budget/create")}
              >
                <Text style={styles.primaryActionBtnText}>Create Budget</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 3 — Savings Progress */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Savings Progress</Text>
          </View>

          {primaryGoal ? (
            <TouchableOpacity onPress={() => router.push("/(tabs)/savings")}>
              <View style={styles.savingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalName}>{primaryGoal.name}</Text>
                  <View style={styles.amountRowBaseline}>
                    <Text style={styles.goalAmount}>
                      ₦{primaryGoal.savedAmount.toLocaleString()}
                    </Text>
                    <Text style={styles.goalTarget}>
                      /₦{primaryGoal.targetAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressRingContainer}>
                  <View
                    style={[
                      styles.circularProgress,
                      { borderColor: "#E8F5E9" },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressArc,
                        { transform: [{ rotate: "45deg" }] },
                      ]}
                    />
                    <Text style={styles.circleText}>
                      {Math.round(
                        (primaryGoal.savedAmount / primaryGoal.targetAmount) *
                          100,
                      )}
                      %
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => setIsAddFundsVisible(true)}
              >
                <Text style={styles.primaryActionBtnText}>Add funds</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyCardContent}>
              <Text style={styles.emptyCardTitle}>No savings goal yet</Text>
              <Text style={styles.emptyCardSubtitle}>
                Start saving towards something important
              </Text>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => router.push("/savings/create")}
              >
                <Text style={styles.primaryActionBtnText}>Start Saving</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 4 — Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleLabel}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/expenses")}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {transactions.length > 0 ? (
            transactions
              .slice(0, 5)
              .map((t) => (
                <TransactionCard
                  key={t.id}
                  transaction={t}
                  onPress={() => router.push(`/transaction/${t.id}`)}
                />
              ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsText}>
                No transactions yet
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {transactions.length === 0 && (
        <View style={styles.fabTooltip}>
          <Text style={styles.tooltipText}>Add your first expense</Text>
          <View style={styles.tooltipArrow} />
        </View>
      )}
        {/* Add Funds Bottom Sheet */}
        {primaryGoal && (
          <AddFundsBottomSheet
            visible={isAddFundsVisible}
            goal={primaryGoal}
            onClose={() => setIsAddFundsVisible(false)}
            onSuccess={() => {
              // Success handled by sheet overlay
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  headerBackground: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: SPACING.LG,
  },
  mainContentWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.SM,
  },
  avatarText: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 14,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 18,
  },
  headerActions: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    marginHorizontal: SPACING.LG,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
  },
  dateFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.LG,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontFamily: Fonts.semiBold,
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  growthText: {
    fontFamily: Fonts.medium,
    color: "#10B981",
    fontSize: 13,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: SPACING.LG,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  sectionTitleLabel: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  percentageText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    opacity: 0.6,
  },
  amountRowBaseline: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  budgetValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: TEXT_PRIMARY,
  },
  budgetTotal: {
    fontSize: 18,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
    opacity: 0.7,
  },
  budgetFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  budgetLeft: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  budgetStatus: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    opacity: 0.6,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  goalName: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  goalAmount: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: TEXT_PRIMARY,
  },
  goalTarget: {
    fontSize: 18,
    color: "#D1D5DB",
    fontFamily: Fonts.medium,
  },
  progressRingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  progressArc: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: PRIMARY_GREEN,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  circleText: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: PRIMARY_GREEN,
  },
  primaryActionBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryActionBtnText: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 16,
  },
  emptyCardContent: {
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  emptyCardTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: "left",
  },
  emptyCardSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "left",
    marginBottom: 24,
    opacity: 0.7,
  },
  transactionsSection: {
    marginBottom: SPACING.XL,
    marginTop: 8,
  },
  emptyTransactions: {
    paddingVertical: 20,
  },
  emptyTransactionsText: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_SECONDARY,
    opacity: 0.5,
  },
  fabTooltip: {
    position: "absolute",
    bottom: 94,
    alignSelf: "center",
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    zIndex: 100,
  },
  tooltipText: {
    color: WHITE,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: PRIMARY_GREEN,
    transform: [{ rotate: "45deg" }],
  },
  viewAllText: {
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
