import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_SECONDARY,
  TEXT_PRIMARY,
  SPACING,
  FONT_SIZE,
  Fonts,
} from "../../src/constants";
import { Button } from "../../src/components/Button";
import { InputField } from "../../src/components/InputField";
import { SelectField } from "../../src/components/SelectField";
import { OnboardingHeader } from "../../src/components/OnboardingHeader";
import { CategoryBottomSheet } from "../../src/components/CategoryBottomSheet";
import { SuccessModal } from "../../src/components/SuccessScreen";
import { useAppContext } from "../../src/context/AppContext";

export default function FirstExpenseScreen() {
  const router = useRouter();
  const { addTransaction } = useAppContext();

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [note, setNote] = useState("");
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!amount || !selectedCategory) return;

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount.replace(/[^0-9]/g, "")),
      type: "expense" as const,
      category: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      description: note || `Expense for ${selectedCategory.name}`,
      date: new Date().toISOString(),
      isRecurring: false,
    };

    addTransaction(transaction);
    setShowSuccess(true);
  };

  const handleAmountChange = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, "");
    if (!cleanNumber) {
      setAmount("");
      return;
    }
    const formatted = parseInt(cleanNumber, 10).toLocaleString();
    setAmount(formatted);
  };

  const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <OnboardingHeader
          currentStep={3}
          totalSteps={4}
          onSkip={() => router.replace("/(tabs)")}
        />

        <SuccessModal 
          isVisible={showSuccess}
          title="You're All Set! 🎉"
          subtitle="Welcome to CampusKobo. Your financial journey starts today."
          onDone={() => {
            setShowSuccess(false);
            router.replace("/(tabs)");
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textSection}>
            <Text style={styles.title}>Your First Expense</Text>
            <Text style={styles.subtitle}>Track your first expense</Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Amount"
              placeholder="0"
              prefix="₦"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
            />

            <SelectField
              label="Category"
              placeholder="Choose a category"
              value={selectedCategory?.name}
              onPress={() => setIsSheetVisible(true)}
            />

            <InputField
              label="Note (optional)"
              placeholder="Enter a note"
              value={note}
              onChangeText={setNote}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Save"
            onPress={handleSave}
            disabled={numericAmount === 0 || !selectedCategory}
            variant="primary"
          />
        </View>
      </View>

      <CategoryBottomSheet
        isVisible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setIsSheetVisible(false);
        }}
      />
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
  form: {
    gap: SPACING.SM,
  },
  footer: {
    paddingVertical: SPACING.LG,
    backgroundColor: WHITE,
  },
});

