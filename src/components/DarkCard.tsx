import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Fonts, SPACING, WHITE } from "../constants";
import { ProgressBar } from "./ProgressBar";
import * as Progress from "react-native-progress";

interface DarkCardProps {
  type: "balance" | "expenses" | "transaction" | "budget" | "savings";
  amount?: number;
  income?: number;
  expenses?: number;
  // Type: 'balance' specific props
  isBalanceVisible?: boolean;
  onToggleVisibility?: () => void;
  // Type: 'expenses' specific props
  periodLabel?: string;
  progress?: number;
  statusCaption?: string;
  progressLabel?: string;
  hideIncomeExpenses?: boolean;
  label?: string;
  limitAmount?: number;
  comparisonLabel?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  // Type: 'transaction' specific props
  isIncome?: boolean;
  categoryName?: string;
  categoryIcon?: string;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  showCircularProgress?: boolean;
  onActionPress?: () => void;
  actionLabel?: string;
}

export const DarkCard = ({
  type,
  amount = 0,
  income = 0,
  expenses = 0,
  isBalanceVisible = true,
  onToggleVisibility,
  periodLabel = "This Month",
  progress,
  statusCaption,
  progressLabel,
  hideIncomeExpenses = false,
  isIncome = false,
  categoryName,
  categoryIcon,
  centered = false,
  style,
  label,
  limitAmount,
  comparisonLabel,
  showToggle = false,
  onToggle,
  children,
  showCircularProgress = false,
  onActionPress,
  actionLabel,
}: DarkCardProps) => {
  const isBalanceType = type === "balance";
  const isTransactionType = type === "transaction";
  const isBudgetType = type === "budget";
  const isSavingsType = type === "savings";

  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={["#2DD673", "#116232"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children ? (
          children
        ) : (
          <View style={styles.content}>
            {isSavingsType ? (
              /* Savings Specific Structure */
              <View style={styles.savingsContent}>
                {/* Header: Icon (optional) + Label */}
                <View style={styles.savingsHeaderRow}>
                  {categoryIcon && (
                    <View style={styles.savingsIconBox}>
                      <Text style={{ fontSize: 16 }}>{categoryIcon}</Text>
                    </View>
                  )}
                  <Text style={styles.savingsLabel}>
                    {label || "Total Savings"}
                  </Text>
                </View>

                {/* Amount / Target */}
                <View style={styles.savingsAmountRow}>
                  <Text style={styles.savingsAmount}>
                    ₦{amount.toLocaleString()}
                  </Text>
                  <Text style={[styles.decimals, { fontSize: 20 }]}>.00</Text>
                  {limitAmount !== undefined && (
                    <Text style={styles.savingsTarget}>
                      /₦{limitAmount.toLocaleString()}
                    </Text>
                  )}
                </View>

                <View style={styles.savingsProgressRow}>
                  <View style={styles.savingsBarWrapper}>
                    <ProgressBar
                      progress={progress || 0}
                      height={10}
                      fillColor={Colors.primary.P50}
                      backgroundColor={Colors.primary.P600}
                    />
                  </View>
                  <Text style={styles.savingsPercent}>
                    {Math.round((progress || 0) * 100)}%
                  </Text>
                </View>

                {periodLabel && (
                  <Text style={styles.savingsFooterLabel}>{periodLabel}</Text>
                )}
              </View>
            ) : isBalanceType ? (
              /* Balance Specific Structure (Matching the Reference Image) */
              <View style={styles.balanceContent}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.label}>Current Balance</Text>
                </View>

                <View style={styles.balanceMainRow}>
                  <View style={styles.balanceAmountWrapper}>
                    <Text style={styles.amountTextLarge}>
                      {isBalanceVisible
                        ? `₦${Math.max(0, amount).toLocaleString()}`
                        : "₦ ••••••"}
                    </Text>
                    {isBalanceVisible && (
                      <Text style={styles.decimals}>.00</Text>
                    )}
                  </View>

                  {onToggleVisibility && (
                    <TouchableOpacity
                      onPress={onToggleVisibility}
                      style={styles.eyeButtonLarge}
                    >
                      <Ionicons
                        name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                        size={28}
                        color="rgba(255, 255, 255, 0.5)"
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {!hideIncomeExpenses && (
                  <>
                    <View style={styles.dividerThin} />
                    <View style={styles.bottomRow}>
                      <View style={styles.statCol}>
                        <View style={styles.statHeader}>
                          <Ionicons name="arrow-up" size={18} color="rgba(255,255,255,0.6)" style={{ marginRight: 8 }} />
                          <Text style={styles.statLabelSmall}>Income</Text>
                        </View>
                        <Text style={styles.statValueLarge}>
                          +₦{income.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.verticalDividerThin} />

                      <View style={styles.statCol}>
                        <View style={styles.statHeader}>
                          <Ionicons
                            name="arrow-down"
                            size={18}
                            color="rgba(255,255,255,0.6)"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.statLabelSmall}>Expenses</Text>
                        </View>
                        <Text style={styles.statValueLarge}>
                          −₦{expenses.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            ) : type === "expenses" || isBudgetType ? (
              /* Modern Summary Structure (Balanced Two-Column Layout) */
              <View style={styles.modernContent}>
                <View style={styles.modernHeader}>
                  <View style={styles.modernHeaderLeft}>
                    {type === "expenses" ? (
                      <View style={styles.modernPeriodPill}>
                        <Text style={styles.modernPeriodPillText}>
                          {periodLabel}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.budgetCategoryHeader}>
                        <View style={styles.budgetCategoryIconCircle}>
                          <Ionicons
                            name={(categoryIcon as any) || "wallet-outline"}
                            size={14}
                            color={"#bcf6d3"}
                          />
                        </View>
                        <Text style={styles.budgetCategoryName}>
                          {categoryName || label || "Budget"}
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={onToggleVisibility}
                    style={styles.visibilityToggleSmall}
                  >
                    <Ionicons
                      name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.modernMainRow}>
                  <View style={styles.modernLeft}>
                    <Text style={styles.modernLabel}>
                      {type === "expenses" ? "Total Expense" : "Budget Limit"}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text style={styles.modernAmountLarge}>
                        {type === "expenses" && !isBalanceVisible
                          ? "₦ ••••••"
                          : `₦${amount.toLocaleString()}`}
                      </Text>
                      {!(type === "expenses" && !isBalanceVisible) && (
                        <Text style={[styles.decimals, { fontSize: 24 }]}>.00</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.modernRight}>
                    {showCircularProgress ? (
                      <View style={styles.modernCircleWrapper}>
                        <Progress.Circle
                          size={65}
                          progress={progress || 0}
                          thickness={6}
                          color={WHITE}
                          unfilledColor="rgba(255,255,255,0.2)"
                          borderWidth={0}
                          strokeCap="round"
                        />
                        <View style={styles.modernCircleTextOverlay}>
                          <Text style={styles.modernCirclePercentText}>
                            {Math.round((progress || 0) * 100)}%
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.modernProgressBox}>
                        <Text style={styles.modernProgressPercentLarge}>
                          {Math.round((progress || 0) * 100)}%
                        </Text>
                        <Text style={styles.modernProgressSubtext}>Used</Text>
                      </View>
                    )}
                  </View>
                </View>

                {onActionPress && actionLabel && (
                  <TouchableOpacity
                    style={styles.modernActionButton}
                    onPress={onActionPress}
                  >
                    <Text style={styles.modernActionText}>{actionLabel}</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.modernFooter}>
                  <View style={styles.modernProgressBarTrack}>
                    <View
                      style={[
                        styles.modernProgressBarFill,
                        {
                          width: `${Math.min(
                            100,
                            Math.round((progress || 0) * 100)
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  {statusCaption && (
                    <Text style={styles.modernStatusCaption}>
                      {statusCaption}
                    </Text>
                  )}
                </View>
              </View>
            ) : (
              /* Standard Structure (Transaction) */
              <View style={centered ? styles.topRowCenter : styles.topRow}>
                <View style={centered ? styles.centerAlign : null}>
                  {label && (
                    <Text style={styles.label}>{label}</Text>
                  )}
                  
                  <View style={styles.amountRow}>
                    <Text
                      style={[
                        styles.amountText,
                        centered && { textAlign: "center" },
                      ]}
                    >
                      {isTransactionType
                        ? `${isIncome ? "+" : "−"}₦${amount.toLocaleString()}`
                        : `₦${amount.toLocaleString()}`}
                    </Text>
                  </View>

                  {isTransactionType && (
                    <View style={styles.transactionMeta}>
                      <View style={styles.categoryRow}>
                        <View
                          style={[
                            styles.categoryBadgeDetail,
                            {
                              backgroundColor: isIncome ? "#2DBB6D" : "#FFE6E6",
                            },
                          ]}
                        >
                          <Ionicons
                            name={categoryIcon as any}
                            size={20}
                            color={isIncome ? WHITE : "#E03A3A"}
                          />
                        </View>
                        <Text style={styles.categoryNameText}>
                          {categoryName}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {showToggle && (
                  <TouchableOpacity style={styles.tealToggle} onPress={onToggle}>
                    <View style={styles.tealToggleInner} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "stretch",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  gradient: {
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
  },
  budgetGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  content: {
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topRowCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerAlign: {
    alignItems: "center",
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
    marginBottom: 4,
  },
  periodBadgeCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    width: "100%",
  },
  periodLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  mutedLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
    textAlign: "center",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  amountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 32,
    color: WHITE,
  },
  amountTextLarge: {
    fontFamily: Fonts.semiBold,
    fontSize: 38,
    color: WHITE,
  },
  budgetCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  budgetCategoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  budgetCategoryName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: WHITE,
  },
  budgetAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  budgetAmountPrimary: {
    fontFamily: Fonts.semiBold,
    fontSize: 42,
    color: WHITE,
  },
  budgetAmountSuffix: {
    fontFamily: Fonts.regular,
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.75)",
    marginLeft: 2,
  },
  balanceAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  decimals: {
    fontSize: 24,
    color: "rgba(255, 255, 255, 0.7)",
  },
  spentLabel: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: "rgba(255, 255, 255, 0.7)",
  },
  eyeButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: SPACING.MD,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statCol: {
    flex: 1,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  statValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: WHITE,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: SPACING.MD,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  progressPercent: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: WHITE,
  },
  statusCaptionTop: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 10,
    marginBottom: 4,
  },
  budgetProgressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  budgetProgressBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  budgetProgressBarFill: {
    height: "100%",
    backgroundColor: WHITE,
    borderRadius: 5,
  },
  budgetProgressPercent: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: WHITE,
    minWidth: 40,
    textAlign: "right",
  },
  budgetStatusLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  budgetStatusLeft: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
  },
  budgetStatusDot: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  budgetStatusMotivation: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: WHITE,
  },
  transactionMeta: {
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryBadgeDetail: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryNameText: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: WHITE,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  monthTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  monthTagText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: WHITE,
  },
  tealToggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 2,
  },
  tealToggleInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: WHITE,
    alignSelf: "flex-end",
  },
  /* Savings specific styles */
  savingsContent: {
    gap: 4,
  },
  savingsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  savingsIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary.P100,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsLabel: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  savingsAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 4,
  },
  savingsAmount: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: WHITE,
  },
  savingsTarget: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 2,
  },
  savingsProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  savingsBarWrapper: {
    flex: 1,
  },
  savingsPercent: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: WHITE,
    minWidth: 40,
    textAlign: "right",
  },
  savingsFooterLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 12,
  },
  /* Modern card styles */
  modernAmountContainer: {
    width: "100%",
    marginTop: 4,
  },
  modernAmountRow: {
    alignItems: "flex-start",
  },
  modernAmountLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  modernAmountValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  modernAmountValue: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: WHITE,
  },
  modernAmountTarget: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 4,
  },
  modernProgressSection: {
    marginTop: 20,
    width: "100%",
  },
  modernProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modernProgressLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },
  modernProgressValue: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: WHITE,
  },
  modernProgressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  modernProgressBarFill: {
    height: "100%",
    backgroundColor: WHITE,
    borderRadius: 5,
  },
  modernStatusCaption: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
    lineHeight: 16,
  },
  expensesPeriodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  expensesPeriodLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  visibilityToggle: {
    padding: 4,
  },
  /* Specific styles for the redesigned balance card */
  balanceContent: {
    paddingVertical: 4,
    width: "100%",
  },
  balanceHeader: {
    marginBottom: 8,
  },
  balanceMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  balanceAmountWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  eyeButtonLarge: {
    padding: 8,
  },
  dividerThin: {
    height: 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 20,
  },
  statLabelSmall: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  statValueLarge: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: WHITE,
    marginTop: 4,
  },
  verticalDividerThin: {
    width: 0.5,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 16,
  },
  /* Modern Summary Styles (Balanced Layout) */
  modernContent: {
    width: "100%",
  },
  modernHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modernHeaderLeft: {
    flex: 1,
  },
  modernPeriodPill: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  modernPeriodPillText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: WHITE,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  visibilityToggleSmall: {
    padding: 4,
  },
  modernMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modernLeft: {
    flex: 1,
  },
  modernLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  modernAmountLarge: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: WHITE,
  },
  modernRight: {
    alignItems: "flex-end",
    paddingLeft: 20,
  },
  modernProgressBox: {
    alignItems: "flex-end",
  },
  modernProgressPercentLarge: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: WHITE,
  },
  modernProgressSubtext: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
  },
  modernFooter: {
    width: "100%",
  },
  modernCircleWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernCircleTextOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernCirclePercentText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: WHITE,
  },
  modernActionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modernActionText: {
    color: WHITE,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
});
