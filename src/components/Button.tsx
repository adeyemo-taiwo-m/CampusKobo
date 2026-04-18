import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, PRIMARY_GREEN, WHITE, TEXT_PRIMARY, SPACING, Fonts } from '../constants';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}: ButtonProps) => {
  const getButtonStyles = (): ViewStyle[] => {
    const baseStyles: any[] = [styles.button, styles[size]];
    
    if (!fullWidth) {
      baseStyles.push({ width: 'auto', alignSelf: 'flex-start' });
    }

    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primary);
        break;
      case 'secondary':
        baseStyles.push(styles.secondary);
        break;
      case 'danger':
        baseStyles.push(styles.danger);
        break;
      case 'outline':
        baseStyles.push(styles.outline);
        break;
    }
    
    if (disabled) baseStyles.push(styles.disabled);
    if (style) baseStyles.push(style);
    
    return baseStyles;
  };

  const getTextStyles = (): TextStyle[] => {
    const baseTextStyles: any[] = [styles.text, styles[`${size}Text` as keyof typeof styles] as TextStyle];
    
    switch (variant) {
      case 'primary':
        baseTextStyles.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyles.push(styles.secondaryText);
        break;
      case 'danger':
        baseTextStyles.push(styles.dangerText);
        break;
      case 'outline':
        baseTextStyles.push(styles.outlineText);
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
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? WHITE : PRIMARY_GREEN} />
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
    paddingHorizontal: SPACING.LG,
  },
  // Sizes
  lg: {
    height: 56,
  },
  md: {
    height: 48,
  },
  sm: {
    height: 36,
    paddingHorizontal: SPACING.MD,
    borderRadius: 8,
  },
  // Variants
  primary: {
    backgroundColor: PRIMARY_GREEN,
  },
  secondary: {
    backgroundColor: '#F3F4F6', // Light gray
  },
  danger: {
    backgroundColor: '#EF4444', // Red
  },
  outline: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: PRIMARY_GREEN,
  },
  disabled: {
    backgroundColor: '#E5E7EB',
  },
  // Text Styles
  text: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  lgText: {
    fontSize: 16,
  },
  mdText: {
    fontSize: 15,
  },
  smText: {
    fontSize: 13,
  },
  primaryText: {
    color: WHITE,
  },
  secondaryText: {
    color: TEXT_PRIMARY,
  },
  dangerText: {
    color: WHITE,
  },
  outlineText: {
    color: PRIMARY_GREEN,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

