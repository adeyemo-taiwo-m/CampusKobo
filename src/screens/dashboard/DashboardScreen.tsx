import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AddFundsBottomSheet } from "../../components/AddFundsBottomSheet";
import { DarkCard } from "../../components/DarkCard";
import { ProgressBar } from "../../components/ProgressBar";
import { Skeleton } from "../../components/Skeleton";
import { Toast } from "../../components/Toast";
import { TransactionCard } from "../../components/TransactionCard";
import {
  BACKGROUND,
  Fonts,
  PRIMARY_GREEN,
  SPACING,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  WHITE,
} from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, getPercentage } from "../../utils/formatters";

export default function DashboardScreen() {
  const router = useRouter();
  const {
    user,
    transactions,
    budgets,
    savingsGoals,
    isLoading,
    isBalanceHidden,
    toggleBalanceVisibility,
  } = useAppContext();
  const [isAddFundsVisible, setIsAddFundsVisible] = useState(false);
  const { toastProps, showToast } = useToast();

  const renderSkeletons = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <Skeleton width={120} height={40} borderRadius={20} />
        <View style={styles.headerActions}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton
            width={40}
            height={40}
            borderRadius={20}
            style={{ marginLeft: 12 }}
          />
        </View>
      </View>
      <Skeleton
        width="100%"
        height={180}
        borderRadius={24}
        style={{ marginTop: 24 }}
      />
      <View style={styles.statsRow}>
        <Skeleton width="48%" height={120} borderRadius={20} />
        <Skeleton width="48%" height={120} borderRadius={20} />
      </View>
      <View style={styles.recentSection}>
        <Skeleton
          width={150}
          height={24}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            width="100%"
            height={70}
            borderRadius={16}
            style={{ marginBottom: 12 }}
          />
        ))}
      </View>
    </View>
  );

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

      {isLoading ? (
        <View style={styles.headerBackground}>
          <SafeAreaView>
            <View style={{ paddingHorizontal: 20 }}>{renderSkeletons()}</View>
          </SafeAreaView>
        </View>
      ) : (
        <>
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
                  <Text style={styles.welcomeText}>
                    Hi, {user?.name?.split(" ")[0] || "there"}
                  </Text>
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
                isBalanceVisible={!isBalanceHidden}
                onToggleVisibility={toggleBalanceVisibility}
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
                  <Text style={styles.dateText}>
                    {new Date()
                      .toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                      .toUpperCase()}
                  </Text>
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
                      {getPercentage(budgetSpent, budgetTotal)}%
                    </Text>
                  )}
                </View>

                {budgets.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/budget")}
                  >
                    <View style={styles.amountRowBaseline}>
                      <Text style={styles.budgetValue}>
                        {formatCurrency(budgetSpent)}
                      </Text>
                      <Text style={styles.budgetTotal}>
                        /{formatCurrency(budgetTotal)}
                      </Text>
                    </View>
                    <ProgressBar progress={budgetProgress} />
                    <View style={styles.budgetFooter}>
                      <Text style={styles.budgetLeft}>
                        {formatCurrency(budgetTotal - budgetSpent)} left
                      </Text>
                      <Text style={styles.budgetStatus}>
                        {" "}
                        • You are doing well
                      </Text>
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
                      <Text style={styles.primaryActionBtnText}>
                        Create Budget
                      </Text>
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
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/savings")}
                  >
                    <View style={styles.savingsRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.goalName}>{primaryGoal.name}</Text>
                        <View style={styles.amountRowBaseline}>
                          <Text style={styles.goalAmount}>
                            {formatCurrency(primaryGoal.savedAmount)}
                          </Text>
                          <Text style={styles.goalTarget}>
                            /{formatCurrency(primaryGoal.targetAmount)}
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
                            {getPercentage(
                              primaryGoal.savedAmount,
                              primaryGoal.targetAmount,
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
                    <Text style={styles.emptyCardTitle}>
                      No savings goal yet
                    </Text>
                    <Text style={styles.emptyCardSubtitle}>
                      Start saving towards something important
                    </Text>
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => router.push("/savings/create")}
                    >
                      <Text style={styles.primaryActionBtnText}>
                        Start Saving
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Section 4 — Recent Transactions */}
              <View style={styles.transactionsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleLabel}>
                    Recent Transactions
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/expenses")}
                  >
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
          </View>
        </>
      )}

      {transactions.length === 0 && !isLoading && (
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
            showToast("Funds added successfully!", "success");
          }}
        />
      )}

      <Toast {...toastProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  skeletonContainer: {
    paddingTop: SPACING.MD,
  },
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  recentSection: {
    marginTop: 32,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
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

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
