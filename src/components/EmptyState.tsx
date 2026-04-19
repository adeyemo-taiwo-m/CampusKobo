import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SPACING,
  Fonts,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  FONT_SIZE,
} from "../constants";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  subtitle,
  buttonTitle,
  onButtonPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {buttonTitle && onButtonPress && (
        <View style={styles.buttonContainer}>
          <Button
            title={buttonTitle}
            onPress={onButtonPress}
            variant="outline"
            size="md"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XL,
    paddingHorizontal: SPACING.LG,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.MD,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: SPACING.LG,
  },
  buttonContainer: {
    minWidth: 160,
  },
});
