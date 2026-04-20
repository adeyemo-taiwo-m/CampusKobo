import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
} from '../../constants';
import { DarkCard } from '../../components/DarkCard';
import { EmptyState } from '../../components/EmptyState';
import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';

interface SavingsGoal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
}

const SAMPLE_GOALS: SavingsGoal[] = [
  {
    id: '1',
    name: 'New Laptop',
    emoji: '💻',
    targetAmount: 250000,
    savedAmount: 150000,
    deadline: 'Dec 20, 2025',
  },
  {
    id: '2',
    name: 'Phone Upgrade',
    emoji: '📱',
    targetAmount: 120000,
    savedAmount: 30000,
    deadline: 'Oct 15, 2025',
  },
];

export const SavingsScreen = () => {
  const router = useRouter();
  const [goals] = useState<SavingsGoal[]>(SAMPLE_GOALS);
  const hasGoals = goals.length > 0;
  
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  const renderGoalCard = ({ item }: { item: SavingsGoal }) => {
    const progress = item.savedAmount / item.targetAmount;
    const percent = Math.round(progress * 100);

    return (
      <TouchableOpacity 
        style={styles.goalCard}
        onPress={() => router.push({
          pathname: "/savings/detail",
          params: { id: item.id }
        })}
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
              ₦{item.savedAmount.toLocaleString()} <Text style={styles.targetText}>/ ₦{item.targetAmount.toLocaleString()}</Text>
            </Text>
            {item.deadline && (
              <Text style={styles.deadlineText}>Due: {item.deadline}</Text>
            )}
          </View>
        </View>

        <View style={styles.goalActions}>
          <TouchableOpacity 
            style={styles.addFundsBtn}
            onPress={() => {/* Open Add Funds Bottom Sheet */}}
          >
            <Text style={styles.addFundsBtnText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             style={styles.viewDetailsBtn}
             onPress={() => router.push({
               pathname: "/savings/detail",
               params: { id: item.id }
             })}
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
      <View style={styles.headerHeroRegion}>
        <SafeAreaView>
          <View style={styles.topNavRow}>
            <View style={styles.profileGreeting}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>TA</Text>
              </View>
              <Text style={styles.greetingText}>Hi, Taiwo</Text>
            </View>
            <View style={styles.navIcons}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/learning")}>
                <Ionicons name="school-outline" size={22} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={22} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.screenTitle}>Savings</Text>

          <View style={styles.summaryCardWrapper}>
            <DarkCard
              type="balance" // Using balance type for general summary look (gradient etc)
              amount={totalSaved}
              label="Total Savings"
              periodLabel={`Across ${goals.length} active goals`}
              hideIncomeExpenses={true}
            />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.mainContentPanel}>
        {hasGoals ? (
          <FlatList
            data={goals}
            renderItem={renderGoalCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={<Text style={styles.sectionLabel}>My Goals</Text>}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="piggy-bank-outline"
              title="No savings goals yet"
              subtitle="Set a goal and start saving towards something you love"
              buttonTitle="Create a Goal"
              onButtonPress={() => router.push("/savings/create")}
            />
          </View>
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/savings/create")}
      >
        <Ionicons name="add" size={32} color={WHITE} />
      </TouchableOpacity>
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
    paddingBottom: 48,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: WHITE,
  },
  greetingText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
  navIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: WHITE,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  summaryCardWrapper: {
    paddingHorizontal: 20,
  },
  mainContentPanel: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconName: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default SavingsScreen;
