import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, PRIMARY_GREEN, WHITE, TEXT_PRIMARY, SPACING, Fonts } from '../constants';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'cancel' | 'outline' | 'ghost';
type ButtonSize = 'large' | 'small';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  const getButtonStyles = (): ViewStyle[] => {
    const baseStyles = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primary);
        break;
      case 'secondary':
        baseStyles.push(styles.secondary);
        break;
      case 'tertiary':
        baseStyles.push(styles.tertiary);
        break;
      case 'cancel':
        baseStyles.push(styles.cancel);
        break;
      case 'outline':
        baseStyles.push(styles.outline);
        break;
      case 'ghost':
        baseStyles.push(styles.ghost);
        break;
    }
    
    if (disabled) baseStyles.push(styles.disabled);
    if (style) baseStyles.push(style);
    
    return baseStyles;
  };

  const getTextStyles = (): TextStyle[] => {
    const baseTextStyles = [styles.text, styles[`${size}Text` as keyof typeof styles] as TextStyle];
    
    switch (variant) {
      case 'primary':
        baseTextStyles.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyles.push(styles.secondaryText);
        break;
      case 'tertiary':
        baseTextStyles.push(styles.tertiaryText);
        break;
      case 'cancel':
        baseTextStyles.push(styles.cancelText);
        break;
      case 'outline':
        baseTextStyles.push(styles.outlineText);
        break;
      case 'ghost':
        baseTextStyles.push(styles.ghostText);
        break;
    }
    
    if (disabled) baseTextStyles.push(styles.disabledText);
    if (textStyle) baseTextStyles.push(textStyle);
    
    return baseTextStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? WHITE : PRIMARY_GREEN} />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // Sizes
  large: {
    height: 56,
    paddingHorizontal: SPACING.LG,
  },
  small: {
    height: 40,
    paddingHorizontal: SPACING.MD,
    borderRadius: 8,
  },
  // Types
  primary: {
    backgroundColor: PRIMARY_GREEN, // Now Solid Green
  },
  secondary: {
    backgroundColor: Colors.neutral.N900, // Now Solid Dark
  },
  tertiary: {
    backgroundColor: Colors.primary.P50, // Soft Green
  },
  cancel: {
    backgroundColor: Colors.error.R100, // Soft Red
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: PRIMARY_GREEN,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: Colors.neutral.N200,
  },
  // Text Styles
  text: {
    fontFamily: Fonts.medium,
    fontWeight: '600',
  },
  largeText: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  primaryText: {
    color: WHITE,
  },
  secondaryText: {
    color: WHITE,
  },
  tertiaryText: {
    color: PRIMARY_GREEN,
  },
  cancelText: {
    color: Colors.error.R500,
  },
  outlineText: {
    color: PRIMARY_GREEN,
  },
  ghostText: {
    color: PRIMARY_GREEN,
  },
  disabledText: {
    color: Colors.neutral.N400,
  },
});
