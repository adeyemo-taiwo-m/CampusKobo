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
  SURFACE_GREEN,
  Fonts,
  Colors,
} from "../../src/constants";
import { Button } from "../../src/components/Button";
import { InputField } from "../../src/components/InputField";
import { useAppContext } from "../../src/context/AppContext";

const BUDGET_SUGGESTIONS = [
  { label: "₦20,000", value: 20000 },
  { label: "₦30,000", value: 30000 },
  { label: "₦40,000", value: 40000 },
  { label: "₦80,000", value: 80000 },
];

export default function SetMonthlyBudgetScreen() {
  const router = useRouter();
  const { updateUser } = useAppContext();
  const [budget, setBudget] = useState("");

  const handleContinue = () => {
    const amount = parseFloat(budget.replace(/[^0-9]/g, "")) || 0;
    updateUser({ monthlyBudget: amount });
    router.push("/onboarding/quick-setup");
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
          {/* Custom Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressDash, styles.completedDash]} />
              <View style={[styles.progressDash, styles.activeDash]} />
              <View style={[styles.progressDash, styles.pendingDash]} />
              <View style={[styles.progressDash, styles.pendingDash]} />
            </View>

            <TouchableOpacity 
              onPress={() => router.push("/onboarding/quick-setup")}
              style={styles.skipHeaderButton}
            >
              <Text style={styles.skipHeaderText}>Skip</Text>
            </TouchableOpacity>
          </View>

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
                onChange={handleInputChange}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <View style={styles.suggestionsWrapper}>
              {BUDGET_SUGGESTIONS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.suggestionChip}
                  onPress={() => selectSuggestion(item.value)}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  backButton: {
    padding: SPACING.XS,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDash: {
    height: 4,
    width: 24,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  completedDash: {
    backgroundColor: "#A7F3D0", // Light green
  },
  activeDash: {
    backgroundColor: PRIMARY_GREEN,
  },
  pendingDash: {
    backgroundColor: "#F3F4F6", // Light grey
  },
  skipHeaderButton: {
    backgroundColor: SURFACE_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skipHeaderText: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.medium,
    fontSize: FONT_SIZE.MD,
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
    fontFamily: Fonts.bold,
  },
  footer: {
    paddingVertical: SPACING.LG,
    backgroundColor: WHITE,
  },
});

