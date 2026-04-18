import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  SPACING,
  Fonts,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
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
            { backgroundColor: transaction.categoryColor + "20" },
          ]}
        >
          <Ionicons
            name={transaction.categoryIcon as any}
            size={24}
            color={transaction.categoryColor}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryTitle}>{transaction.category}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text
          style={[
            styles.amount,
            { color: isIncome ? "#10B981" : "#EF4444" },
          ]}
        >
          {isIncome ? "+" : "-"}₦{transaction.amount.toLocaleString()}
        </Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
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
  categoryTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  amount: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
});
