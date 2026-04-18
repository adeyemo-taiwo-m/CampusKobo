import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { PRIMARY_GREEN, WHITE, LIGHT_GRAY, RED, TEXT_PRIMARY, SPACING, FONT_SIZE } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  size = 'md',
  style,
  textStyle,
}: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return '#E0E0E0';
    switch (variant) {
      case 'primary': return PRIMARY_GREEN;
      case 'secondary': return LIGHT_GRAY;
      case 'danger': return RED;
      case 'outline': return WHITE;
      default: return PRIMARY_GREEN;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#9CA3AF';
    switch (variant) {
      case 'primary': return WHITE;
      case 'secondary': return TEXT_PRIMARY;
      case 'danger': return WHITE;
      case 'outline': return PRIMARY_GREEN;
      default: return WHITE;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: SPACING.XS, paddingHorizontal: SPACING.SM };
      case 'md': return { paddingVertical: SPACING.MD, paddingHorizontal: SPACING.LG };
      case 'lg': return { paddingVertical: SPACING.LG, paddingHorizontal: SPACING.XL };
      default: return { paddingVertical: SPACING.MD, paddingHorizontal: SPACING.LG };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), width: fullWidth ? '100%' : 'auto' },
        getPadding(),
        variant === 'outline' && { borderWidth: 1, borderColor: PRIMARY_GREEN },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.SM,
  },
  text: {
    fontSize: FONT_SIZE.LG,
    fontWeight: '600',
  },
});
