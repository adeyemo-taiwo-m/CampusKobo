import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, SPACING, FONT_SIZE, BORDER_GRAY, Fonts } from '../constants';

const { height } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
}

const EXPENSE_CATEGORIES: Category[] = [
  { id: 'lunch', name: 'Lunch', icon: 'fast-food-outline' },
  { id: 'data', name: 'Data', icon: 'wifi-outline' },
  { id: 'health', name: 'Health', icon: 'heart-outline' },
  { id: 'fuel', name: 'Fuel', icon: 'car-outline' },
  { id: 'shopping', name: 'Shopping', icon: 'cart-outline' },
  { id: 'groceries', name: 'Groceries', icon: 'basket-outline' },
  { id: 'bills', name: 'Bills', icon: 'receipt-outline' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller-outline' },
  { id: 'transport', name: 'Transport', icon: 'car-sport-outline' },
  { id: 'others', name: 'Others', icon: 'chatbox-ellipses-outline' },
];

const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'briefcase-outline' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop-outline' },
  { id: 'refund', name: 'Refund', icon: 'arrow-undo-outline' },
  { id: 'business', name: 'Business Income', icon: 'trending-up-outline' },
  { id: 'investment', name: 'Investment', icon: 'stats-chart-outline' },
  { id: 'interest', name: 'Interest', icon: 'flash-outline' },
  { id: 'health_inc', name: 'Health', icon: 'heart-outline' },
  { id: 'gift', name: 'Gift', icon: 'gift-outline' },
  { id: 'others_inc', name: 'Others', icon: 'chatbox-ellipses-outline' },
];

interface CategoryBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (category: { name: string, icon: string, color: string }) => void;
  type: 'expense' | 'income';
}

export const CategoryBottomSheet = ({ isVisible, onClose, onSelect, type }: CategoryBottomSheetProps) => {
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.header}>
                <View style={{ width: 24 }} />
                <Text style={styles.title}>Choose Category</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="arrow-forward" size={24} color={TEXT_PRIMARY} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.categoryGrid}>
                {categories.map((item) => (
                  <TouchableOpacity 
                    key={item.id}
                    style={[
                      styles.categoryCard,
                      item.name === 'Others' && styles.fullWidthCard
                    ]} 
                    onPress={() => {
                      onSelect({ name: item.name, icon: item.icon, color: PRIMARY_GREEN });
                      onClose();
                    }}
                  >
                    <View style={styles.iconWrapper}>
                      <Ionicons name={item.icon as any} size={20} color={PRIMARY_GREEN} />
                    </View>
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semiBold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '30%',
    flexGrow: 1,
  },
  fullWidthCard: {
    width: '100%',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
    color: '#4B5563',
    fontFamily: Fonts.medium,
  },
});
