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
  RefreshControl,
} from "react-native";
import { AddFundsBottomSheet } from "../../components/AddFundsBottomSheet";
import { DarkCard } from "../../components/DarkCard";
import { OfflineBanner } from "../../components/OfflineBanner";
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
import * as Progress from "react-native-progress";

export default function DashboardScreen() {
  const router = useRouter();
  const {
    user,
    apiUser,
    currentBalance,
    totalIncomeThisMonth,
    totalExpensesThisMonth,
    totalBudgetLimit,
    totalBudgetSpent,
    totalBudgetRemaining,
    budgetUsedPercent,
    budgetStatusLabel,
    primarySavingsGoalEnriched,
    recentTransactions,
    isLoading,
    loadAllData,
    isBalanceHidden,
    toggleBalanceVisibility,
  } = useAppContext();

  const [isAddFundsVisible, setIsAddFundsVisible] = useState(false);
  const { toastProps, showToast } = useToast();

  // Motivational text for budget section
  const budgetMotivation = {
    healthy: 'You are doing well',
    warning: 'Getting close',
    critical: 'Budget exceeded!',
    exceeded: 'Budget exceeded!',
  }[budgetStatusLabel] || 'You are doing well';

  const initials = (apiUser?.full_name || user?.name || "CK")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "CK";

  const firstName = (apiUser?.full_name || user?.name || "there").split(" ")[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OfflineBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadAllData}
            tintColor={WHITE}
            colors={[PRIMARY_GREEN]}
          />
        }
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.profileSection}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatar}>
              {apiUser?.avatar_url ? (
                <Image source={{ uri: apiUser.avatar_url }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <Text style={styles.greeting}>Hi, {firstName}</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/learning")}>
              <Ionicons name="school-outline" size={24} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile/notifications")}>
              <Ionicons name="notifications-outline" size={24} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BALANCE CARD ── */}
        <DarkCard
          type="balance"
          amount={currentBalance}
          income={totalIncomeThisMonth}
          expenses={totalExpensesThisMonth}
          isBalanceVisible={!isBalanceHidden}
          onToggleVisibility={toggleBalanceVisibility}
          style={styles.balanceCard}
        />

        <View style={styles.mainContent}>
          {/* ── DATE FILTER BAR (matches design) ── */}
          <View style={styles.dateFilterRow}>
            <TouchableOpacity style={styles.dateSelector}>
              <Text style={styles.dateText}>
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Ionicons name="calendar-outline" size={16} color={TEXT_SECONDARY} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <View style={styles.dividerPipe} />
            <View style={styles.growthBadge}>
              <Ionicons name="arrow-up" size={14} color="#10B981" />
              <Text style={styles.growthText}>12% vs Last month</Text>
            </View>
          </View>

          {/* ── BUDGET SECTION (Light Card Format) ── */}
          <View style={styles.lightCard}>
            <Text style={styles.cardLabelGreen}>Budget</Text>
            <View style={styles.cardMainRow}>
              <View style={styles.amountBaseline}>
                <Text style={styles.mainAmountText}>{formatCurrency(totalBudgetSpent)}</Text>
                <Text style={styles.limitAmountText}>/{formatCurrency(totalBudgetLimit)}</Text>
              </View>
              <Text style={styles.percentageTextSide}>{budgetUsedPercent}%</Text>
            </View>
            <ProgressBar progress={budgetUsedPercent / 100} style={styles.cardProgressBar} />
            <Text style={styles.cardCaptionMuted}>
              {formatCurrency(totalBudgetRemaining)} left  •  {budgetMotivation}
            </Text>
          </View>

          {/* ── SAVINGS SECTION (Light Card Format) ── */}
          {primarySavingsGoalEnriched ? (
            <View style={styles.lightCard}>
              <Text style={styles.cardLabelGreen}>Savings Progress</Text>
              <View style={styles.savingsContentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalNameLarge}>{primarySavingsGoalEnriched.name}</Text>
                  <View style={styles.amountBaseline}>
                    <Text style={styles.savingsAmountText}>{formatCurrency(primarySavingsGoalEnriched.savedAmount)}</Text>
                    <Text style={styles.savingsLimitText}>/{formatCurrency(primarySavingsGoalEnriched.targetAmount)}</Text>
                  </View>
                </View>
                <View style={styles.circleProgressWrapper}>
                  <Progress.Circle
                    size={65}
                    progress={primarySavingsGoalEnriched.percent / 100}
                    thickness={6}
                    color={PRIMARY_GREEN}
                    unfilledColor="#E8F5E9"
                    borderWidth={0}
                    strokeCap="round"
                  />
                  <View style={styles.circleTextOverlay}>
                    <Text style={styles.circlePercentText}>{primarySavingsGoalEnriched.percent}%</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.fullWidthActionBtn}
                onPress={() => setIsAddFundsVisible(true)}
              >
                <Text style={styles.actionBtnText}>Add funds</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.lightCard}
              onPress={() => router.push("/savings/create")}
            >
              <Text style={styles.cardLabelGreen}>Savings Progress</Text>
              <Text style={styles.emptyCardTitle}>No savings goals yet</Text>
              <Text style={styles.emptyCardSubtitle}>Start saving towards something important</Text>
              <TouchableOpacity
                style={styles.fullWidthActionBtn}
                onPress={() => router.push("/savings/create")}
              >
                <Text style={styles.actionBtnText}>Start Saving</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {/* ── RECENT TRANSACTIONS ── */}
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/expenses")}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
            </View>
          ) : (
            recentTransactions.map(t => (
              <TransactionCard
                key={t.id}
                transaction={t}
                onPress={() => router.push(`/transaction/${t.id}`)}
              />
            ))
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Add Funds Bottom Sheet */}
      {primarySavingsGoalEnriched && (
        <AddFundsBottomSheet
          visible={isAddFundsVisible}
          goal={primarySavingsGoalEnriched}
          onClose={() => setIsAddFundsVisible(false)}
          onSuccess={() => {
            showToast("Funds added successfully!", "success");
            loadAllData();
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: WHITE,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  greeting: {
    color: WHITE,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: SPACING.LG,
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SPACING.LG,
    paddingTop: 30,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: Fonts.semiBold,
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  dividerPipe: {
    width: 1,
    height: 20,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontFamily: Fonts.medium,
    color: "#10B981",
    fontSize: 13,
    marginLeft: 4,
  },
  /* Design-Specific Light Card Styles */
  lightCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    // Elevation/Shadow
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardLabelGreen: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    marginBottom: 16,
  },
  cardMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amountBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainAmountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: TEXT_PRIMARY,
  },
  limitAmountText: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: TEXT_SECONDARY,
    opacity: 0.7,
  },
  percentageTextSide: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    opacity: 0.6,
  },
  cardProgressBar: {
    marginVertical: 4,
  },
  cardCaptionMuted: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 8,
    opacity: 0.8,
  },
  /* Savings Specific Layout */
  savingsContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  goalNameLarge: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  savingsAmountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: TEXT_PRIMARY,
  },
  savingsLimitText: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: "#D1D5DB",
  },
  circleProgressWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  circleTextOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercentText: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: PRIMARY_GREEN,
  },
  fullWidthActionBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionBtnText: {
    color: WHITE,
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  emptyCardTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyCardSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 24,
    opacity: 0.7,
  },
  /* Recent Transactions */
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  recentTitle: {
    color: TEXT_PRIMARY,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  viewAll: {
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  emptyTransactions: {
    paddingVertical: 20,
  },
  emptyTransactionsText: {
    color: TEXT_SECONDARY,
    fontFamily: Fonts.bold,
    fontSize: 24,
    opacity: 0.5,
  },
});
