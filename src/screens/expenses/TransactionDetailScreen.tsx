import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { DarkCard } from '../../components/DarkCard';
import { SecondaryHeader } from '../../components/SecondaryHeader';
import { formatCurrency, getPercentage } from '../../utils/formatters';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { transactions, deleteTransaction, enrichedBudgets } = useAppContext();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Find the transaction
  const transaction = transactions.find(t => String(t.id) === String(params.id)) as Transaction;

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
  const relatedBudget = enrichedBudgets.find((b: any) => b.category === transaction.category);
  const budgetProgress = relatedBudget ? relatedBudget.percent : 0;
  const remainingBudget = relatedBudget ? relatedBudget.remaining : 0;

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
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_GREEN} />
      
      {/* Header Section (Green Zone) */}
      <View style={styles.headerZone}>
        <SecondaryHeader 
          title="Transaction Details" 
          variant="dark"
          rightElement={
            <TouchableOpacity 
              style={styles.editButtonTop}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonTextTop}>Edit</Text>
            </TouchableOpacity>
          }
        />

        {/* Hero Amount Card using Reusable DarkCard */}
        <View style={styles.heroCardWrapper}>
          <DarkCard 
            type="transaction"
            amount={transaction.amount}
            isIncome={isIncome}
            categoryName={transaction.category}
            categoryIcon={transaction.categoryIcon}
            centered={true}
            style={styles.heroSummaryCard}
          />
        </View>
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
              icon="apps-outline" 
              label="Category" 
              value={transaction.category} 
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
                value={`${transaction.category} (${formatCurrency(relatedBudget?.spentAmount || 0)} /${formatCurrency(relatedBudget?.limitAmount || 0)} used)`} 
              />
            )}
            <DetailRow 
              icon="clipboard-outline" 
              label="Notes" 
              value={transaction.note || "No notes added"} 
              isLast
            />
          </View>

          {/* Budget Impact Widget (Expenses Only) */}
          {!isIncome && relatedBudget && (
            <View style={styles.impactWidget}>
              <View style={styles.impactHeader}>
                <Text style={styles.impactLabel}>Budget Impact: <Text style={styles.impactCategory}>{transaction.category}</Text></Text>
                <Text style={styles.impactPercent}>{relatedBudget.percent}%</Text>
              </View>
              
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, budgetProgress)}%` }]} />
              </View>
              
              <Text style={styles.impactCaption}>
                You've now used {relatedBudget.percent}% of your {transaction.category} budget this month, {formatCurrency(remainingBudget)} left before you hit your limit
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
            <Ionicons name="trash-outline" size={20} color={RED} />
          </TouchableOpacity>
        </View>
      </View>

      <DeleteConfirmModal 
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </View>
  );
}

function DetailRow({ icon, label, value, isLast = false }: { icon: any, label: string, value: string, isLast?: boolean }) {
  return (
    <View style={[styles.detailRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.detailIconBox}>
        <Ionicons name={icon} size={20} color={PRIMARY_GREEN} />
      </View>
      <View style={styles.detailInfo}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  headerZone: {
    backgroundColor: PRIMARY_GREEN,
    paddingBottom: 40,
  },
  heroCardWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heroSummaryCard: {
    elevation: 0,
    shadowOpacity: 0,
  },
  editButtonTop: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  editButtonTextTop: {
    color: WHITE,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  contentZone: {
    flex: 1,
    marginTop: -24,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  detailsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
  },
  impactWidget: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F9F4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCF7E9',
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  impactCategory: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.bold,
  },
  impactPercent: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#DCF7E9',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 4,
  },
  impactCaption: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  addReceiptButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  addReceiptText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#6B7280',
  },
  footerActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 34,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  editFullButton: {
    flex: 1,
    height: 56,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editFullButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  deleteFullButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
