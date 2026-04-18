import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, SPACING, FONT_SIZE, BORDER_GRAY, Fonts } from '../constants';

const { height } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: 'fast-food', color: '#EF4444' },
  { id: 'transport', name: 'Transport', icon: 'bus', color: '#3B82F6' },
  { id: 'data', name: 'Data', icon: 'wifi', color: '#8B5CF6' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#F59E0B' },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: '#EC4899' },
  { id: 'health', name: 'Health', icon: 'heart', color: '#10B981' },
  { id: 'salary', name: 'Salary', icon: 'cash', color: '#059669' },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase', color: '#0891B2' },
  { id: 'transfer', name: 'Transfer', icon: 'swap-horizontal', color: '#6366F1' },
  { id: 'education', name: 'Education', icon: 'school', color: '#4F46E5' },
  { id: 'savings', name: 'Savings', icon: 'wallet', color: '#22C55E' },
  { id: 'bills', name: 'Bills', icon: 'receipt', color: '#F43F5E' },
  { id: 'others', name: 'Others', icon: 'grid', color: '#6B7280' },
];

interface CategoryBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
}

export const CategoryBottomSheet = ({ isVisible, onClose, onSelect }: CategoryBottomSheetProps) => {
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
              <View style={styles.handle} />
              <Text style={styles.title}>Select Category</Text>
              
              <FlatList
                data={CATEGORIES}
                numColumns={3}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.categoryCard} 
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon as any} size={28} color={item.color} />
                    </View>
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
              />
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SPACING.LG,
    maxHeight: height * 0.6,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: BORDER_GRAY,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: SPACING.LG,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
  },
  list: {
    paddingBottom: SPACING.XL,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.XS,
  },
  categoryName: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_PRIMARY,
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
});
