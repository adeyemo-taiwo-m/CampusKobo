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
import { useNavigation } from '@react-navigation/native';
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
            <Ionicons name={budget.icon} size={20} color="#388E3C" />
          </View>
          <View style={styles.budgetTextContainer}>
            <Text style={styles.categoryNameText}>{budget.category}</Text>
            <View style={styles.amountRow}>
               <Text style={styles.spentBold}>₦{budget.spentAmount.toLocaleString()}</Text>
               <Text style={styles.limitText}>/₦{budget.limitAmount.toLocaleString()}</Text>
            </View>
            <Text style={styles.cardSubtext}>₦{remaining.toLocaleString()} left • {budget.daysLeft} days remaining</Text>
          </View>
        </View>
        
        <View style={styles.circularProgressContainer}>
          <Progress.Circle
            size={48}
            progress={0.75} // Following prompt: "circular arc progress ring ... showing 30% in green" 
            // Wait, prompt says ring showing 30% in green, but the arc is ~75% coverage?
            // Actually: "thin circle, ~75% arc in green, remaining in light gray, percentage text centered in ring"
            unfilledColor="#E0E0E0"
            color={SUCCESS}
            thickness={3}
            borderWidth={0}
            showsText
            formatText={() => "30%"}
            textStyle={styles.circlePercentageText}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BudgetScreen = () => {
  const navigation = useNavigation<any>();
  // Toggle budgets here to see both states
  const [budgets] = useState<Budget[]>(SAMPLE_BUDGETS);
  const hasBudgets = budgets.length > 0;
  
  const totalBudget = 50000;
  const totalSpent = 30000;
  const totalRemaining = totalBudget - totalSpent;
  const totalProgress = totalSpent / totalBudget;

  const currentMonth = "OCTOBER 2025";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Green Header Section */}
      <View style={styles.headerSection}>
        <SafeAreaView>
          <View style={styles.topHeaderRow}>
            <View style={styles.profileArea}>
              <View style={styles.avatarCircle}>
                <Image 
                   source={require("../../../assets/images/avatar.jpeg")} 
                   style={styles.avatarImage} 
                />
              </View>
              <Text style={styles.greetingText}>Hi, Taiwo</Text>
            </View>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Budget</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconButton}>
                <Ionicons name="school-outline" size={20} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerIconButton, styles.bellButton]}>
                <Ionicons name="notifications" size={20} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Budget Summary Content */}
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
            showMeta={hasBudgets}
            style={styles.summaryCard}
          />
        </SafeAreaView>
      </View>

      {/* White Content Panel (Bottom Sheet style) */}
      <View style={styles.contentPanel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Active Budgets</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {hasBudgets ? (
            budgets.map((budget) => (
              <BudgetCard 
                key={budget.id} 
                budget={budget} 
                onPress={() => {}} 
              />
            ))
          ) : (
            <View style={styles.emptyStateCenter}>
               <View style={styles.illustrationPlaceholder}>
                 {/* Simplified Illustration using View & Icons */}
                 <View style={styles.illustrationCircle}>
                    <Ionicons name="sync-outline" size={120} color="rgba(60, 185, 106, 0.2)" />
                    <View style={styles.illustrationIconsOverlay}>
                       <Ionicons name="wallet-outline" size={32} color="#3CB96A" />
                       <Ionicons name="receipt-outline" size={24} color="#3CB96A" style={{ marginLeft: 16 }} />
                    </View>
                 </View>
               </View>
               <Text style={styles.emptyStateTitle}>No budget set yet</Text>
               <Text style={styles.emptyStateSubtitle}>Set a budget to track and control your spending</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FOREST_GREEN, 
  },
  headerSection: {
    backgroundColor: FOREST_GREEN,
    paddingBottom: 40,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    height: 60,
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: WHITE,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellButton: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  summaryContent: {
    paddingHorizontal: SPACING.LG,
    marginTop: 24,
  },
  summaryLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#A5D6A7', // Light green muted
    marginBottom: 4,
  },
  totalAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  totalAmountMain: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: WHITE,
  },
  totalAmountSecondary: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 2,
  },
  mainProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarWrapper: {
    flex: 1,
    marginRight: 12,
  },
  progressPercentLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: WHITE,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  remainingText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: WHITE,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT_GREEN,
    marginHorizontal: 8,
  },
  motivationText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: ACCENT_GREEN, // Bright accent green
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: WHITE,
  },
  verticalSeparator: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
  comparisonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  emptyHeaderContent: {
    marginVertical: 10,
  },
  emptyHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: WHITE,
  },
  contentPanel: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20, // Overlap the header
    paddingTop: 24,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    marginBottom: 16,
  },
  panelTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: '#000000',
  },
  viewAllText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100,
  },
  budgetCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  budgetTextContainer: {
    flex: 1,
  },
  categoryNameText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  spentBold: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  limitText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginLeft: 1,
  },
  cardSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  circularProgressContainer: {
    marginLeft: 8,
  },
  circlePercentageText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: TEXT_PRIMARY,
  },
  emptyStateCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  illustrationPlaceholder: {
    marginBottom: 24,
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(60, 185, 106, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationIconsOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default BudgetScreen;
