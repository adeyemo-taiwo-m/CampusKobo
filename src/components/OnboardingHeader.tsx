import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  SPACING,
  FONT_SIZE,
  SURFACE_GREEN,
  Fonts,
} from "../constants";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const OnboardingHeader = ({
  currentStep,
  totalSteps,
  onSkip,
  showSkip = true,
}: OnboardingHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
      </TouchableOpacity>
      
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          
          return (
            <View
              key={i}
              style={[
                styles.progressDash,
                isActive ? styles.activeDash : isCompleted ? styles.completedDash : styles.pendingDash,
              ]}
            />
          );
        })}
      </View>

      {showSkip ? (
        <TouchableOpacity 
          onPress={onSkip}
          style={styles.skipHeaderButton}
        >
          <Text style={styles.skipHeaderText}>Skip</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
