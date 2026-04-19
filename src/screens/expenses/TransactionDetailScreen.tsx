import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  StatusBar,
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  SPACING, 
  Fonts,
  BACKGROUND,
  RED 
} from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { Transaction } from '../../types';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { ProgressBar } from '../../components/ProgressBar';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { transactions, deleteTransaction, budgets } = useAppContext();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Find the transaction
  const transaction = transactions.find(t => t.id === params.id) as Transaction;

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Text>Transaction not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: PRIMARY_GREEN, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';
  const dateObj = new Date(transaction.date);
  
  // Find related budget for impact section
  const relatedBudget = budgets.find(b => b.category === transaction.category);
  const budgetProgress = relatedBudget ? (relatedBudget.spentAmount / relatedBudget.limitAmount) * 100 : 0;
  const remainingBudget = relatedBudget ? Math.max(0, relatedBudget.limitAmount - relatedBudget.spentAmount) : 0;

  const handleDelete = async () => {
    await deleteTransaction(transaction.id);
    setShowDeleteModal(false);
    router.back();
  };

  const handleEdit = () => {
    router.push({
      pathname: '/add-transaction',
      params: { transaction: JSON.stringify(transaction) }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Section (Green Zone) */}
      <View style={styles.headerZone}>
        <SafeAreaView>
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} color={WHITE} />
            </TouchableOpacity>
            
            <Text style={styles.navTitle}>Transactions Details</Text>
            
            <TouchableOpacity 
              style={styles.editButtonTop}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonTextTop}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Amount Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroAmount}>
              {isIncome ? '+' : '−'}₦{transaction.amount.toLocaleString()}
            </Text>
            
            <View style={styles.categoryRow}>
              <View style={[
                styles.categoryBadge, 
                { backgroundColor: isIncome ? '#2DBB6D' : '#FFE6E6' }
              ]}>
                <Ionicons 
                  name={transaction.categoryIcon as any} 
                  size={20} 
                  color={isIncome ? WHITE : '#E03A3A'} 
                />
              </View>
              <Text style={styles.categoryNameText}>{transaction.category}</Text>
            </View>

            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>This Month</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* White Content Card (Bottom Zone) */}
      <View style={styles.contentZone}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Detail Rows List */}
          <View style={styles.detailsList}>
            <DetailRow 
              icon="calendar-outline" 
              label="Date & Time" 
              value={dateObj.toLocaleString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              })} 
            />
            <DetailRow 
              icon="pencil-outline" 
              label="Description" 
              value={transaction.description} 
            />
            <DetailRow 
              icon="card-outline" 
              label="Payment Method" 
              value="Main Wallet" 
            />
            {!isIncome && (
              <DetailRow 
                icon="bar-chart-outline" 
                label="Budget Category" 
                value={`${transaction.category} (₦${relatedBudget?.spentAmount.toLocaleString() || 0} /₦${relatedBudget?.limitAmount.toLocaleString() || 0} used)`} 
              />
            )}
            <DetailRow 
              icon="clipboard-outline" 
              label="Notes" 
              value={transaction.note || "Received from employer"} 
              isLast
            />
          </View>

          {/* Budget Impact Widget (Expenses Only) */}
          {!isIncome && relatedBudget && (
            <View style={styles.impactWidget}>
              <View style={styles.impactHeader}>
                <Text style={styles.impactLabel}>Budget Impact: <Text style={styles.impactCategory}>{transaction.category}</Text></Text>
                <Text style={styles.impactPercent}>{Math.round(budgetProgress)}%</Text>
              </View>
              
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, budgetProgress)}%` }]} />
              </View>
              
              <Text style={styles.impactCaption}>
                You've now used {Math.round(budgetProgress)}% of your {transaction.category} budget this month, ₦{remainingBudget.toLocaleString()} left before you hit your limit
              </Text>
            </View>
          )}

          {/* Add Receipt Button */}
          <TouchableOpacity 
            style={styles.addReceiptButton}
            onPress={() => Alert.alert('Coming Soon', 'Receipt upload coming soon')}
          >
            <Ionicons name="camera-outline" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
            <Text style={styles.addReceiptText}>Add Receipt</Text>
          </TouchableOpacity>

          {/* Bottom Action Space */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Fixed Pinned Footer Actions */}
        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={styles.editFullButton}
            onPress={handleEdit}
          >
            <Text style={styles.editFullButtonText}>Edit Transaction</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteFullButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteFullButtonText}>Delete Transaction</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DeleteConfirmModal 
        isVisible={showDeleteModal}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

function DetailRow({ icon, label, value, isLast }: { icon: any, label: string, value: string, isLast?: boolean }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailRowDivider]}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
        <Text style={styles.detailLabelText}>{label}</Text>
      </View>
      <Text style={styles.detailValueText} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  headerZone: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: 24,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16773d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  editButtonTop: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#d1fae5', 
    borderRadius: 10,
  },
  editButtonTextTop: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  heroCard: {
    marginHorizontal: 16,
    backgroundColor: '#1d7c43',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  heroAmount: {
    fontSize: 42,
    fontFamily: Fonts.bold,
    color: WHITE,
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryNameText: {
    color: WHITE,
    fontSize: 18,
    fontFamily: Fonts.medium,
  },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  timeBadgeText: {
    color: WHITE,
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  contentZone: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  detailsList: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 20,
  },
  detailRowDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabelText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#9CA3AF',
  },
  detailValueText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#1F2937',
    maxWidth: '60%',
  },
  impactWidget: {
    marginHorizontal: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Fonts.regular,
  },
  impactCategory: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: Fonts.bold,
  },
  impactPercent: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#C8F0D8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
  },
  impactCaption: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: Fonts.regular,
  },
  addReceiptButton: {
    marginHorizontal: 16,
    height: 52,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addReceiptText: {
    fontSize: 15,
    color: '#4B5563',
    fontFamily: Fonts.medium,
  },
  footerActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  editFullButton: {
    flex: 0.55,
    height: 52,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editFullButtonText: {
    color: WHITE,
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  deleteFullButton: {
    flex: 0.45,
    height: 52,
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteFullButtonText: {
    color: '#E03A3A',
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  }
});
