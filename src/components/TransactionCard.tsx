import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Fonts,
  PRIMARY_GREEN,
  SPACING,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  WHITE,
} from "../constants";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  categoryIcon: string;
  categoryColor: string; // Added color field
  description: string;
  date: string;
  isRecurring: boolean;
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}

export const TransactionCard = ({
  transaction,
  onPress,
}: TransactionCardProps) => {
  const isIncome = transaction.type === "income";
  const dateObj = new Date(transaction.date);
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                (transaction.categoryColor || PRIMARY_GREEN) + "15",
            },
          ]}
        >
          <Ionicons
            name={transaction.categoryIcon as any}
            size={24}
            color={transaction.categoryColor || PRIMARY_GREEN}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryTitle}>{transaction.category}</Text>
          <View style={styles.detailsRow}>
            <Ionicons
              name="document-text-outline"
              size={12}
              color={TEXT_SECONDARY}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.description} numberOfLines={1}>
              {transaction.note || transaction.description}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Ionicons
              name="time-outline"
              size={12}
              color={TEXT_SECONDARY}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text
          style={[styles.amount, { color: isIncome ? "#10B981" : "#EF4444" }]}
        >
          {isIncome ? "+" : "-"}₦{transaction.amount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.MD,
    backgroundColor: WHITE,
    borderRadius: 24,
    marginBottom: SPACING.MD,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.MD,
  },
  textContainer: {
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  categoryTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#9CA3AF",
  },
});
