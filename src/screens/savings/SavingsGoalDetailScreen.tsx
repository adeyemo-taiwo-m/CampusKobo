// UPDATE 2026-04-25: Amended to match precise design spec:
//  - Hero: full #1A9E3F green bg ~40% screen, darker semi-transparent card
//  - Edit btn: white rectangle bg + PRIMARY_GREEN text
//  - Progress bar: white fill, dark track
//  - Motivation: #E8F5E9 pill (borderRadius 30), solid green dot, no border
//  - Contributions: pure text 3-col (amount|date|Main Wallet), no icons, ~54px rows
//  - Bottom btns: 55% Add Funds (green) + 40% Delete Goal (light pink/red)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  Colors,
} from '../../constants';
import { ProgressBar } from '../../components/ProgressBar';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { AddFundsBottomSheet } from '../../components/AddFundsBottomSheet';
import { useAppContext } from '../../context/AppContext';

export const SavingsGoalDetailScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { savingsGoals, deleteSavingsGoal } = useAppContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const goal = savingsGoals.find((g) => g.id === id);

  if (!goal) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: TEXT_SECONDARY, fontFamily: Fonts.medium }}>Goal not found.</Text>
      </View>
    );
  }

  // ── Computed values ────────────────────────────────────────────────────────
  const progress = goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;
  const percent = Math.round(Math.min(progress * 100, 100));
  const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);

  let daysLeft: number | null = null;
  let monthsLeft: number | null = null;
  if (goal.deadline) {
    const ms = new Date(goal.deadline).getTime() - Date.now();
    daysLeft = Math.max(Math.ceil(ms / 86400000), 0);
    monthsLeft = Math.max(Math.ceil(daysLeft / 30), 1);
  }

  const dailyTarget = daysLeft && daysLeft > 0 ? Math.ceil(remaining / daysLeft) : null;
  const monthlyTarget = monthsLeft && monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : null;

  const deadlineLabel = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const emoji = goal.emoji || '🎯';

  // ── Motivation banner text ─────────────────────────────────────────────────
  const getMotivationText = () => {
    if (percent >= 100) return 'Goal Achieved! 🎉';
    if (percent >= 70) return "Almost there! Keep going — you're nearly at your goal 🏆";
    if (percent >= 30) return `You're ${percent}% closer to your ${goal.name}! 🔥`;
    return "You're just getting started! Every kobo counts 🚀";
  };

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    await deleteSavingsGoal(goal.id);
    setShowDeleteModal(false);
    router.replace('/(tabs)/savings');
  };

  // ── Contributions (newest first, max 5) ────────────────────────────────────
  const sorted = [...(goal.contributions || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const shown = sorted.slice(0, 5);
  const hasMore = sorted.length > 5;

  const formatDate = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_GREEN} />

      {/* ── Green Hero Region (~40% of screen) ──────────────────────────── */}
      <View style={[styles.heroRegion, { paddingTop: insets.top + 8 }]}>

        {/* Header row */}
        <View style={styles.headerRow}>
          {/* Back button: circular white/light */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={18} color={TEXT_PRIMARY} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Savings Goal Details</Text>

          {/* Edit button: white rounded rect, green text */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              router.push({
                pathname: '/savings/create' as any,
                params: { goal: JSON.stringify(goal) },
              })
            }
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Hero card — darker green, semi-transparent */}
        <View style={styles.heroCard}>
          {/* Goal icon + name */}
          <View style={styles.goalNameRow}>
            <View style={styles.iconBox}>
              <Text style={{ fontSize: 16 }}>{emoji}</Text>
            </View>
            <Text style={styles.goalName}>{goal.name}</Text>
          </View>

          {/* Amounts on one line */}
          <Text style={styles.savedAmount}>
            ₦{goal.savedAmount.toLocaleString()}
            <Text style={styles.separator}>/</Text>
            <Text style={styles.targetAmount}>₦{goal.targetAmount.toLocaleString()}</Text>
          </Text>

          {/* Progress bar + % */}
          <View style={styles.barRow}>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.percentLabel}>{percent}%</Text>
          </View>

          {/* Footer meta */}
          <View style={styles.heroMeta}>
            <Text style={styles.remainingText}>₦{remaining.toLocaleString()} still needed</Text>
            {deadlineLabel && (
              <>
                <Text style={styles.heroBullet}> • </Text>
                <Text style={styles.dueText}>Due on {deadlineLabel}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* ── White Bottom Sheet ───────────────────────────────────────────── */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mini Stat Cards */}
        <View style={styles.miniGrid}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Daily Target</Text>
            <Text style={styles.miniValue}>
              {dailyTarget ? `₦${dailyTarget.toLocaleString()}` : '—'}
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Monthly Target</Text>
            <Text style={styles.miniValue}>
              {monthlyTarget ? `₦${monthlyTarget.toLocaleString()}` : '—'}
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Days left</Text>
            <Text style={styles.miniValue}>
              {daysLeft !== null ? `${daysLeft} days` : 'No deadline'}
            </Text>
          </View>
        </View>

        {/* Motivational Banner — pill shape, light green */}
        <View style={styles.motivationBanner}>
          <View style={styles.motivationDot} />
          <Text style={styles.motivationText}>{getMotivationText()}</Text>
        </View>

        {/* Recent Contributions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Contributions</Text>
          {hasMore && (
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contributionList}>
          {shown.length === 0 ? (
            <Text style={[styles.miniLabel, { textAlign: 'center', paddingVertical: 20 }]}>
              No contributions yet.
            </Text>
          ) : (
            shown.map((c, i) => (
              <View
                key={i}
                style={[
                  styles.contributionRow,
                  i < shown.length - 1 && styles.rowDivider,
                ]}
              >
                {/* Amount — green bold left */}
                <Text style={styles.cAmount}>+₦{c.amount.toLocaleString()}</Text>
                {/* Date — gray center */}
                <Text style={styles.cDate}>{formatDate(c.date)}</Text>
                {/* Source — dark right */}
                <Text style={styles.cSource}>{c.note || 'Main Wallet'}</Text>
              </View>
            ))
          )}
        </View>

        {/* Bottom Buttons */}
        <View style={[styles.bottomBtnRow, { paddingBottom: insets.bottom + 8 }]}>
          {/* Add Funds — 55% width, green */}
          <TouchableOpacity
            style={styles.addFundsBtn}
            onPress={() => setShowAddFunds(true)}
          >
            <Text style={styles.addFundsBtnText}>Add Funds</Text>
          </TouchableOpacity>


          {/* Delete Goal — 40% width, light pink bg, red text */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteBtnText}>Delete Goal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Funds Bottom Sheet */}
      <AddFundsBottomSheet
        visible={showAddFunds}
        goal={goal}
        onClose={() => setShowAddFunds(false)}
        onSuccess={() => {
          // Success handled in sheet, maybe add a toast if needed later
        }}
      />

      {/* Delete Confirm Modal */}

      <DeleteConfirmModal
        isVisible={showDeleteModal}
        title="Delete Savings Goal?"
        message={`Are you sure you want to delete "${goal.name}"? All contributions will be removed. This cannot be undone.`}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

const HERO_GREEN = '#1A9E3F';
const CARD_GREEN = 'rgba(0,0,0,0.18)'; // darker overlay on green bg

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HERO_GREEN,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroRegion: {
    backgroundColor: HERO_GREEN,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  // Circular white/light back button
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: WHITE,
  },
  // White rectangle, green text
  editBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: WHITE,
  },
  editBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: HERO_GREEN,
  },

  // Hero card — semi-transparent darker green
  heroCard: {
    backgroundColor: CARD_GREEN,
    borderRadius: 16,
    padding: 20,
  },
  goalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalName: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: WHITE,
  },
  // Amount row: ₦45,000/₦150,000 on one line
  savedAmount: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: WHITE,
    lineHeight: 44,
    marginBottom: 14,
  },
  separator: {
    fontFamily: Fonts.regular,
    fontSize: 22,
    color: 'rgba(255,255,255,0.6)',
  },
  targetAmount: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    color: 'rgba(255,255,255,0.75)',
  },
  // Progress bar: white fill, dark track
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  barTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: WHITE,
  },
  percentLabel: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: WHITE,
    minWidth: 34,
    textAlign: 'right',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  remainingText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: WHITE,
  },
  heroBullet: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
  },
  dueText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.primary.P200,
  },

  // ── White Sheet ───────────────────────────────────────────────────────────
  sheet: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  sheetContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // ── Mini Cards ────────────────────────────────────────────────────────────
  miniGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  miniCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  miniLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 6,
    textAlign: 'center',
  },
  miniValue: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },

  // ── Motivation Banner — pill, #E8F5E9 ─────────────────────────────────────
  motivationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  motivationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_GREEN,
    flexShrink: 0,
  },
  motivationText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_PRIMARY,
    flex: 1,
    lineHeight: 20,
  },

  // ── Contributions ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  viewAll: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  contributionList: {
    backgroundColor: WHITE,
    borderRadius: 16,
    marginBottom: 28,
    overflow: 'hidden',
  },
  // Pure text row: amount | date | source — no icons
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // +₦amount — PRIMARY_GREEN, bold, left
  cAmount: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: PRIMARY_GREEN,
    flex: 1.2,
  },
  // Date — gray, center
  cDate: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    textAlign: 'center',
  },
  // Source — dark, right
  cSource: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_PRIMARY,
    flex: 1,
    textAlign: 'right',
  },

  // ── Bottom Buttons — 55% / 40% ────────────────────────────────────────────
  bottomBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addFundsBtn: {
    flex: 5.5,
    height: 52,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFundsBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: WHITE,
  },
  deleteBtn: {
    flex: 4,
    height: 52,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#EF4444',
  },
});

export default SavingsGoalDetailScreen;
