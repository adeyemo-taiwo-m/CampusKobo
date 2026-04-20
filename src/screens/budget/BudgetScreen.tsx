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
  SUCCESS,
  DARK_GREEN,
  ACCENT_GREEN,
  FOREST_GREEN,
  BORDER_GRAY,
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
    spentAmount: 2000,
    limitAmount: 8000,
    daysLeft: 6,
  },
  {
    id: '3',
    category: 'Transport',
    icon: 'car-outline',
    iconColor: '#3CB96A',
    spentAmount: 9000,
    limitAmount: 10000,
    daysLeft: 6,
  },
];

const BudgetCard = ({ budget, onPress }: { budget: Budget; onPress: () => void }) => {
  const progress = budget.spentAmount / budget.limitAmount;
  const remaining = budget.limitAmount - budget.spentAmount;
  
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
               <Text style={styles.spentAmountText}>₦{budget.spentAmount.toLocaleString()}</Text>
               <Text style={styles.limitAmountSuffix}>/₦{budget.limitAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightCircleContainer}>
          <View style={styles.progressRingWrapper}>
            <Progress.Circle
              size={50}
              progress={0.75}
              unfilledColor="#F3F4F6"
              color={ACCENT_GREEN}
              thickness={4}
              borderWidth={0}
              showsText
              formatText={() => "30%"}
              textStyle={styles.progressRingText}
            />
          </View>
          <Text style={styles.remainingSubtext}>₦{remaining.toLocaleString()} left • {budget.daysLeft}d</Text>
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
  const totalSpent = 30000;
  const totalRemaining = totalBudget - totalSpent;

  const currentMonth = "OCTOBER 2025";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Seamless Header Hero Region */}
      <View style={styles.headerHeroRegion}>
        <SafeAreaView>
          <View style={styles.topNavRow}>
            <View style={styles.profileGreeting}>
              <View style={styles.avatarWrap}>
                <Image 
                   source={require("../../../assets/images/avatar.jpeg")} 
                   style={styles.avatarImg} 
                />
              </View>
              <Text style={styles.greetingTitle}>Hi, Taiwo</Text>
            </View>
            
            <View style={styles.centerTitleWrap}>
              <Text style={styles.mainTitle}>Budget</Text>
            </View>

            <View style={styles.headerActionBtns}>
              <TouchableOpacity style={styles.headerActionBtn}>
                <Ionicons name="school-outline" size={22} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerActionBtn, styles.bellBtn]}>
                <Ionicons name="notifications" size={22} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Budget Summary Unified Card */}
          <View style={styles.summaryCardWrapper}>
            <DarkCard
              type="budget"
              label={hasBudgets ? "Total budget" : undefined}
              amount={hasBudgets ? totalSpent : 0}
              limitAmount={hasBudgets ? totalBudget : undefined}
              progress={hasBudgets ? 0.64 : 0}
              progressLabel={hasBudgets ? `₦${totalRemaining.toLocaleString()} left • You are doing well` : undefined}
              statusCaption={!hasBudgets ? "No budget set yet" : undefined}
              periodLabel={currentMonth}
              comparisonLabel="12% vs Last month"
              showToggle={hasBudgets}
              style={styles.darkSummaryCard}
            />

            {/* External Meta Row below card */}
            {hasBudgets && (
              <View style={styles.externalMetaRow}>
                <View style={styles.monthCol}>
                  <Text style={styles.monthLabelText}>{currentMonth}</Text>
                  <Ionicons name="calendar-outline" size={18} color="#A5D6A7" style={{ marginLeft: 8 }} />
                </View>
                <View style={styles.verticalDividerLine} />
                <View style={styles.growthCol}>
                  <Ionicons name="arrow-up" size={16} color="#A5D6A7" />
                  <Text style={styles.growthLabelText}>12% vs Last month</Text>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>

      {/* Main Budget List Area */}
      <View style={styles.mainContentPanel}>
        <View style={styles.panelHeaderRow}>
          <Text style={styles.panelHeaderText}>Active Budgets</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtnText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollAreaContent}
          showsVerticalScrollIndicator={false}
        >
          {hasBudgets ? (
            budgets.map((budget) => (
              <BudgetCard 
                key={budget.id} 
                budget={budget} 
                onPress={() => router.push({ pathname: '/budget/detail', params: { id: budget.id } })} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
               <View style={styles.emptyImgCircle}>
                  <Ionicons name="sync-outline" size={100} color="rgba(60, 185, 106, 0.15)" />
                  <View style={styles.emptyIconsLayer}>
                     <Ionicons name="wallet-outline" size={32} color={ACCENT_GREEN} />
                     <Ionicons name="receipt-outline" size={24} color={ACCENT_GREEN} style={{ marginLeft: 16 }} />
                  </View>
               </View>
               <Text style={styles.emptyStateMainText}>No budget set yet</Text>
               <Text style={styles.emptyStateSubText}>Set a budget to track and control your spending</Text>
            </View>
          )}
        </ScrollView>
      </View>
      {/* FAB for Creating Budget */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/budget/create")}
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
    backgroundColor: '#0B5E2F', // Deep forest green
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 48,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    height: 60,
    marginBottom: 16,
  },
  profileGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  greetingTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: WHITE,
  },
  centerTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  mainTitle: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: WHITE,
  },
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBtn: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  summaryCardWrapper: {
    paddingHorizontal: SPACING.LG,
  },
  darkSummaryCard: {
    elevation: 0,
    shadowOpacity: 0,
  },
  mainContentPanel: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 32,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    marginBottom: 20,
  },
  panelHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  viewAllBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#1B5E20',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollAreaContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100,
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
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  amountTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spentAmountText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  limitAmountSuffix: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginLeft: 2,
  },
  rightCircleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  progressRingWrapper: {
    marginBottom: 4,
  },
  progressRingText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: TEXT_PRIMARY,
  },
  remainingSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyImgCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(60, 185, 106, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIconsLayer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateMainText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  externalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  monthCol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  monthLabelText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: '#A5D6A7', 
    letterSpacing: 0.5,
  },
  verticalDividerLine: {
    width: 1,
    height: 24,
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
    fontSize: 14,
    color: '#A5D6A7',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default BudgetScreen;
