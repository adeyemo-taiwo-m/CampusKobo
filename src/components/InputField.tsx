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
  RED, 
  BORDER_GRAY 
} from '../constants';

type InputState = 'default' | 'active' | 'success' | 'error' | 'disabled';

interface InputFieldProps extends Omit<TextInputProps, 'onChange' | 'onChangeText'> {
  label: string;
  placeholder: string;
  state?: InputState;
  value: string;
  onChange: (text: string) => void;
  errorMessage?: string;
  successMessage?: string;
  prefix?: string;
  rightIcon?: React.ReactNode;
}

export const InputField = ({
  label,
  placeholder,
  state: externalState,
  value,
  onChange,
  errorMessage,
  successMessage,
  prefix,
  rightIcon,
  style,
  onFocus,
  onBlur,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const getEffectiveState = (): InputState => {
    if (externalState && externalState !== 'default') return externalState;
    if (isFocused) return 'active';
    return 'default';
  };

  const effectiveState = getEffectiveState();

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const base: any[] = [styles.inputContainer];
    
    if (effectiveState === 'active') base.push(styles.activeBorder);
    if (effectiveState === 'success') base.push(styles.successBorder);
    if (effectiveState === 'error') base.push(styles.errorBorder);
    if (effectiveState === 'disabled') base.push(styles.disabledBg);
    
    return base;
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={getContainerStyle()}>
        <View style={styles.inputInnerContainer}>
          {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
          <TextInput
            style={[styles.input, style as TextStyle]}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
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
      
      {effectiveState === 'error' && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
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
    height: 52, // Increased slightly for better look
    borderWidth: 1.5,
    borderColor: '#F3F4F6', // Lighter border by default
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
    borderColor: RED,
  },
  disabledBg: {
    backgroundColor: '#F3F4F6',
    borderColor: BORDER_GRAY,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: RED,
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

