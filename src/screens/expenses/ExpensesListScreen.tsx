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
import { DarkCard } from '../../components/DarkCard';
import { InputField } from '../../components/InputField';
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

          {/* Reusable Dark Summary Card */}
          <DarkCard
            type="expenses"
            amount={totalExpenses}
            income={totalIncome}
            expenses={totalExpenses}
            progress={budgetProgress}
            periodLabel="This Month"
            statusCaption={`You've spent ${Math.round(budgetProgress * 100)}% of your monthly budget`}
            style={styles.summaryCard}
          />
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
          <View style={styles.searchBarContainer}>
            <InputField
              placeholder="Search transactions or categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              prefix="" // No prefix needed here
              style={styles.searchInputCustom}
              outerContainerStyle={styles.searchFieldOuter}
              leftIcon={<Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} />}
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
    marginHorizontal: SPACING.LG,
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchBarContainer: {
    flex: 1,
  },
  searchFieldOuter: {
    marginBottom: 0,
  },
  searchInputCustom: {
    fontFamily: Fonts.regular,
    fontSize: 14,
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
});
