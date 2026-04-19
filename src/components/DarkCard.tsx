import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { WHITE, Fonts, SPACING } from "../constants";
import { ProgressBar } from "./ProgressBar";

interface DarkCardProps {
  type: 'balance' | 'expenses';
  amount: number;
  income: number;
  expenses: number;
  // Type: 'balance' specific props
  isBalanceVisible?: boolean;
  onToggleVisibility?: () => void;
  // Type: 'expenses' specific props
  periodLabel?: string;
  progress?: number;
  statusCaption?: string;
  style?: StyleProp<ViewStyle>;
}

export const DarkCard = ({
  type,
  amount,
  income,
  expenses,
  isBalanceVisible = true,
  onToggleVisibility,
  periodLabel = "This Month",
  progress,
  statusCaption,
  style,
}: DarkCardProps) => {
  const isBalanceType = type === 'balance';

  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={["#3CB96A", "#1A6B3A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={isBalanceType ? styles.topRow : styles.topRowCenter}>
            <View style={isBalanceType ? null : styles.centerAlign}>
              {isBalanceType ? (
                <Text style={styles.label}>Current Balance</Text>
              ) : (
                <View style={styles.periodBadge}>
                  <Text style={styles.periodLabel}>{periodLabel}</Text>
                  <Ionicons name="calendar-outline" size={12} color="rgba(255, 255, 255, 0.6)" />
                </View>
              )}
              
              <View style={styles.amountRow}>
                <Text style={styles.amountText}>
                  {isBalanceType 
                    ? (isBalanceVisible ? `₦${Math.max(0, amount).toLocaleString()}` : "₦ ••••••")
                    : `₦${amount.toLocaleString()}`
                  }
                  {isBalanceType && isBalanceVisible && <Text style={styles.decimals}>.00</Text>}
                  {!isBalanceType && <Text style={styles.spentLabel}> spent</Text>}
                </Text>
              </View>
            </View>

            {isBalanceType && onToggleVisibility && (
              <TouchableOpacity
                onPress={onToggleVisibility}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="rgba(255, 255, 255, 0.65)"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View style={styles.statCol}>
              <View style={styles.statHeader}>
                <Ionicons
                  name="arrow-up"
                  size={14}
                  color="rgba(255, 255, 255, 0.8)"
                />
                <Text style={styles.statLabel}>Income</Text>
              </View>
              <Text style={styles.statValue}>+₦{income.toLocaleString()}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statCol}>
              <View style={styles.statHeader}>
                <Ionicons
                  name="arrow-down"
                  size={14}
                  color="rgba(255, 255, 255, 0.8)"
                />
                <Text style={styles.statLabel}>Expenses</Text>
              </View>
              <Text style={styles.statValue}>
                -₦{expenses.toLocaleString()}
              </Text>
            </View>
          </View>

          {!isBalanceType && progress !== undefined && (
            <>
              <View style={styles.progressSection}>
                <View style={{ flex: 1 }}>
                  <ProgressBar progress={progress} />
                </View>
                <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
              </View>
              {statusCaption && (
                <Text style={styles.statusCaption}>{statusCaption}</Text>
              )}
            </>
          )}
        </View>
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
    alignItems: 'center',
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
    marginBottom: 4,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  periodLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amountText: {
    fontFamily: Fonts.bold,
    fontSize: 40,
    color: WHITE,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'center',
    marginTop: 10,
  }
});
