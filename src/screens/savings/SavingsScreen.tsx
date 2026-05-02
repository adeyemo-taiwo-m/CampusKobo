// UPDATE 2026-04-25: Complete rewrite to match design mockup.
// UPDATE 2026-04-25: Removed FAB button as requested.
// Key changes:
//  - Goal cards: emoji icon in P50 square, Add Funds as filled green btn on right
//  - Progress bar row shows % at far right
//  - FAB added at bottom-right → navigates to CreateSavingsGoalScreen
//  - Empty state uses piggy bank illustration placeholder

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
  Colors,
} from "../../constants";
import { DarkCard } from "../../components/DarkCard";
import { EmptyState } from "../../components/EmptyState";
import { AddFundsBottomSheet } from "../../components/AddFundsBottomSheet";
import { Toast } from "../../components/Toast";
import { useToast } from "../../hooks/useToast";
import { useAppContext } from "../../context/AppContext";
import { ProgressBar } from "../../components/ProgressBar";
import { OfflineBanner } from "../../components/OfflineBanner";
import { formatCurrency, getPercentage } from "../../utils/formatters";
import { SavingsGoal } from "../../types";

// Returns an emoji that fits the goal name
const getGoalEmoji = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("laptop") || lower.includes("computer")) return "💻";
  if (lower.includes("phone") || lower.includes("mobile")) return "📱";
  if (lower.includes("trip") || lower.includes("travel") || lower.includes("flight")) return "✈️";
  if (lower.includes("car") || lower.includes("vehicle")) return "🚗";
  if (lower.includes("house") || lower.includes("home") || lower.includes("rent")) return "🏠";
  if (lower.includes("emergency") || lower.includes("fund")) return "🛡️";
  if (lower.includes("wedding")) return "💍";
  if (lower.includes("school") || lower.includes("edu") || lower.includes("tuition")) return "🎓";
  if (lower.includes("business")) return "💼";
  if (lower.includes("health") || lower.includes("medical")) return "🏥";
  return "🎯";
};

export const SavingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savingsGoals, isLoading, user, apiUser } = useAppContext();
  const { toastProps, showToast } = useToast();
  const hasGoals = savingsGoals.length > 0;
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? totalSaved / totalTarget : 0;

  const [selectedGoal, setSelectedGoal] = React.useState<SavingsGoal | null>(null);
  const [showAddFunds, setShowAddFunds] = React.useState(false);

  const handleOpenAddFunds = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setShowAddFunds(true);
  };

  const renderGoalCard = (item: SavingsGoal) => {
    const progress = item.targetAmount > 0 ? item.savedAmount / item.targetAmount : 0;
    const percent = getPercentage(item.savedAmount, item.targetAmount);
    const emoji = item.emoji || getGoalEmoji(item.name);

    return (
      <View key={item.id} style={styles.goalCard}>
        {/* Card row: icon | info | Add Funds btn */}
        <View style={styles.goalMainRow}>
          {/* Icon box */}
          <View style={styles.goalIconBox}>
            <Text style={styles.goalEmoji}>{emoji}</Text>
          </View>

          {/* Info */}
          <View style={styles.goalInfo}>
            <Text style={styles.goalName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.goalAmounts}>
              {formatCurrency(item.savedAmount)}
              <Text style={styles.goalTarget}>/{formatCurrency(item.targetAmount)}</Text>
            </Text>
            {item.deadline && (
              <Text style={styles.deadlineText}>
                Due:{" "}
                {new Date(item.deadline).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            )}
          </View>

          {/* Add Funds btn */}
          <TouchableOpacity
            style={styles.addFundsBtn}
            onPress={() => handleOpenAddFunds(item)}
          >
            <Text style={styles.addFundsBtnText}>Add funds</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar row */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarFlex}>
            <ProgressBar progress={progress} height={8} />
          </View>
          <Text style={styles.goalPercentText}>{percent}%</Text>
        </View>

        {/* View Details link */}
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/savings/detail", params: { id: item.id } })
          }
        >
          <Text style={styles.viewDetailsText}>View Details →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_GREEN} />
      <OfflineBanner />

      {/* ── Green Hero Region ─────────────────────── */}
      <View style={[styles.heroRegion, { paddingTop: insets.top + 10 }]}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.profileSection}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatar}>
              {apiUser?.avatar_url ? (
                <Image source={{ uri: apiUser.avatar_url }} style={styles.avatarImage} />
              ) : (
                <View style={styles.initialsAvatar}>
                  <Text style={styles.initialsText}>
                    {(apiUser?.full_name || user?.name || 'CK').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.welcomeText}>Hi, {(apiUser?.full_name || user?.name)?.split(' ')[0] || 'there'}</Text>
          </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/learning")}
              >
                <Ionicons name="school-outline" size={20} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/profile/notifications")}
              >
                <Ionicons name="notifications-outline" size={20} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerTitleLabelCentered}>Savings</Text>

        {/* Savings specific DarkCard summary */}
        <View style={styles.cardWrapper}>
          <DarkCard
            type="savings"
            amount={totalSaved}
            label="Total Savings"
            periodLabel={
              hasGoals
                ? `Across ${savingsGoals.length} active goals`
                : "No active goals yet"
            }
            progress={overallProgress}
          />
        </View>
      </View>

      {/* ── White Body ───────────────────────────── */}
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {hasGoals ? (
            <>
              <Text style={styles.sectionLabel}>My Goals</Text>
              {savingsGoals.map(renderGoalCard)}
            </>
          ) : (
            <View style={styles.emptyWrapper}>
              <EmptyState
                icon="cash-outline"
                title="No savings goals yet"
                subtitle="Set a goal and start saving towards something you love"
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Funds Bottom Sheet */}
      {selectedGoal && (
        <AddFundsBottomSheet
          visible={showAddFunds}
          goal={selectedGoal}
          onClose={() => {
            setShowAddFunds(false);
            setSelectedGoal(null);
          }}
          onSuccess={() => {
            showToast("Funds added successfully!", "success");
          }}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        </View>
      )}

      <Toast {...toastProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },

  // ── Hero ─────────────────────────────────────
  heroRegion: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: SPACING.LG,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
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
  initialsAvatar: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  welcomeText: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 16,
    marginLeft: 10,
  },
  headerTitleLabelCentered: {
    fontFamily: Fonts.medium,
    color: WHITE,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
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
  cardWrapper: {
    paddingHorizontal: 20,
  },

  // ── White Body ───────────────────────────────
  body: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },

  // ── Goal Cards ───────────────────────────────
  goalCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  goalMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  goalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary.P50,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  goalEmoji: {
    fontSize: 22,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  goalAmounts: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 3,
  },
  goalTarget: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  deadlineText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  addFundsBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  addFundsBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: WHITE,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  progressBarFlex: {
    flex: 1,
  },
  goalPercentText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: PRIMARY_GREEN,
    minWidth: 34,
    textAlign: "right",
  },
  viewDetailsText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
    paddingVertical: 4,
  },

  // ── Empty State ──────────────────────────────
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default SavingsScreen;
