import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Progress from 'react-native-progress';
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
import { TransactionCard } from '../../components/TransactionCard';

export const BudgetDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Mock data
  const budget = {
    id: id || '1',
    category: 'Food',
    icon: 'restaurant-outline',
    color: '#FF6B6B',
    limitAmount: 50000,
    spentAmount: 32000,
    daysLeft: 12,
  };

  const progress = budget.spentAmount / budget.limitAmount;
  const percent = Math.round(progress * 100);
  const remaining = budget.limitAmount - budget.spentAmount;

  const transactions = [
    { id: 't1', title: 'Lunch at Optop', amount: 2500, type: 'expense', date: 'Today, 2:15 PM', category: 'Food', icon: 'restaurant-outline' },
    { id: 't2', title: 'Dinner', amount: 3000, type: 'expense', date: 'Yesterday, 8:45 PM', category: 'Food', icon: 'restaurant-outline' },
    { id: 't3', title: 'Groceries', amount: 15000, type: 'expense', date: 'Apr 15, 10:20 AM', category: 'Food', icon: 'restaurant-outline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerHeroRegion}>
        <SafeAreaView>
          <Header 
            title="Budget Details" 
            showBack={true} 
            onBack={() => router.back()}
            showEdit={true}
            onEdit={() => {/* Navigate to Edit */}}
            whiteTheme={true}
          />

          <View style={styles.summaryCardWrapper}>
            <DarkCard type="balance" amount={budget.spentAmount}>
               <View style={styles.darkCardInner}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconCircle, { backgroundColor: budget.color }]}>
                        <Ionicons name={budget.icon as any} size={24} color={WHITE} />
                    </View>
                    <View>
                        <Text style={styles.catName}>{budget.category}</Text>
                        <Text style={styles.goalText}>₦{budget.spentAmount.toLocaleString()} / ₦{budget.limitAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.progressRing}>
                      <Progress.Circle 
                        size={60} 
                        progress={progress} 
                        color={percent > 90 ? '#EF4444' : percent > 70 ? '#F59E0B' : '#00CFB5'} 
                        unfilledColor="rgba(255,255,255,0.1)"
                        borderWidth={0}
                        thickness={5}
                        showsText={true}
                        formatText={() => `${percent}%`}
                        textStyle={{ fontFamily: Fonts.bold, fontSize: 12, color: WHITE }}
                      />
                    </View>
                  </View>
                  <Text style={styles.metaLine}>
                     ₦{remaining.toLocaleString()} left • {budget.daysLeft} days remaining
                  </Text>
               </View>
            </DarkCard>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Summary Mini Cards */}
          <View style={styles.miniStatsGrid}>
             <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>Daily Average</Text>
                <Text style={styles.miniStatValue}>₦1,850</Text>
             </View>
             <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>Highest Spend</Text>
                <Text style={styles.miniStatValue}>₦15,000</Text>
             </View>
             <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>Days Left</Text>
                <Text style={styles.miniStatValue}>{budget.daysLeft}</Text>
             </View>
          </View>

          {/* Status Alert Card */}
          <View style={[
            styles.statusCard, 
            percent > 90 ? styles.statusRed : percent > 70 ? styles.statusYellow : styles.statusGreen
          ]}>
            <Text style={[
                styles.statusText,
                percent > 90 ? styles.textRed : percent > 70 ? styles.textYellow : styles.textGreen
            ]}>
              {percent > 90 
                ? "You've almost exceeded your budget! 🚨" 
                : percent > 70 
                  ? "You're getting close to your limit ⚠️" 
                  : "You're on track with your Food budget 👍"}
            </Text>
          </View>

          {/* Transaction List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{budget.category} Transactions</Text>
          </View>

          <View style={styles.transactionList}>
            {transactions.map((t: any) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllFooter}>
            <Text style={styles.viewAllFooterText}>View all transactions →</Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>Delete Budget</Text>
            </TouchableOpacity>
          </View>
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: WHITE,
  },
  goalText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  progressRing: {
    marginLeft: 'auto',
  },
  metaLine: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
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
    paddingBottom: 40,
  },
  miniStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 10,
  },
  miniStatCard: {
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
  statusCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  statusGreen: { backgroundColor: '#F0FDF4' },
  statusYellow: { backgroundColor: '#FFFBEB' },
  statusRed: { backgroundColor: '#FEF2F2' },
  statusText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  textGreen: { color: '#16A34A' },
  textYellow: { color: '#D97706' },
  textRed: { color: '#EF4444' },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  transactionList: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  viewAllFooter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  viewAllFooterText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  actionButtons: {
    gap: 12,
  },
  editBtn: {
    backgroundColor: PRIMARY_GREEN,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
  deleteBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  deleteBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#EF4444',
  }
});

export default BudgetDetailScreen;
