import { Ionicons } from "@expo/vector-icons";
import {
  format,
  isThisMonth,
  isThisWeek,
  isToday,
  isYesterday,
  subMonths,
} from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DarkCard } from "../../components/DarkCard";
import { EmptyState } from "../../components/EmptyState";
import { ExportBottomSheet } from "../../components/ExportBottomSheet";
import { InputField } from "../../components/InputField";
import { MainHeader } from "../../components/MainHeader";
import { OfflineBanner } from "../../components/OfflineBanner";
import { Toast } from "../../components/Toast";
import { TransactionCard } from "../../components/TransactionCard";
import {
  BACKGROUND,
  BORDER_GRAY,
  Fonts,
  PRIMARY_GREEN,
  SPACING,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  WHITE,
} from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "../../hooks/useToast";

type FilterType = "This Month" | "Last Month" | "This Week" | "All";

export default function ExpensesListScreen() {
  const router = useRouter();
  const {
    transactions,
    budgets,
    isLoading,
    user,
    apiUser,
    totalBudgetLimit,
    totalBudgetSpent,
    budgetUsedPercent,
    totalIncomeThisMonth,
    totalExpensesThisMonth,
    loadAllData,
  } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<FilterType>("This Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toastProps, showToast } = useToast();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAllData();
      showToast("Data synced with backend", "success");
    } catch (error) {
      showToast("Sync failed. Check your connection.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    // Status Filter
    const now = new Date();
    if (activeFilter === "This Month") {
      list = list.filter((t) => isThisMonth(new Date(t.date)));
    } else if (activeFilter === "Last Month") {
      const lastMonth = subMonths(now, 1);
      list = list.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === lastMonth.getMonth() &&
          d.getFullYear() === lastMonth.getFullYear()
        );
      });
    } else if (activeFilter === "This Week") {
      list = list.filter((t) => isThisWeek(new Date(t.date)));
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query),
      );
    }

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions, activeFilter, searchQuery]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof transactions } = {};
    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      let dateLabel = format(date, "MMM d, yyyy");
      if (isToday(date)) dateLabel = "Today";
      else if (isYesterday(date)) dateLabel = "Yesterday";

      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const handleExport = (format: "pdf" | "excel") => {
    setIsExportVisible(false);
    Alert.alert(
      "Export feature coming soon",
      `Exporting as ${format.toUpperCase()}...`,
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OfflineBanner />

      {/* ── Green Hero Region ─────────────────────── */}
      <View style={styles.headerBackground}>
        <MainHeader title="Expenses" />

        {/* Reusable Dark Summary Card */}
        <DarkCard
          type="expenses"
          amount={totalExpensesThisMonth}
          income={totalIncomeThisMonth}
          expenses={totalExpensesThisMonth}
          progress={budgetUsedPercent / 100}
          periodLabel={
            activeFilter === "This Month"
              ? new Date()
                  .toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                  .toUpperCase()
              : activeFilter === "Last Month"
                ? subMonths(new Date(), 1)
                    .toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()
                : activeFilter.toUpperCase()
          }
          statusCaption={`You've spent ${budgetUsedPercent}% of your monthly budget`}
          style={styles.summaryCard}
        />
      </View>

      <View style={styles.mainContentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={PRIMARY_GREEN}
              colors={[PRIMARY_GREEN]}
            />
          }
        >
          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersWrapper}
          >
            {(
              ["This Month", "This Week", "Last Month", "All"] as FilterType[]
            ).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.activeFilterChip,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText,
                  ]}
                >
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
                leftIcon={
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={TEXT_SECONDARY}
                  />
                }
              />
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/expenses/recurring")}
            >
              <Ionicons name="repeat" size={22} color={PRIMARY_GREEN} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsExportVisible(true)}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={PRIMARY_GREEN}
              />
            </TouchableOpacity>
          </View>

          {/* Export Bottom Sheet */}
          <ExportBottomSheet
            isVisible={isExportVisible}
            onClose={() => setIsExportVisible(false)}
            onExport={handleExport}
          />

          {/* Transactions List */}
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([date, items]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {items.map((item) => (
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
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        </View>
      )}

      <Toast {...toastProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  headerBackground: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: SPACING.LG,
  },
  mainContentWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XXL,
    marginBottom: 12,
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
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatarImage: {
    width: 38,
    height: 38,
  },
  initialsAvatar: {
    width: 38,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
    marginBottom: 12,
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
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
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
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  dateGroup: {
    paddingHorizontal: SPACING.LG,
    marginBottom: 24,
  },
  dateHeader: {
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
