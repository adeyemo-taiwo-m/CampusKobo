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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.XXL,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.LG,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FONT_SIZE.MD,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: SPACING.XL,
  },
  buttonContainer: {
    minWidth: 160,
  },
});
