import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
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

interface CategoryOption {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryOption[] = [
  { id: "food", name: "Food", icon: "fast-food-outline" },
  { id: "transport", name: "Transport", icon: "bus-outline" },
  { id: "data", name: "Data", icon: "wifi-outline" },
  { id: "entertainment", name: "Entertainment", icon: "game-controller-outline" },
];

export default function QuickCategorySetupScreen() {
  const router = useRouter();
  const { updateUser } = useAppContext();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map((cat) => cat.id)
  );

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((catId) => catId !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleFinish = () => {
    updateUser({ selectedCategories });
    router.push("/onboarding/first-expense");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <OnboardingHeader
          currentStep={2}
          totalSteps={4}
          onSkip={() => router.push("/onboarding/first-expense")}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textSection}>
            <Text style={styles.title}>Quick Category Setup</Text>
            <Text style={styles.subtitle}>
              These help you track where your money goes
            </Text>
          </View>

          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, isSelected && styles.selectedCard]}
                  onPress={() => toggleCategory(category.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={category.icon}
                      size={24}
                      color={PRIMARY_GREEN}
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
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
            title="Continue"
            onPress={handleFinish}
            disabled={selectedCategories.length === 0}
            variant="primary"
          />
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
  categoriesContainer: {
    gap: SPACING.MD,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.LG,
    borderRadius: 24,
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
    backgroundColor: Colors.primary.P100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.MD,
  },
  categoryName: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
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
});

