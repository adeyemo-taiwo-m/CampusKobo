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
import { Fonts, SPACING, WHITE } from "../constants";
import { ProgressBar } from "./ProgressBar";

interface DarkCardProps {
  type: "balance" | "expenses" | "transaction" | "budget";
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
            <View
              style={
                (isBalanceType || isTransactionType) && !centered
                  ? styles.topRow
                  : styles.topRowCenter
              }
            >
              <View
                style={isBalanceType || centered ? null : styles.centerAlign}
              >
                {isBalanceType ? (
                  <Text style={styles.label}>Current Balance</Text>
                ) : isTransactionType ? null : (
                  <View style={styles.periodBadgeCentered}>
                    <Text style={styles.periodLabel}>{periodLabel} 📅</Text>
                  </View>
                )}

                {label && (
                  <Text style={isBudgetType ? styles.mutedLabel : styles.label}>
                    {label}
                  </Text>
                )}

                {/* Budget type: category icon + name header row */}
                {isBudgetType && categoryName && (
                  <View style={styles.budgetCategoryHeader}>
                    <View style={styles.budgetCategoryIconCircle}>
                      <Ionicons
                        name={(categoryIcon as any) || 'wallet-outline'}
                        size={16}
                        color={"#19a051"}
                      />
                    </View>
                    <Text style={styles.budgetCategoryName}>{categoryName}</Text>
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
                          { backgroundColor: isIncome ? "#2DBB6D" : "#FFE6E6" },
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
                          { backgroundColor: isIncome ? "#2DBB6D" : "#FFE6E6" },
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
                    name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </TouchableOpacity>
              )}

              {showToggle && (
                <TouchableOpacity style={styles.tealToggle} onPress={onToggle}>
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
                      <Ionicons name="arrow-down" size={14} color="#A5D6A7" />
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
                      { width: `${Math.round(progress * 100)}%` },
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
                  <Text style={styles.statusCaptionTop}>{statusCaption}</Text>
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
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
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
  periodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  periodLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  periodBadgeCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    width: "100%",
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
  limitSmall: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.7)",
  },
  limitSuffix: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
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
  statusCaption: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 10,
  },
  statusCaptionTop: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 10,
    marginBottom: 4,
  },
  progressLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 6,
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
    marginRight: 10,
  },
  categoryNameText: {
    color: WHITE,
    fontSize: 18,
    fontFamily: Fonts.medium,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  typeTag: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  monthTag: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  monthTagText: {
    color: WHITE,
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  remainingText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: WHITE,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2ECC71",
    marginHorizontal: 8,
  },
  motivationText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: "#2ECC71",
  },
  tealToggle: {
    position: "absolute",
    right: -24,
    top: 40,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00CFB5",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  tealToggleInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: WHITE,
  },
  budgetProgressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetProgressBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 5,
    overflow: "hidden",
  },
  budgetProgressBarFill: {
    height: "100%",
    backgroundColor: WHITE,
    borderRadius: 5,
  },
  budgetProgressPercent: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: WHITE,
    marginLeft: 10,
  },
  budgetStatusLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetStatusLeft: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: WHITE,
  },
  budgetStatusDot: {
    color: "#4ADE80",
    marginHorizontal: 2,
    fontSize: 13,
  },
  budgetStatusMotivation: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "#4ADE80",
  },
  budgetCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  budgetCategoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  budgetCategoryName: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: WHITE,
  },
});
