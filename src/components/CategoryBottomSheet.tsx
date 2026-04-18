import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, SPACING, FONT_SIZE, BORDER_GRAY } from '../constants';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: 'restaurant', color: '#EF4444' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#3B82F6' },
  { id: 'data', name: 'Data', icon: 'wifi', color: '#8B5CF6' },
  { id: 'entertainment', name: 'Gaming', icon: 'game-controller', color: '#F59E0B' },
  { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#EC4899' },
  { id: 'health', name: 'Health', icon: 'heart', color: '#10B981' },
  { id: 'salary', name: 'Salary', icon: 'cash', color: '#059669' },
  { id: 'education', name: 'Education', icon: 'school', color: '#6366F1' },
  { id: 'others', name: 'Others', icon: 'grid', color: '#6B7280' },
];

interface CategoryBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
}

export const CategoryBottomSheet = ({ isVisible, onClose, onSelect }: CategoryBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <>
      {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={styles.contentContainer}>
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
                    bottomSheetRef.current?.close();
                  }}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.list}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: SPACING.LG,
    textAlign: 'center',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.XS,
  },
  categoryName: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_PRIMARY,
    fontWeight: '500',
  },
});
