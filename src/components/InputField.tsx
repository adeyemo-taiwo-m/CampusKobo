import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  TextStyle, 
  StyleProp,
  ViewStyle,
  Platform
} from 'react-native';
import { 
  Colors, 
  SPACING, 
  Fonts, 
  PRIMARY_GREEN, 
  BORDER_GRAY 
} from '../constants';

type InputState = 'default' | 'active' | 'success' | 'error' | 'disabled';

interface InputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
  label?: string;
  placeholder: string;
  state?: InputState;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  successMessage?: string;
  prefix?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefixStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  outerContainerStyle?: StyleProp<ViewStyle>;
}

export const InputField = ({
  label,
  placeholder,
  state: externalState,
  value,
  onChangeText,
  error,
  successMessage,
  prefix,
  leftIcon,
  rightIcon,
  prefixStyle,
  labelStyle,
  containerStyle,
  outerContainerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const getEffectiveState = (): InputState => {
    if (error) return 'error';
    if (externalState && externalState !== 'default') return externalState;
    if (isFocused) return 'active';
    return 'default';
  };

  const effectiveState = getEffectiveState();

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const base: any[] = [styles.inputContainer, containerStyle];
    
    if (effectiveState === 'active') base.push(styles.activeBorder);
    if (effectiveState === 'success') base.push(styles.successBorder);
    if (effectiveState === 'error') base.push(styles.errorBorder);
    if (effectiveState === 'disabled') base.push(styles.disabledBg);
    
    return base;
  };

  return (
    <View style={[styles.outerContainer, outerContainerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      
      <View style={getContainerStyle()}>
        <View style={styles.inputInnerContainer}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          {prefix ? <Text style={[styles.prefix, prefixStyle]}>{prefix}</Text> : null}
          <TextInput
            style={[styles.input, style as TextStyle]}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            editable={effectiveState !== 'disabled'}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            {...props}
          />
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      </View>
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      
      {effectiveState === 'success' && successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginBottom: SPACING.MD,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  prefix: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 8,
  },
  input: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.neutral.N900,
    flex: 1,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  leftIconWrapper: {
    marginRight: 8,
  },
  rightIconWrapper: {
    marginLeft: 8,
  },
  activeBorder: {
    borderColor: PRIMARY_GREEN,
  },
  successBorder: {
    borderColor: PRIMARY_GREEN,
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  disabledBg: {
    backgroundColor: '#F3F4F6',
    borderColor: BORDER_GRAY,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
  },
  successText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: PRIMARY_GREEN,
    marginTop: 4,
    marginLeft: 2,
  },
});


