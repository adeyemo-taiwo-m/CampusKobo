import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  TextInput,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  SPACING, 
  Fonts,
  BORDER_GRAY 
} from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { TransactionCard } from '../../components/TransactionCard';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, subMonths } from 'date-fns';

type FilterType = 'This Month' | 'Last Month' | 'This Week' | 'All';

export default function ExpensesListScreen() {
  const router = useRouter();
  const { transactions, budgets } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<FilterType>('This Month');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper calculation for budget progress
  const budgetTotal = useMemo(() => budgets.reduce((sum, b) => sum + b.limitAmount, 0), [budgets]);
  const budgetSpent = useMemo(() => budgets.reduce((sum, b) => sum + b.spentAmount, 0), [budgets]);
  const budgetProgress = budgetTotal > 0 ? budgetSpent / budgetTotal : 0;

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    // Status Filter
    const now = new Date();
    if (activeFilter === 'This Month') {
      list = list.filter(t => isThisMonth(new Date(t.date)));
    } else if (activeFilter === 'Last Month') {
      const lastMonth = subMonths(now, 1);
      list = list.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
      });
    } else if (activeFilter === 'This Week') {
      list = list.filter(t => isThisWeek(new Date(t.date)));
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.description.toLowerCase().includes(query) || 
        t.category.toLowerCase().includes(query)
      );
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, activeFilter, searchQuery]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof transactions } = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      let dateLabel = format(date, 'MMM d, yyyy');
      if (isToday(date)) dateLabel = 'Today';
      else if (isYesterday(date)) dateLabel = 'Yesterday';
      
      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const totalIncome = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), 
  [filteredTransactions]);

  const totalExpenses = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), 
  [filteredTransactions]);

  const handleExport = () => {
    Alert.alert('Export Transactions', 'Choose export format', [
      { text: 'Export as PDF', onPress: () => Alert.alert('Export feature coming soon') },
      { text: 'Export as Excel', onPress: () => Alert.alert('Export feature coming soon') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header same as Dashboard */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.profileSection}
              onPress={() => router.push("/profile")}
            >
              <View style={styles.avatar}>
                <Image source={require("../../../assets/images/avatar.jpeg")} style={styles.avatarImage} />
              </View>
              <Text style={styles.welcomeText}>Hi, Taiwo</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Expenses</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/learning")}>
                <Ionicons name="school-outline" size={22} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/notifications")}>
                <Ionicons name="notifications-outline" size={22} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryPeriod}>This Month</Text>
              <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
            </View>
            
            <View style={styles.amountContainer}>
              <Text style={styles.summaryAmount}>₦{totalExpenses.toLocaleString()}</Text>
              <Text style={styles.spentLabel}>spent</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="arrow-up" size={12} color="#4ADE80" style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={styles.incomeValue}>+₦{totalIncome.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="arrow-down" size={12} color="#F87171" style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text style={styles.expenseValue}>-₦{totalExpenses.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarWrapper}>
                <ProgressBar progress={budgetProgress} />
              </View>
              <Text style={styles.progressText}>{Math.round(budgetProgress * 100)}%</Text>
            </View>
            <Text style={styles.budgetStatus}>
              You've spent {Math.round(budgetProgress * 100)}% of your monthly budget
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrapper}>
          {(['This Month', 'Last Month', 'All', 'This Week'] as FilterType[]).map(filter => (
            <TouchableOpacity 
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search & Actions */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions or categories..."
              placeholderTextColor={TEXT_SECONDARY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/recurring")}>
            <Ionicons name="swap-horizontal" size={22} color={PRIMARY_GREEN} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
            <Ionicons name="document-text-outline" size={22} color={PRIMARY_GREEN} />
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {items.map(item => (
                <TransactionCard 
                  key={item.id}
                  transaction={item}
                  onPress={() => router.push(`/transaction/${item.id}`)}
                />
              ))}
            </View>
          ))
        ) : (
          <EmptyState 
            icon="receipt-outline"
            title="No transactions found"
            subtitle="Try adjusting your filters or adding a new record"
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerBackground: {
    backgroundColor: PRIMARY_GREEN,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: SPACING.LG,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: Fonts.semiBold,
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
  headerTitle: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 16,
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
  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: SPACING.LG,
    borderRadius: 24,
    padding: SPACING.LG,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryPeriod: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: Fonts.medium,
    fontSize: 13,
    marginRight: 6,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16,
  },
  summaryAmount: {
    color: WHITE,
    fontFamily: Fonts.bold,
    fontSize: 36,
  },
  spentLabel: {
    color: WHITE,
    fontFamily: Fonts.regular,
    fontSize: 18,
    marginLeft: 8,
    marginBottom: 6,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontFamily: Fonts.regular,
  },
  incomeValue: {
    color: WHITE,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  expenseValue: {
    color: WHITE,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  progressBarWrapper: {
    flex: 1,
    marginRight: 12,
  },
  progressText: {
    color: WHITE,
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
  budgetStatus: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginTop: 12,
  },
  scrollContent: {
    paddingTop: 24,
  },
  filtersWrapper: {
    paddingLeft: SPACING.LG,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  filterText: {
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  activeFilterText: {
    color: WHITE,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    gap: 10,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginLeft: 10,
  },
  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  dateGroup: {
    paddingHorizontal: SPACING.LG,
    marginBottom: 24,
  },
  dateHeader: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  viewAllText: {
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
});
