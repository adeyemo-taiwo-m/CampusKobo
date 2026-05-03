import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { DarkCard } from "../../components/DarkCard";
import { EmptyState } from "../../components/EmptyState";
import { OfflineBanner } from "../../components/OfflineBanner";
import { Toast } from "../../components/Toast";
import {
  ACCENT_GREEN,
  BACKGROUND,
  Fonts,
  PRIMARY_GREEN,
  SPACING,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  WHITE,
} from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, getPercentage, getProgressColor } from "../../utils/formatters";

interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  daysLeft?: number;
}

const BudgetCard = ({ budget, onPress }: { budget: Budget; onPress: () => void }) => {
  const currentProgress = (budget as any).percent / 100 || 0;
  const percentage = (budget as any).percent || 0;
  const remaining = (budget as any).remaining || 0;
  const statusColor = getProgressColor(percentage); 
  
  return (
    <TouchableOpacity style={styles.budgetCard} onPress={onPress}>
      <View style={styles.budgetCardContent}>
        <View style={styles.budgetCategoryInfo}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name={budget.icon || 'wallet-outline'} size={22} color={PRIMARY_GREEN} />
          </View>
          <View style={styles.budgetTextStack}>
            <Text style={styles.categoryNameText}>{budget.category}</Text>
            <View style={styles.amountTextRow}>
               <Text style={styles.spentAmountText}>{formatCurrency(budget.spentAmount)}/{formatCurrency(budget.limitAmount)}</Text>
            </View>
            <Text style={styles.remainingSubtextRow}>{formatCurrency(remaining)} left • {budget.daysLeft || 0} days remaining</Text>
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
  const { 
    enrichedBudgets, 
    isLoading, 
    user, 
    apiUser,
    totalBudgetLimit,
    totalBudgetSpent,
    budgetUsedPercent,
    getDaysLeftThisMonth 
  } = useAppContext();
  const { toastProps, showToast } = useToast();
  const hasBudgets = enrichedBudgets.length > 0;
  
  // Icon Mapping function
  const getIconForCategory = (category: string | undefined | null): keyof typeof Ionicons.glyphMap => {
    if (!category) return 'wallet-outline';
    
    switch (category.toLowerCase()) {
      case 'food': return 'restaurant-outline';
      case 'data & airtime':
      case 'airtime':
      case 'data': return 'wifi-outline';
      case 'transport': return 'car-outline';
      case 'shopping': return 'cart-outline';
      case 'medical':
      case 'health': return 'heart-outline';
      default: return 'wallet-outline';
    }
  };

  const currentMonthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OfflineBanner />
      
      {/* Seamless Header Hero Region */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerContent}>
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
                      {(apiUser?.full_name || user?.name || 'CK')
                        .split(' ')
                        .filter(Boolean)
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .substring(0, 2) || 'CK'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.welcomeText}>Hi, {(apiUser?.full_name || user?.name)?.split(' ')[0] || 'there'}</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/learning")}>
                <Ionicons name="school-outline" size={22} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile/notifications")}>
                <Ionicons name="notifications-outline" size={22} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>
          
          {hasBudgets ? (
            <View style={styles.summaryCardWrapper}>
              <Text style={styles.headerTitleLabelCentered}>Budget</Text>
              <DarkCard
                type="expenses"
                amount={totalBudgetSpent}
                label="Total Budget"
                periodLabel={currentMonthLabel}
                progress={budgetUsedPercent / 100}
                statusCaption={`You've spent ${budgetUsedPercent}% of your total budget`}
                style={styles.summaryCard}
              />
            </View>
          ) : (
            <View style={styles.emptyHeaderContent}>
               <Text style={styles.headerTitleLabelCentered}>Budget</Text>
               <Text style={styles.emptyHeaderTitle}>No budget set yet</Text>
            </View>
          )}
        </SafeAreaView>
      </View>

      {/* Main Budget List Area wrapped in curved container */}
      <View style={styles.mainContentWrapper}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.listAreaContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.panelHeaderRow}>
            <Text style={styles.panelHeaderText}>Active Budgets</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtnText}>View all</Text>
            </TouchableOpacity>
          </View>

          {hasBudgets ? (
            <View style={styles.budgetListContainer}>
                {enrichedBudgets.map((budget: any) => {
                  return (
                    <BudgetCard 
                      key={budget.id} 
                      budget={{
                        ...budget,
                        icon: getIconForCategory(budget.category) || 'wallet-outline',
                        daysLeft: getDaysLeftThisMonth(),
                        iconColor: '#3CB96A'
                      }} 
                      onPress={() => router.push({ pathname: '/budget/detail', params: { id: budget.id } })} 
                    />
                  );
                })}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
            <EmptyState
              icon="wallet-outline"
              title="No budget set yet"
              subtitle="Set a budget to track and control your spending"
            />
          </View>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

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
  headerBackground: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: SPACING.LG,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XXL,
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  headerTitleLabelCentered: {
    fontFamily: Fonts.medium,
    color: WHITE,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCardWrapper: {
    paddingHorizontal: SPACING.LG,
    marginTop: 8,
  },
  summaryCard: {
    // Custom style if needed
  },
  mainContentWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  emptyHeaderContent: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  emptyHeaderTitle: {
    fontFamily: Fonts.medium,
    color: WHITE,
    fontSize: 28,
    marginTop: 8,
  },
  listAreaContainer: {
    paddingTop: 30,
    paddingBottom: 100,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default BudgetScreen;
