import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fonts, TEXT_PRIMARY, WHITE } from "../constants";

interface SecondaryHeaderProps {
  title: string;
  onBack?: () => void;
  backgroundColor?: string;
  variant?: "light" | "dark"; // light = dark text, dark = white text
  rightElement?: React.ReactNode;
}

export const SecondaryHeader = ({
  title,
  onBack,
  backgroundColor = "transparent",
  variant = "light",
  rightElement,
}: SecondaryHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = variant === "dark";
  const iconColor = isDark ? WHITE : TEXT_PRIMARY;
  const textColor = isDark ? WHITE : "#000000";

  return (
    <View style={[styles.header, { backgroundColor, paddingTop: insets.top }]}>
      <TouchableOpacity
        style={[styles.backButton, isDark && styles.backButtonDark]}
        onPress={onBack || (() => router.back())}
      >
        <Ionicons name="chevron-back" size={20} color={iconColor} />
      </TouchableOpacity>

      <Text
        style={[styles.headerTitle, { color: textColor }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.rightSection}>
        {rightElement || <View style={styles.spacer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonDark: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
    flex: 1,
  },
  rightSection: {
    minWidth: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  spacer: {
    width: 40,
  },
});
