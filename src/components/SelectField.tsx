import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, SPACING, Fonts, PRIMARY_GREEN } from "../constants";

type SelectState = "default" | "active" | "error" | "disabled";

interface SelectFieldProps {
  label: string;
  placeholder: string;
  value?: string;
  onPress: () => void;
  state?: SelectState;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SelectField = ({
  label,
  placeholder,
  value,
  onPress,
  state = "default",
  errorMessage,
  containerStyle,
}: SelectFieldProps) => {
  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const base: any[] = [styles.inputContainer, containerStyle];

    if (state === "active") base.push(styles.activeBorder);
    if (state === "error") base.push(styles.errorBorder);
    if (state === "disabled") base.push(styles.disabledBg);

    return base;
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={getContainerStyle()}
        onPress={onPress}
        disabled={state === "disabled"}
        activeOpacity={0.7}
      >
        <View style={styles.inputInnerContainer}>
          <Text
            style={[
              styles.valueText,
              !value && styles.placeholderText,
            ]}
          >
            {value || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>

      {state === "error" && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    marginBottom: SPACING.MD,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  activeBorder: {
    borderColor: PRIMARY_GREEN,
  },
  errorBorder: {
    borderColor: "#EF4444",
  },
  disabledBg: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  inputInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.neutral.N900,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 2,
  },
});
