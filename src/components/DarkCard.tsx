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

interface DarkCardProps {
  balance: number;
  income: number;
  expenses: number;
  isBalanceVisible: boolean;
  onToggleVisibility: () => void;
  style?: StyleProp<ViewStyle>;
}

export const DarkCard = ({
  balance,
  income,
  expenses,
  isBalanceVisible,
  onToggleVisibility,
  style,
}: DarkCardProps) => {
  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={["#3CB96A", "#1A6B3A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.label}>Current Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceText}>
                  {isBalanceVisible
                    ? `₦${Math.max(0, balance).toLocaleString()}`
                    : "₦ ••••••"}
                  {isBalanceVisible && <Text style={styles.decimals}>.00</Text>}
                </Text>
              </View>
            </View>
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
  label: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balanceText: {
    fontFamily: Fonts.bold,
    fontSize: 40,
    color: WHITE,
  },
  decimals: {
    fontSize: 24,
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
});
