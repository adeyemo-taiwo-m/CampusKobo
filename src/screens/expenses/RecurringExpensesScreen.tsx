import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainHeader } from "../../components/MainHeader";
import { DarkCard } from "../../components/DarkCard";
import { Button } from "../../components/Button";
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
  BACKGROUND,
  RED,
  BORDER_GRAY,
} from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { formatCurrency, getPercentage } from "../../utils/formatters";
import { RecurringExpense } from "../../types";

const { width } = Dimensions.get("window");

export default function RecurringExpensesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    recurringExpenses,
    user,
    deleteRecurringExpense,
    pauseAllRecurring,
    resumeAllRecurring,
    updateRecurringExpense,
  } = useAppContext();

  // Calculate sum of active recurring expenses only
  const activeRecurringExpenses = recurringExpenses.filter((r) => !r.isPaused);
  const activeSum = activeRecurringExpenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const budgetLimit = user?.monthlyBudget || 100000;
  const progress = activeSum / budgetLimit;

  const allPaused =
    recurringExpenses.length > 0 && recurringExpenses.every((r) => r.isPaused);
  const showList = recurringExpenses.length > 0;

  const handleToggleState = () => {
    if (allPaused) {
      resumeAllRecurring();
    } else {
      pauseAllRecurring();
    }
  };

  const handleItemPress = (item: RecurringExpense) => {
    Alert.alert(item.name, "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      {
        text: item.isPaused ? "Resume" : "Pause",
        onPress: () =>
          updateRecurringExpense(item.id, { isPaused: !item.isPaused }),
      },
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/expenses/add-recurring",
            params: { recurringExpense: JSON.stringify(item) },
          }),
      },
      {
        text: "Delete",
        onPress: () => deleteRecurringExpense(item.id),
        style: "destructive",
      },
    ]);
  };

  const renderItem = (item: RecurringExpense) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.itemRow}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconCircle, { backgroundColor: item.isPaused ? "#F3F4F6" : "#FEF2F2" }]}>
          <Ionicons 
            name={item.categoryIcon as any || "calendar"} 
            size={22} 
            color={item.isPaused ? TEXT_SECONDARY : RED} 
          />
        </View>
        <View style={styles.centerText}>
          <Text style={styles.itemCategoryName}>{item.name}</Text>
          <Text style={styles.itemFrequencyText}>
            {item.frequency === "monthly"
              ? `Monthly • ${new Date(item.startDate).getDate()}th`
              : item.frequency === "weekly"
                ? "Weekly"
                : "Daily"}
          </Text>
        </View>
      </View>

      <View style={styles.itemRight}>
        <Text style={[styles.itemAmountText, item.isPaused && { color: TEXT_SECONDARY }]}>
          {formatCurrency(item.amount)}
        </Text>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: item.isPaused ? "#F3F4F6" : "#E8F5E9" },
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              { color: item.isPaused ? TEXT_SECONDARY : PRIMARY_GREEN },
            ]}
          >
            {item.isPaused ? "Paused" : "Active"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_GREEN} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* ── Green Hero Region ─────────────────────── */}
      <View style={styles.heroRegion}>
        <View style={{ paddingTop: insets.top }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Recurring Bills</Text>
            <View style={{ width: 40 }} /> 
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <DarkCard
            type="expenses"
            amount={activeSum}
            limitAmount={budgetLimit}
            progress={progress}
            periodLabel="Recurring this month"
            label="Recurring Overview"
            statusCaption="Auto-deducted every month"
          />
        </View>
      </View>

      {/* ── White List Region ─────────────────────── */}
      <View style={styles.whiteCard}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Your Bills</Text>
          {showList && (
            <TouchableOpacity onPress={handleToggleState}>
              <Text style={styles.toggleText}>
                {allPaused ? "Resume All" : "Pause All"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {showList ? (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.listContainer}>
              {recurringExpenses.map(renderItem)}
            </View>
            <View style={{ height: 120 }} />
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.illustration}>
              <Ionicons
                name="calendar-clear-outline"
                size={60}
                color={PRIMARY_GREEN}
              />
            </View>
            <Text style={styles.emptyHeading}>No recurring bills yet</Text>
            <Text style={styles.emptySubtext}>
              Add repeating expenses like data, rent, or subscriptions to track them automatically.
            </Text>
            <Button
              title="Add Your First Bill"
              onPress={() => router.push("/expenses/add-recurring")}
              variant="primary"
              style={styles.emptyCta}
            />
          </View>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title="Add Recurring Expense"
          onPress={() => router.push("/expenses/add-recurring")}
          variant="primary"
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  heroRegion: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  summaryContainer: {
    paddingHorizontal: SPACING.LG,
    marginTop: 10,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: SPACING.LG,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: PRIMARY_GREEN,
  },
  listContainer: {
    gap: 12,
  },
  itemRow: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  centerText: {
    flex: 1,
  },
  itemCategoryName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  itemFrequencyText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  itemAmountText: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: RED,
    marginBottom: 6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    textTransform: "uppercase",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  illustration: {
    backgroundColor: "#F0F9F4",
    borderRadius: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyHeading: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  emptyCta: {
    marginTop: 32,
    width: 200,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  ctaButton: {
    height: 56,
    borderRadius: 16,
  },
});;
;
