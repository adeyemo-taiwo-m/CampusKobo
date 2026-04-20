import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';
import { DarkCard } from '../../components/DarkCard';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';

export const SavingsGoalDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Mock data for the specific goal
  const goal = {
    id: id || '1',
    name: 'New Laptop',
    emoji: '💻',
    targetAmount: 250000,
    savedAmount: 150000,
    deadline: 'Dec 20, 2025',
    createdAt: '2025-04-10',
    contributions: [
      { id: 'c1', amount: 50000, date: 'Apr 18, 2025', note: 'Monthly allowance' },
      { id: 'c2', amount: 20000, date: 'Apr 12, 2025', note: 'Freelance work' },
      { id: 'c3', amount: 80000, date: 'Apr 10, 2025', note: 'Initial deposit' },
    ]
  };

  const progress = goal.savedAmount / goal.targetAmount;
  const percent = Math.round(progress * 100);
  const remaining = goal.targetAmount - goal.savedAmount;

  const getMotivationCard = () => {
    if (percent < 30) return { text: "You're just getting started! Every kobo counts 🚀", color: '#EFF6FF', textColor: '#3B82F6' };
    if (percent < 70) return { text: `Great progress! You're ${percent}% closer to your ${goal.name}! 🔥`, color: '#F0FDF4', textColor: '#22C55E' };
    if (percent < 100) return { text: "Almost there! Keep going — you're nearly at your goal 🏆", color: '#FFFBEB', textColor: '#D97706' };
    return { text: "Goal Achieved! 🎉", color: '#F0FDF4', textColor: '#22C55E' };
  };

  const motivation = getMotivationCard();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Header */}
      <View style={styles.headerHeroRegion}>
        <SafeAreaView>
          <Header 
            title="Goal Details" 
            showBack={true} 
            onBack={() => router.back()}
            showEdit={true}
            onEdit={() => router.push({ pathname: '/savings/create', params: { id: goal.id } })}
            whiteTheme={true}
          />

          <View style={styles.summaryCardWrapper}>
            <DarkCard type="balance" amount={goal.savedAmount}>
               <View style={styles.darkCardInner}>
                  <Text style={styles.goalTitle}>{goal.name} {goal.emoji}</Text>
                  <View style={styles.amountProgressGroup}>
                    <Text style={styles.savedAmountHeader}>
                        ₦{goal.savedAmount.toLocaleString()} <Text style={styles.targetTotal}>/ ₦{goal.targetAmount.toLocaleString()}</Text>
                    </Text>
                    
                    <View style={styles.thickBarWrapper}>
                        <ProgressBar progress={progress} height={12} />
                    </View>
                    
                    <View style={styles.metaInfoRow}>
                        <Text style={styles.percentText}>{percent}% achieved</Text>
                        <Text style={styles.metaDivider}>•</Text>
                        <Text style={styles.remainingShort}>₦{remaining.toLocaleString()} left</Text>
                    </View>
                  </View>
               </View>
            </DarkCard>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.mainContent}>
        <View style={styles.contentPadding}>
          {/* Mini Stats Grid */}
          <View style={styles.miniStatsGrid}>
             <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>Daily Target</Text>
                <Text style={styles.miniStatValue}>₦1,200</Text>
             </View>
             <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>Monthly Target</Text>
                <Text style={styles.miniStatValue}>₦35,000</Text>
             </View>
             <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>Days Left</Text>
                <Text style={styles.miniStatValue}>245</Text>
             </View>
          </View>

          {/* Motivation Card */}
          <View style={[styles.motivationCard, { backgroundColor: motivation.color }]}>
            <Text style={[styles.motivationText, { color: motivation.textColor }]}>
              {motivation.text}
            </Text>
          </View>

          {/* Recent Contributions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Contributions</Text>
            <TouchableOpacity><Text style={styles.viewAllBtn}>View all →</Text></TouchableOpacity>
          </View>

          <View style={styles.contributionList}>
            {goal.contributions.map((c) => (
              <View key={c.id} style={styles.contributionItem}>
                 <View style={styles.cLeft}>
                    <View style={styles.cIconCircle}>
                        <Ionicons name="add" size={16} color={PRIMARY_GREEN} />
                    </View>
                    <View>
                        <Text style={styles.cAmount}>+₦{c.amount.toLocaleString()}</Text>
                        <Text style={styles.cNote}>{c.note}</Text>
                    </View>
                 </View>
                 <Text style={styles.cDate}>{c.date}</Text>
              </View>
            ))}
          </View>

          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.deleteBtnText}>Delete Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Funds */}
      <View style={styles.bottomCta}>
        <Button 
          title="Add Funds" 
          onPress={() => {/* Show Bottom Sheet */}}
          variant="primary"
          fullWidth={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  headerHeroRegion: {
    backgroundColor: '#0B5E2F',
    paddingBottom: 40,
  },
  summaryCardWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  darkCardInner: {
    paddingVertical: 10,
  },
  goalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: WHITE,
    marginBottom: 20,
  },
  amountProgressGroup: {
    gap: 12,
  },
  savedAmountHeader: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: WHITE,
  },
  targetTotal: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  thickBarWrapper: {
    marginVertical: 4,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#00CFB5', // Teal accent
  },
  metaDivider: {
    color: 'rgba(255,255,255,0.3)',
  },
  remainingShort: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  mainContent: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    backgroundColor: BACKGROUND,
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 100,
  },
  miniStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  miniStatCard: {
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 1,
  },
  miniStatLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  miniStatValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  motivationCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  motivationText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  viewAllBtn: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
  contributionList: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 10,
    marginBottom: 32,
  },
  contributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cAmount: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  cNote: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  cDate: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  dangerZone: {
    alignItems: 'center',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  deleteBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#EF4444',
  },
  bottomCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  }
});

export default SavingsGoalDetailScreen;
