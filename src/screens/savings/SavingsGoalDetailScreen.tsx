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
import { DarkCard } from '../../components/DarkCard';
import { Button } from '../../components/Button';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { AddFundsBottomSheet } from '../../components/AddFundsBottomSheet';
import { formatCurrency, getPercentage } from '../../utils/formatters';
import { useAppContext } from '../../context/AppContext';

export const SavingsGoalDetailScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { enrichedSavingsGoals, deleteSavingsGoal } = useAppContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const goal = enrichedSavingsGoals.find((g: any) => g.id === id);

  if (!goal) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: TEXT_SECONDARY, fontFamily: Fonts.medium }}>Goal not found.</Text>
      </View>
    );
  }

  // ── Computed values ────────────────────────────────────────────────────────
  const progress = goal.percent / 100;
  const percent = goal.percent;
  const remaining = goal.remaining;
  const daysLeft = goal.daysLeft;
  const monthsLeft = goal.monthsLeft;
  const dailyTarget = goal.dailyTarget;
  const monthlyTarget = goal.monthlyTarget;

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

          {/* Edit button using existing Button component */}
          <Button
            title="Edit"
            variant="secondary"
            size="sm"
            fullWidth={false}
            textStyle={{ color: PRIMARY_GREEN }}
            onPress={() =>
              router.push({
                pathname: '/savings/create' as any,
                params: { goal: JSON.stringify(goal) },
              })
            }
          />

        </View>

        {/* Hero card using DarkCard component */}
        <View style={styles.summaryCardWrapper}>
          <DarkCard
            type="savings"
            label={goal.name}
            categoryIcon={emoji}
            amount={goal.savedAmount}
            limitAmount={goal.targetAmount}
            progress={progress}
            periodLabel={
              daysLeft !== null 
                ? `${formatCurrency(remaining)} left • ${daysLeft} days remaining`
                : `${formatCurrency(remaining)} left`
            }
          />
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
              {dailyTarget ? formatCurrency(dailyTarget) : '—'}
            </Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Monthly Target</Text>
            <Text style={styles.miniValue}>
              {monthlyTarget ? formatCurrency(monthlyTarget) : '—'}
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
                <Text style={styles.cAmount}>+{formatCurrency(c.amount)}</Text>
                {/* Date — gray center */}
                <Text style={styles.cDate}>{formatDate(c.date)}</Text>
                {/* Source — dark right */}
                <Text style={styles.cSource}>{c.source || 'Main Wallet'}</Text>
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
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
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
  summaryCardWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
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
