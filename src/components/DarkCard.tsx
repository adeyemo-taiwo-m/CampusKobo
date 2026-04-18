import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { DARK_CARD, SPACING, WHITE } from "../constants";

interface DarkCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DarkCard = ({ children, style }: DarkCardProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_CARD,
    borderRadius: 24,
    padding: SPACING.LG,
    width: "100%",
  },
});
