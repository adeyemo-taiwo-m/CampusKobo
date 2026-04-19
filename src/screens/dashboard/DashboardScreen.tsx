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
} from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { DarkCard } from "../../components/DarkCard";
import { ProgressBar } from "../../components/ProgressBar";
import { TransactionCard } from "../../components/TransactionCard";
import { EmptyState } from "../../components/EmptyState";

export default function DashboardScreen() {
  const router = useRouter();
  const { user, transactions, budgets, savingsGoals } = useAppContext();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

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
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
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
              onPress={() => router.push("/profile")}
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
                onPress={() => router.push("/learning")}
              >
                <Ionicons name="school-outline" size={24} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => router.push("/notifications")}
              >
                <Ionicons name="notifications-outline" size={24} color={WHITE} />
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Filter Bar */}
        <View style={styles.dateFilter}>
          <TouchableOpacity style={styles.dateSelector}>
            <Text style={styles.dateText}>OCTOBER 2025</Text>
            <Ionicons name="calendar-outline" size={16} color={TEXT_SECONDARY} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
          <View style={styles.growthBadge}>
            <Ionicons name="trending-up" size={14} color="#10B981" />
            <Text style={styles.growthText}>12% vs Last month</Text>
          </View>
        </View>

        {/* Section 2 — Budget Overview */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => router.push("/budget")}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget</Text>
            <Text style={styles.percentageText}>{Math.round(budgetProgress * 100)}%</Text>
          </View>
          <Text style={styles.budgetValue}>
            ₦{budgetSpent.toLocaleString()}
            <Text style={styles.budgetTotal}>/₦{budgetTotal.toLocaleString()}</Text>
          </Text>
          <ProgressBar progress={budgetProgress} />
          <View style={styles.budgetFooter}>
             <Text style={styles.budgetLeft}>₦{(budgetTotal - budgetSpent).toLocaleString()} left</Text>
             <Text style={styles.budgetStatus}> • You are doing well</Text>
          </View>
        </TouchableOpacity>

        {/* Section 3 — Savings Progress */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => router.push(primaryGoal ? "/savings" : "/savings/add")}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Savings Progress</Text>
          </View>
          
          {primaryGoal ? (
            <>
              <View style={styles.savingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalName}>{primaryGoal.title}</Text>
                  <Text style={styles.goalAmount}>
                    ₦{primaryGoal.savedAmount.toLocaleString()}
                    <Text style={styles.goalTarget}>/₦{primaryGoal.targetAmount.toLocaleString()}</Text>
                  </Text>
                </View>
                <View style={[styles.circularProgress, { borderRightColor: PRIMARY_GREEN, borderTopColor: PRIMARY_GREEN }]}>
                   <Text style={styles.circleText}>{Math.round((primaryGoal.savedAmount / primaryGoal.targetAmount) * 100)}%</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.addFundsButton}
                onPress={() => router.push(`/savings/add-funds?id=${primaryGoal.id}`)}
              >
                <Text style={styles.addFundsText}>Add funds</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptySavingsContainer}>
              <View style={styles.emptySavingsInfo}>
                <Text style={styles.emptySavingsTitle}>No active goal</Text>
                <Text style={styles.emptySavingsSubtitle}>Start saving for your dreams today</Text>
              </View>
              <TouchableOpacity 
                style={styles.setGoalButton}
                onPress={() => router.push("/savings/add")}
              >
                <Text style={styles.setGoalText}>Set a goal</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 4 — Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/expenses")}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((t) => (
              <TransactionCard 
                key={t.id} 
                transaction={t} 
                onPress={() => router.push(`/transaction/${t.id}`)}
              />
            ))
          ) : (
            <EmptyState 
              icon="wallet-outline"
              title="No transactions yet"
              subtitle="Tap + to add your first expense or income"
            />
          )}
        </View>
        
        {/* Padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerBackground: {
    backgroundColor: PRIMARY_GREEN,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: SPACING.LG,
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
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growthText: {
    fontFamily: Fonts.medium,
    color: "#10B981",
    fontSize: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: SPACING.LG,
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
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  percentageText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  budgetValue: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  budgetTotal: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  budgetFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.SM,
  },
  budgetLeft: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: TEXT_PRIMARY,
  },
  budgetStatus: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  goalName: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  goalAmount: {
    fontFamily: Fonts.medium,
    fontSize: 32,
    color: TEXT_PRIMARY,
  },
  goalTarget: {
    fontSize: 20,
    color: "#D1D5DB",
    fontFamily: Fonts.regular,
  },
  circularProgress: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 5,
    borderColor: "#DCFCE7", // Light green background ring
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: PRIMARY_GREEN,
  },
  addFundsButton: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  addFundsText: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 18,
  },
  emptySavingsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  emptySavingsInfo: {
    flex: 1,
  },
  emptySavingsTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  emptySavingsSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  setGoalButton: {
    backgroundColor: "#EFFDF5",
    width: "100%",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  setGoalText: {
    fontFamily: Fonts.semiBold,
    color: PRIMARY_GREEN,
    fontSize: 14,
  },
  transactionsSection: {
    marginBottom: SPACING.XL,
  },
  viewAllText: {
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    fontSize: 14,
  },
});
