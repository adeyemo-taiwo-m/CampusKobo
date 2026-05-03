import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { getProgressColor } from "../utils/formatters";

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
  const calculatedFillColor = fillColor || getProgressColor(Math.round(progress * 100));

  const fillStyle: ViewStyle = {
    flex: 1,
    width: `${Math.min(100, progress * 100)}%`,
    backgroundColor: calculatedFillColor,
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
