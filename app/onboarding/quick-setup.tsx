import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE, BORDER_GRAY, SURFACE_GREEN, RED, LIGHT_GREEN, YELLOW, Fonts } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { useAppContext } from '../../src/context/AppContext';

interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'food', name: 'Food', icon: 'restaurant', color: '#EF4444' }, // red
  { id: 'transport', name: 'Transport', icon: 'car', color: '#3B82F6' }, // blue
  { id: 'data', name: 'Data', icon: 'wifi', color: '#8B5CF6' }, // purple
  { id: 'entertainment', name: 'Gaming', icon: 'game-controller', color: '#F59E0B' }, // orange
  { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#EC4899' }, // pink
  { id: 'health', name: 'Health', icon: 'heart', color: '#10B981' }, // green
];

export default function QuickCategorySetupScreen() {
  const router = useRouter();
  const { updateUser } = useAppContext();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(catId => catId !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleFinish = () => {
    updateUser({ selectedCategories });
    router.push('/onboarding/first-expense');
  };

  const renderItem = ({ item }: { item: CategoryOption }) => {
    const isSelected = selectedCategories.includes(item.id);
    return (
      <TouchableOpacity 
        style={[styles.categoryCard, isSelected && styles.selectedCard]}
        onPress={() => toggleCategory(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? item.color : '#F3F4F6' }]}>
          <Ionicons name={item.icon as any} size={24} color={isSelected ? WHITE : TEXT_SECONDARY} />
        </View>
        <Text style={[styles.categoryName, isSelected && styles.selectedName]}>{item.name}</Text>
        
        {isSelected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={12} color={WHITE} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={[styles.dot, i === 3 ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>
        </View>

        <Text style={styles.title}>Your Spending Categories</Text>
        <Text style={styles.subtitle}>These are pre-selected for you — deselect any you don't need</Text>

        <FlatList
          data={CATEGORIES}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.footer}>
          <Button 
            title="Finish Setup" 
            onPress={handleFinish} 
            disabled={selectedCategories.length === 0}
          />
          <TouchableOpacity onPress={() => router.push('/onboarding/first-expense')} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    padding: SPACING.LG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  backButton: {
    marginRight: SPACING.LG,
  },
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginRight: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: PRIMARY_GREEN,
    width: SPACING.LG,
  },
  inactiveDot: {
    backgroundColor: BORDER_GRAY,
  },
  title: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    fontFamily: Fonts.semiBold,
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    marginBottom: SPACING.XL,
    fontFamily: Fonts.regular,
  },
  listContent: {
    paddingBottom: SPACING.LG,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.MD,
  },
  selectedCard: {
    backgroundColor: SURFACE_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.SM,
  },
  categoryName: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semiBold,
  },
  selectedName: {
    color: PRIMARY_GREEN,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: PRIMARY_GREEN,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: SPACING.LG,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  skipText: {
    color: TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
});
