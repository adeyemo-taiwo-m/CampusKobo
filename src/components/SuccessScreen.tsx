import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
} from "../constants";
import { Button } from "./Button";

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  onDone: () => void;
}

export const SuccessScreen = ({
  title,
  subtitle,
  onDone,
}: SuccessScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color={WHITE} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <Button title="Done" onPress={onDone} variant="primary" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.XXL,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.XL,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    color: TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
  footer: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XL,
  },
});
