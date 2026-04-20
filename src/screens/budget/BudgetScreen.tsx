import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
  BACKGROUND,
  ACCENT_GREEN,
} from '../../constants';
import { ProgressBar } from '../../components/ProgressBar';
import { DarkCard } from '../../components/DarkCard';

const { width } = Dimensions.get('window');

interface Budget {
  id: string;
  category: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  spentAmount: number;
  limitAmount: number;
  daysLeft: number;
}

const SAMPLE_BUDGETS: Budget[] = [
  {
    id: '1',
    category: 'Food',
    icon: 'restaurant-outline',
    iconColor: '#3CB96A',
    spentAmount: 12000,
    limitAmount: 15000,
    daysLeft: 6,
  },
  {
    id: '2',
    category: 'Data & Airtime',
    icon: 'wifi-outline',
    iconColor: '#3CB96A',
    spentAmount: 2400,
    limitAmount: 8000,
    daysLeft: 6,
  },
  {
    id: '3',
    category: 'Transport',
    icon: 'car-outline',
    iconColor: '#3CB96A',
    spentAmount: 11000,
    limitAmount: 10000,
    daysLeft: 6,
  },
];

const BudgetCard = ({ budget, onPress }: { budget: Budget; onPress: () => void }) => {
  const currentProgress = budget.spentAmount / budget.limitAmount;
  const percentage = Math.min(Math.round(currentProgress * 100), 100);
  const remaining = budget.limitAmount - budget.spentAmount;

  // Color logic for budget status
  let statusColor = ACCENT_GREEN; 
  if (currentProgress >= 1.0) statusColor = '#EF4444'; 
  else if (currentProgress >= 0.7) statusColor = '#F59E0B'; 
  
  return (
    <TouchableOpacity style={styles.budgetCard} onPress={onPress}>
      <View style={styles.budgetCardContent}>
        <View style={styles.budgetCategoryInfo}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name={budget.icon} size={22} color="#1B5E20" />
          </View>
          <View style={styles.budgetTextStack}>
            <Text style={styles.categoryNameText}>{budget.category}</Text>
            <View style={styles.amountTextRow}>
               <Text style={styles.spentAmountText}>₦{budget.spentAmount.toLocaleString()}/₦{budget.limitAmount.toLocaleString()}</Text>
            </View>
            <Text style={styles.remainingSubtextRow}>₦{remaining.toLocaleString()} left • {budget.daysLeft} days remaining</Text>
          </View>
        </View>
        
        <View style={styles.rightCircleContainer}>
          <View style={styles.progressRingWrapper}>
            <Progress.Circle
              size={48}
              progress={currentProgress}
              unfilledColor="#F3F4F6"
              color={statusColor}
              thickness={4}
              borderWidth={0}
              showsText
              formatText={() => `${percentage}%`}
              textStyle={[styles.progressRingText, { color: statusColor }]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BudgetScreen = () => {
  const router = useRouter();
  const [budgets] = useState<Budget[]>(SAMPLE_BUDGETS);
  const hasBudgets = budgets.length > 0;
  
  const totalBudget = 50000;
  const totalSpent = 32000;
  const totalRemaining = totalBudget - totalSpent;
  const totalProgress = totalSpent / totalBudget;
  const currentMonth = "OCTOBER 2025";

  // Motivational logic
  let motivationalMessage = "You are doing well 👍";
  if (totalProgress >= 0.9) motivationalMessage = "Budget exceeded! 🚨";
  else if (totalProgress >= 0.7) motivationalMessage = "Getting close ⚠️";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollAreaContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seamless Header Hero Region */}
        <View style={styles.headerBackground}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity 
                style={styles.profileSection}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <View style={styles.avatar}>
                  <Image source={require("../../../assets/images/avatar.jpeg")} style={styles.avatarImage} />
                </View>
                <Text style={styles.welcomeText}>Hi, Taiwo</Text>
              </TouchableOpacity>
              
              <Text style={styles.headerTitleLabel}>Budget</Text>

              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile/notifications")}>
                  <Ionicons name="notifications-outline" size={24} color={WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/(tabs)/learning")}>
                  <Ionicons name="school-outline" size={24} color={WHITE} />
                </TouchableOpacity>
              </View>
            </View>

            {hasBudgets ? (
              <View style={styles.summaryCardWrapper}>
                <DarkCard
                  type="budget"
                  label="Total budget"
                  amount={totalSpent}
                  limitAmount={totalBudget}
                  progress={totalProgress}
                  progressLabel={`₦${totalRemaining.toLocaleString()} left • ${motivationalMessage}`}
                  periodLabel={currentMonth}
                  comparisonLabel="↑ 12% vs Last month"
                  style={styles.darkSummaryCard}
                />

                {/* External Meta Row below card */}
                <View style={styles.externalMetaRow}>
                  <View style={styles.monthCol}>
                    <Text style={styles.monthLabelText}>{currentMonth}</Text>
                    <Ionicons name="calendar-outline" size={16} color="#A5D6A7" style={{ marginLeft: 6 }} />
                  </View>
                  <View style={styles.verticalDividerLine} />
                  <View style={styles.growthCol}>
                    <Ionicons name="arrow-up" size={14} color="#A5D6A7" />
                    <Text style={styles.growthLabelText}>12% vs Last month</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyHeaderContent}>
                <Text style={styles.emptyHeaderTitle}>No budget set yet</Text>
              </View>
            )}
          </SafeAreaView>
        </View>

        {/* Main Budget List Area */}
        <View style={styles.listAreaContainer}>
          <View style={styles.panelHeaderRow}>
            <Text style={styles.panelHeaderText}>Active Budgets</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtnText}>View all</Text>
            </TouchableOpacity>
          </View>

          {hasBudgets ? (
            <View style={styles.budgetListContainer}>
              {budgets.map((budget) => (
                <BudgetCard 
                  key={budget.id} 
                  budget={budget} 
                  onPress={() => router.push({ pathname: '/budget/detail', params: { id: budget.id } })} 
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
               <View style={styles.emptyImgCircle}>
                  <Image 
                    source={require("../../../assets/images/no-recurring.svg")} 
                    style={styles.illustrationImage}
                    resizeMode="contain"
                  />
               </View>
               <Text style={styles.emptyStateMainText}>No budget set yet</Text>
               <Text style={styles.emptyStateSubText}>Set a budget to track and control your spending</Text>
            </View>
          )}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  headerBackground: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: SPACING.LG,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: Fonts.bold,
    color: WHITE,
    fontSize: 18,
    marginLeft: SPACING.SM,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatarImage: {
    width: 38,
    height: 38,
  },
  headerTitleLabel: {
    fontFamily: Fonts.medium,
    color: WHITE,
    fontSize: 12,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
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
    marginTop: 8,
  },
  darkSummaryCard: {
    elevation: 0,
    shadowOpacity: 0,
  },
  emptyHeaderContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyHeaderTitle: {
    fontFamily: Fonts.bold,
    color: WHITE,
    fontSize: 24,
    textAlign: 'center',
  },
  listAreaContainer: {
    marginTop: -40,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    minHeight: 500,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    marginBottom: 16,
  },
  panelHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  viewAllBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollAreaContent: {
    paddingBottom: 0,
  },
  budgetListContainer: {
    paddingHorizontal: SPACING.LG,
  },
  budgetCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  budgetCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetCategoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  budgetTextStack: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryNameText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  amountTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  spentAmountText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  remainingSubtextRow: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
  rightCircleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  progressRingWrapper: {
    //
  },
  progressRingText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: SPACING.LG,
  },
  emptyImgCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  emptyStateMainText: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  externalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  monthCol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  monthLabelText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#A5D6A7', 
    letterSpacing: 0.5,
  },
  verticalDividerLine: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  growthCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  growthLabelText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#A5D6A7',
    marginLeft: 4,
  },
});

export default BudgetScreen;
