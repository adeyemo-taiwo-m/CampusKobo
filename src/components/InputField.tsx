import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { PRIMARY_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, RED, BORDER_GRAY, SPACING, FONT_SIZE } from '../constants';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  error?: string;
  onBlur?: () => void;
}

export const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  rightIcon,
  error,
  onBlur,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedInput,
        error ? styles.errorInput : null
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: SPACING.MD,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: FONT_SIZE.LG,
    color: TEXT_PRIMARY,
  },
  focusedInput: {
    borderColor: PRIMARY_GREEN,
    backgroundColor: '#FFFFFF',
  },
  errorInput: {
    borderColor: RED,
  },
  errorText: {
    color: RED,
    fontSize: FONT_SIZE.SM,
    marginTop: SPACING.XS,
  },
  iconContainer: {
    marginLeft: SPACING.SM,
  },
});
