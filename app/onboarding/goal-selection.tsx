import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_SECONDARY,
  TEXT_PRIMARY,
  SPACING,
  FONT_SIZE,
  Fonts,
  Colors,
} from "../../src/constants";
import { Button } from "../../src/components/Button";
import { OnboardingHeader } from "../../src/components/OnboardingHeader";
import { useAppContext } from "../../src/context/AppContext";
import { onboardingService } from "../../src/services/onboardingService";

interface GoalOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const GOAL_API_VALUES: Record<string, string> = {
  "track": "track_spending",
  "control": "control_budget",
  "save": "save_goals",
};

const GOALS: GoalOption[] = [
  {
    id: "track",
    icon: "wallet-outline",
    title: "Track expenses",
    description: "Choose your main goal to get started",
  },
  {
    id: "control",
    icon: "bar-chart-outline",
    title: "Control spending",
    description: "Choose your main goal to get started",
  },
  {
    id: "save",
    icon: "folder-outline",
    title: "Save money",
    description: "Choose your main goal to get started",
  },
];

export default function GoalSelectionScreen() {
  const router = useRouter();
  const { updateUser } = useAppContext();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (selectedGoal) {
      setIsLoading(true);
      
      try {
        // CALL THE API (Fire and forget style for onboarding)
        const apiGoal = GOAL_API_VALUES[selectedGoal];
        await onboardingService.selectGoal({ goal: apiGoal });
      } catch (error) {
        // Log the error silently — do not show an error to the user for this step
        console.warn("API Goal Selection failed, continuing locally:", error);
      } finally {
        // ALWAYS navigate regardless of success
        updateUser({ selectedGoals: [selectedGoal] });
        setIsLoading(false);
        router.push("/onboarding/set-budget");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <OnboardingHeader
          currentStep={0}
          totalSteps={4}
          onSkip={() => router.push("/onboarding/set-budget")}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textSection}>
            <Text style={styles.title}>What do you want to achieve?</Text>
            <Text style={styles.subtitle}>Choose your main goal to get started</Text>
          </View>

          <View style={styles.goalsContainer}>
            {GOALS.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, isSelected && styles.selectedCard]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={goal.icon}
                      size={24}
                      color={PRIMARY_GREEN}
                    />
                  </View>
                  <View style={styles.goalTextContent}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark-sharp" size={14} color={WHITE} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLoading ? "" : "Continue"}
            onPress={handleContinue}
            disabled={!selectedGoal || isLoading}
            variant="primary"
          >
            {isLoading && <ActivityIndicator size="small" color={WHITE} />}
          </Button>
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
    paddingHorizontal: SPACING.LG,
  },
  textSection: {
    marginBottom: SPACING.XL,
    marginTop: SPACING.MD,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZE.MD,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
  },
  goalsContainer: {
    gap: SPACING.MD,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.LG,
    borderRadius: 24, // Updated to match mockup curvature
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: "transparent",
    // Subtle shadow
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: SPACING.XS,
  },
  selectedCard: {
    borderColor: PRIMARY_GREEN,
    backgroundColor: Colors.primary.P100, // Using the project's P100 constant
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#DCFCE7", // Light green
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.MD,
  },
  goalTextContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
  },
  goalDescription: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingVertical: SPACING.LG,
    backgroundColor: WHITE,
  },
  errorCard: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.MD,
    borderRadius: 12,
    marginTop: SPACING.MD,
  },
  errorText: {
    color: WHITE,
    fontSize: FONT_SIZE.MD,
    marginLeft: SPACING.SM,
    fontFamily: Fonts.medium,
    flex: 1,
  },
});

