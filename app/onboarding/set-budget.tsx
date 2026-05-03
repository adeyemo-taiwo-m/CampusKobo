import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
  BORDER_GRAY,
  Fonts,
} from "../../src/constants";
import { Button } from "../../src/components/Button";
import { InputField } from "../../src/components/InputField";
import { OnboardingHeader } from "../../src/components/OnboardingHeader";
import { useAppContext } from "../../src/context/AppContext";
import { onboardingService } from "../../src/services/onboardingService";

const BUDGET_SUGGESTIONS = [
  { label: "₦20,000", value: 20000 },
  { label: "₦30,000", value: 30000 },
  { label: "₦40,000", value: 40000 },
  { label: "₦80,000", value: 80000 },
];

export default function SetMonthlyBudgetScreen() {
  const router = useRouter();
  const { addBudget } = useAppContext();
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    const amount = parseFloat(budget.replace(/[^0-9]/g, "")) || 0;
    
    setIsLoading(true);
    try {
      // Sync with API
      await onboardingService.setupBudget({
        monthly_income: amount,
        currency: 'NGN'
      });
    } catch (error) {
      console.warn("API Budget Setup failed, continuing locally:", error);
    } finally {
      // Always sync locally and move forward
      await addBudget({
        id: Math.random().toString(36).substring(7),
        category: 'General',
        limitAmount: amount,
        spentAmount: 0,
        icon: 'wallet-outline',
        color: '#1A9E3F',
        period: 'monthly'
      } as any);
      setIsLoading(false);
      router.push("/onboarding/quick-setup");
    }
  };

  const selectSuggestion = (value: number) => {
    setBudget(value.toLocaleString());
  };

  const handleInputChange = (text: string) => {
    // Remove non-numeric characters for processing but format for display
    const cleanNumber = text.replace(/[^0-9]/g, "");
    if (!cleanNumber) {
      setBudget("");
      return;
    }
    const formatted = parseInt(cleanNumber, 10).toLocaleString();
    setBudget(formatted);
  };

  const numericValue = parseInt(budget.replace(/[^0-9]/g, ""), 10) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <OnboardingHeader
            currentStep={1}
            totalSteps={4}
            onSkip={() => router.push("/onboarding/quick-setup")}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.textSection}>
              <Text style={styles.title}>Set Monthly Budget</Text>
              <Text style={styles.subtitle}>
                Set a limit so you don't overspend
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <InputField
                label="Your monthly budget"
                placeholder="0"
                prefix="₦"
                value={budget}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                autoFocus
                editable={!isLoading}
              />
            </View>

            <View style={styles.suggestionsWrapper}>
              {BUDGET_SUGGESTIONS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.suggestionChip}
                  onPress={() => selectSuggestion(item.value)}
                  disabled={isLoading}
                >
                  <Text style={styles.suggestionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.recommendationText}>
              Most students set <Text style={styles.boldGreen}>₦30,000 – ₦80,000</Text>
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              variant="primary"
              disabled={!budget}
              loading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingTop: SPACING.MD,
  },
  textSection: {
    marginBottom: SPACING.XL,
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
  inputContainer: {
    marginBottom: SPACING.MD,
  },
  suggestionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.LG,
  },
  suggestionChip: {
    width: "23%",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: SPACING.SM,
    // Subtle shadow
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: "#6B7280",
  },
  recommendationText: {
    fontSize: FONT_SIZE.MD,
    fontFamily: Fonts.medium,
    color: PRIMARY_GREEN,
  },
  boldGreen: {
    fontFamily: Fonts.semiBold,
  },
  footer: {
    paddingVertical: SPACING.LG,
    backgroundColor: WHITE,
  },
});

