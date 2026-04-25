import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { SPACING } from "../constants";

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

export const ProgressBar = ({
  progress,
  height = 8,
  backgroundColor = "#F3F4F6",
  fillColor,
}: ProgressBarProps) => {
  const getFillColor = () => {
    if (fillColor) return fillColor;
    if (progress < 0.7) return "#10B981"; // Green
    if (progress <= 0.9) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const fillStyle: ViewStyle = {
    flex: 1,
    width: `${Math.min(100, progress * 100)}%`,
    backgroundColor: getFillColor(),
    borderRadius: height / 2,
  };

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor, borderRadius: height / 2 },
      ]}
    >
      <View style={fillStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
});
