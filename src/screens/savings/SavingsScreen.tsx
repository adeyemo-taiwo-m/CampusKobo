import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
} from "../../constants";
import { DarkCard } from "../../components/DarkCard";
import { EmptyState } from "../../components/EmptyState";
import { useAppContext } from "../../context/AppContext";
import { Header } from "../../components/Header";
import { ProgressBar } from "../../components/ProgressBar";

import { SavingsGoal } from "../../types";

export const SavingsScreen = () => {
  const router = useRouter();
  const { savingsGoals } = useAppContext();
  const hasGoals = savingsGoals.length > 0;

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);

  const renderGoalCard = ({ item }: { item: SavingsGoal }) => {
    const progress = item.savedAmount / item.targetAmount;
    const percent = Math.round(progress * 100);

    return (
      <TouchableOpacity
        style={styles.goalCard}
        onPress={() =>
          router.push({
            pathname: "/savings/detail",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalIconName}>
            <Text style={styles.goalEmoji}>{item.emoji}</Text>
            <Text style={styles.goalName}>{item.name}</Text>
          </View>
          <Text style={styles.goalPercentText}>{percent}%</Text>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} height={8} />
          <View style={styles.amountRow}>
            <Text style={styles.amountText}>
              ₦{item.savedAmount.toLocaleString()}{" "}
              <Text style={styles.targetText}>
                / ₦{item.targetAmount.toLocaleString()}
              </Text>
            </Text>
            {item.deadline && (
              <Text style={styles.deadlineText}>
                Due:{" "}
                {new Date(item.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.goalActions}>
          <TouchableOpacity
            style={styles.addFundsBtn}
            onPress={() => {
              /* Open Add Funds Bottom Sheet */
            }}
          >
            <Text style={styles.addFundsBtnText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() =>
              router.push({
                pathname: "/savings/detail",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Region */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.profileSection}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={styles.avatar}>
                <Image
                  source={require("../../../assets/images/avatar.jpeg")}
                  style={styles.avatarImage}
                />
              </View>
              <Text style={styles.welcomeText}>Hi, Taiwo</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Savings</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/(tabs)/learning")}
              >
                <Ionicons name="school-outline" size={22} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/profile/notifications")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={WHITE}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryCardWrapper}>
            <DarkCard
              type="balance" // Using balance type for general summary look
              amount={totalSaved}
              label="Total Savings"
              periodLabel={`Across ${savingsGoals.length} active goals`}
              hideIncomeExpenses={true}
              style={styles.summaryCard}
            />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.mainContentWrapper}>
        <FlatList
          data={savingsGoals}
          renderItem={renderGoalCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            hasGoals ? <Text style={styles.sectionLabel}>My Goals</Text> : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="wallet-outline"
                title="No savings goals yet"
                subtitle="Set a goal and start saving towards something you love"
                buttonTitle="Create a Goal"
                onButtonPress={() => router.push("/savings/create")}
              />
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
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
  welcomeText: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 18,
    marginLeft: SPACING.SM,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatarImage: {
    width: 38,
    height: 38,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCardWrapper: {
    paddingHorizontal: SPACING.LG,
  },
  summaryCard: {
    // Add any summary card specific styles here if needed
  },
  listContent: {
    paddingTop: 24,
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
    marginTop: 12,
  },
  goalCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalIconName: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  goalName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  goalPercentText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: PRIMARY_GREEN,
  },
  progressContainer: {
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  amountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  targetText: {
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
  },
  deadlineText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  goalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  addFundsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: PRIMARY_GREEN,
  },
  addFundsBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
  viewDetailsBtn: {
    paddingVertical: 8,
  },
  viewDetailsBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default SavingsScreen;
