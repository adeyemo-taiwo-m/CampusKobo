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
}: DarkCardProps) => {
  const isBalanceType = type === "balance";
  const isTransactionType = type === "transaction";
  const isBudgetType = type === "budget";
  const isSavingsType = type === "savings";

  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={isBudgetType ? ["#27AE60", "#0A4A25"] : ["#2DD673", "#177E42"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} // Horizontal gradient
        style={[styles.gradient, isBudgetType && styles.budgetGradient]}
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
            ) : (
              /* Standard Structure (Balance, Expenses, Transaction, Budget) */
              <>
                <View
                  style={
                    (isBalanceType || isTransactionType) && !centered
                      ? styles.topRow
                      : styles.topRowCenter
                  }
                >
                  <View
                    style={
                      isBalanceType || centered ? null : styles.centerAlign
                    }
                  >
                    {isBalanceType ? (
                      <Text style={styles.label}>Current Balance</Text>
                    ) : isTransactionType || isBudgetType ? null : (
                      <View style={styles.periodBadgeCentered}>
                        <Text style={styles.periodLabel}>{periodLabel} 📅</Text>
                      </View>
                    )}

                    {label && !isSavingsType && (
                      <Text
                        style={isBudgetType ? styles.mutedLabel : styles.label}
                      >
                        {label}
                      </Text>
                    )}

                    {/* Budget type: category header */}
                    {isBudgetType && categoryName && (
                      <View style={styles.budgetCategoryHeader}>
                        <View style={styles.budgetCategoryIconCircle}>
                          <Ionicons
                            name={(categoryIcon as any) || "wallet-outline"}
                            size={16}
                            color={"#bcf6d3"}
                          />
                        </View>
                        <Text style={styles.budgetCategoryName}>
                          {categoryName}
                        </Text>
                      </View>
                    )}

                    <View style={styles.amountRow}>
                      {isBalanceType ? (
                        <View style={styles.balanceAmountRow}>
                          <Text style={styles.amountTextLarge}>
                            {isBalanceVisible
                              ? `₦${Math.max(0, amount).toLocaleString()}`
                              : "₦ ••••••"}
                          </Text>
                          {isBalanceVisible && (
                            <Text style={styles.decimals}>.00</Text>
                          )}
                        </View>
                      ) : isTransactionType ? (
                        <Text
                          style={[
                            styles.amountText,
                            centered && { textAlign: "center" },
                          ]}
                        >
                          {`${isIncome ? "+" : "−"}₦${amount.toLocaleString()}`}
                        </Text>
                      ) : isBudgetType ? (
                        <View style={styles.budgetAmountRow}>
                          <Text
                            style={styles.budgetAmountPrimary}
                          >{`₦${amount.toLocaleString()}`}</Text>
                          {limitAmount && (
                            <Text
                              style={styles.budgetAmountSuffix}
                            >{`/₦${limitAmount.toLocaleString()}`}</Text>
                          )}
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.amountText,
                            centered && { textAlign: "center" },
                          ]}
                        >
                          {`₦${amount.toLocaleString()}`}
                          {type === "expenses" && (
                            <Text style={styles.spentLabel}> spent</Text>
                          )}
                        </Text>
                      )}
                    </View>

                    {isTransactionType && (
                      <View style={styles.transactionMeta}>
                        <View style={styles.categoryRow}>
                          <View
                            style={[
                              styles.categoryBadgeDetail,
                              {
                                backgroundColor: isIncome
                                  ? "#2DBB6D"
                                  : "#FFE6E6",
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

                        <View style={styles.tagRow}>
                          <View
                            style={[
                              styles.typeTag,
                              {
                                backgroundColor: isIncome
                                  ? "#2DBB6D"
                                  : "#FFE6E6",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tagText,
                                { color: isIncome ? WHITE : "#E03A3A" },
                              ]}
                            >
                              {isIncome ? "Income" : "Expense"}
                            </Text>
                          </View>

                          <View style={styles.monthTag}>
                            <Text style={styles.monthTagText}>This Month</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>

                  {isBalanceType && onToggleVisibility && (
                    <TouchableOpacity
                      onPress={onToggleVisibility}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={
                          isBalanceVisible ? "eye-outline" : "eye-off-outline"
                        }
                        size={24}
                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </TouchableOpacity>
                  )}

                  {showToggle && (
                    <TouchableOpacity
                      style={styles.tealToggle}
                      onPress={onToggle}
                    >
                      <View style={styles.tealToggleInner} />
                    </TouchableOpacity>
                  )}
                </View>

                {isBalanceType && !hideIncomeExpenses && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.bottomRow}>
                      <View style={styles.statCol}>
                        <View style={styles.statHeader}>
                          <Ionicons name="arrow-up" size={14} color="#A5D6A7" />
                          <Text style={styles.statLabel}>Income</Text>
                        </View>
                        <Text style={styles.statValue}>
                          +₦{income.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.verticalDivider} />

                      <View style={styles.statCol}>
                        <View style={styles.statHeader}>
                          <Ionicons
                            name="arrow-down"
                            size={14}
                            color="#A5D6A7"
                          />
                          <Text style={styles.statLabel}>Expenses</Text>
                        </View>
                        <Text style={styles.statValue}>
                          −₦{expenses.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                {!(isTransactionType || isBudgetType || isBalanceType) && (
                  <View style={styles.divider} />
                )}

                {isBudgetType && progress !== undefined && (
                  <View style={styles.budgetProgressSection}>
                    <View style={styles.budgetProgressBarTrack}>
                      <View
                        style={[
                          styles.budgetProgressBarFill,
                          {
                            width: `${Math.min(100, Math.round(progress * 100))}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.budgetProgressPercent}>
                      {Math.round(progress * 100)}%
                    </Text>
                  </View>
                )}

                {isBudgetType && progressLabel && (
                  <View style={styles.budgetStatusLine}>
                    <Text style={styles.budgetStatusLeft}>
                      {progressLabel.split(" • ")[0]}
                    </Text>
                    <Text style={styles.budgetStatusDot}>•</Text>
                    <Text style={styles.budgetStatusMotivation}>
                      {progressLabel.split(" • ")[1]}
                    </Text>
                  </View>
                )}

                {type === "expenses" && progress !== undefined && (
                  <>
                    {statusCaption && (
                      <Text style={styles.statusCaptionTop}>
                        {statusCaption}
                      </Text>
                    )}
                    <View style={styles.progressSection}>
                      <View style={{ flex: 1 }}>
                        <ProgressBar progress={progress} />
                      </View>
                      <Text style={styles.progressPercent}>
                        {Math.round(progress * 100)}%
                      </Text>
                    </View>
                  </>
                )}
              </>
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
    flex: 1,
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
});
