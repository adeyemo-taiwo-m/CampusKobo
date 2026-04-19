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
  const remainingBudget = relatedBudget ? relatedBudget.limitAmount - relatedBudget.spentAmount : 0;

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
      
      {/* Header Section (Green) */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} color={WHITE} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Transactions Details</Text>
            
            <TouchableOpacity 
              style={styles.editHeaderButton}
              onPress={handleEdit}
            >
              <Text style={styles.editHeaderText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroAmount}>
              {isIncome ? '+' : '-'}₦{transaction.amount.toLocaleString()}
            </Text>
            
            <View style={styles.categoryBadge}>
              <View style={[styles.iconCircle, { backgroundColor: WHITE }]}>
                <Ionicons name={transaction.categoryIcon as any} size={20} color={transaction.categoryColor || PRIMARY_GREEN} />
              </View>
              <Text style={styles.categoryName}>{transaction.category}</Text>
            </View>

            <View style={styles.monthBadge}>
              <Text style={styles.monthText}>This Month</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Details Section (White) */}
      <View style={styles.detailsSection}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Info Rows */}
          <View style={styles.infoList}>
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
              icon="create-outline" 
              label="Description" 
              value={transaction.description} 
            />
            <DetailRow 
              icon="wallet-outline" 
              label="Payment Method" 
              value="Main Wallet" 
            />
            {!isIncome && (
              <DetailRow 
                icon="grid-outline" 
                label="Budget Category" 
                value={`${transaction.category} (₦${relatedBudget?.spentAmount.toLocaleString() || 0} /₦${relatedBudget?.limitAmount.toLocaleString() || 0} used)`} 
              />
            )}
            <DetailRow 
              icon="document-text-outline" 
              label="Notes" 
              value={transaction.note || "No notes added"} 
            />
          </View>

          {/* Budget Impact (Expenses Only) */}
          {!isIncome && relatedBudget && (
            <View style={styles.impactCard}>
              <View style={styles.impactHeader}>
                <Text style={styles.impactTitle}>Budget Impact: <Text style={{ fontFamily: Fonts.bold }}>{transaction.category}</Text></Text>
                <Text style={styles.impactPercent}>{Math.round(budgetProgress)}%</Text>
              </View>
              
              <ProgressBar progress={budgetProgress} height={8} />
              
              <Text style={styles.impactFooter}>
                You've now used {Math.round(budgetProgress)}% of your {transaction.category} budget this month, ₦{remainingBudget.toLocaleString()} left before you hit your limit
              </Text>
            </View>
          )}

          {/* Add Receipt Button */}
          <TouchableOpacity 
            style={styles.receiptButton}
            onPress={() => Alert.alert('Coming Soon', 'Receipt upload coming soon')}
          >
            <Ionicons name="camera-outline" size={20} color={TEXT_SECONDARY} style={{ marginRight: 8 }} />
            <Text style={styles.receiptText}>Add Receipt</Text>
          </TouchableOpacity>

          {/* Footer Actions */}
          <View style={styles.footerActions}>
            <TouchableOpacity 
              style={styles.primaryActionButton}
              onPress={handleEdit}
            >
              <Text style={styles.primaryActionText}>Edit Transaction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteActionButton}
              onPress={() => setShowDeleteModal(true)}
            >
              <Text style={styles.deleteActionText}>Delete Transaction</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <DeleteConfirmModal 
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelGroup}>
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  header: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: WHITE,
  },
  editHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
  },
  editHeaderText: {
    color: '#059669',
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  heroCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  heroAmount: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    color: WHITE,
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryName: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  monthBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  monthText: {
    color: WHITE,
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  detailsSection: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  infoList: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '40%',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
    textAlign: 'right',
    flex: 1,
  },
  impactCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactTitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#374151',
  },
  impactPercent: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#10B981',
  },
  impactFooter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 18,
    fontFamily: Fonts.regular,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginBottom: 40,
  },
  receiptText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
  },
  footerActions: {
    gap: 16,
  },
  primaryActionButton: {
    height: 56,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  deleteActionButton: {
    height: 56,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
