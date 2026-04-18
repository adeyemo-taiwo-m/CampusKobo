import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, PRIMARY_GREEN, TEXT_SECONDARY, TEXT_PRIMARY, SPACING, FONT_SIZE, BORDER_GRAY, SURFACE_GREEN } from '../../src/constants';
import { Button } from '../../src/components/Button';
import { useAppContext } from '../../src/context/AppContext';

interface GoalOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const GOALS: GoalOption[] = [
  { id: 'track', icon: 'bar-chart', title: 'Track my spending', description: 'See exactly where your money goes' },
  { id: 'budget', icon: 'wallet', title: 'Control my budget', description: 'Stop overspending with spending limits' },
  { id: 'save', icon: 'piggy-bank', title: 'Save towards goals', description: 'Build savings for things that matter' },
];

export default function GoalSelectionScreen() {
  const router = useRouter();
  const { user, updateUser } = useAppContext();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(goalId => goalId !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const handleContinue = () => {
    updateUser({ selectedGoals });
    router.push('/onboarding/set-budget');
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
              <View key={i} style={[styles.dot, i === 1 ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>What do you want to achieve?</Text>
          <Text style={styles.subtitle}>Select all that apply — we will personalize your experience</Text>

          <View style={styles.goalsContainer}>
            {GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <TouchableOpacity 
                  key={goal.id} 
                  style={[styles.goalCard, isSelected && styles.selectedCard]}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
                    <Ionicons name={goal.icon as any} size={24} color={isSelected ? WHITE : TEXT_SECONDARY} />
                  </View>
                  <View style={styles.goalTextContent}>
                    <Text style={[styles.goalTitle, isSelected && styles.selectedGoalTitle]}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={PRIMARY_GREEN} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Continue" 
            onPress={handleContinue} 
            disabled={selectedGoals.length === 0}
          />
          <TouchableOpacity onPress={() => router.push('/onboarding/set-budget')} style={styles.skipButton}>
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
    marginRight: 40, // Offset for back button to center dots
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
  },
  subtitle: {
    fontSize: FONT_SIZE.LG,
    color: TEXT_SECONDARY,
    marginBottom: SPACING.XL,
  },
  goalsContainer: {
    gap: SPACING.MD,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.LG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    backgroundColor: WHITE,
  },
  selectedCard: {
    borderColor: PRIMARY_GREEN,
    backgroundColor: SURFACE_GREEN,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MD,
  },
  selectedIconContainer: {
    backgroundColor: PRIMARY_GREEN,
  },
  goalTextContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  selectedGoalTitle: {
    color: TEXT_PRIMARY,
  },
  goalDescription: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  footer: {
    marginTop: SPACING.XL,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  skipText: {
    color: TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
  },
});
