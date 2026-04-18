import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  TextStyle, 
  ViewStyle 
} from 'react-native';
import { 
  Colors, 
  TEXT_SECONDARY, 
  SPACING, 
  Fonts, 
  PRIMARY_GREEN, 
  RED, 
  BORDER_GRAY 
} from '../constants';

type InputState = 'default' | 'active' | 'success' | 'error' | 'disabled';

interface InputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  placeholder: string;
  state?: InputState;
  value: string;
  onChange: (text: string) => void;
  errorMessage?: string;
  successMessage?: string;
}

export const InputField = ({
  label,
  placeholder,
  state = 'default',
  value,
  onChange,
  errorMessage,
  successMessage,
  style,
  ...props
}: InputFieldProps) => {
  
  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.inputContainer];
    
    switch (state) {
      case 'active':
        base.push(styles.activeBorder);
        break;
      case 'success':
        base.push(styles.successBorder);
        break;
      case 'error':
        base.push(styles.errorBorder);
        break;
      case 'disabled':
        base.push(styles.disabledBg);
        break;
    }
    
    return base;
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={getContainerStyle()}>
        <TextInput
          style={[styles.input, style as TextStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral.N400}
          value={value}
          onChangeText={onChange}
          editable={state !== 'disabled'}
          {...props}
        />
      </View>
      
      {state === 'error' && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      
      {state === 'success' && successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
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
    color: '#6B7280', // Muted gray
    marginBottom: 6,
  },
  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.neutral.N900,
    width: '100%',
    height: '100%',
  },
  activeBorder: {
    borderColor: Colors.neutral.N900,
  },
  successBorder: {
    borderColor: PRIMARY_GREEN,
  },
  errorBorder: {
    borderColor: RED,
  },
  disabledBg: {
    backgroundColor: '#F3F4F6', // Light gray background
    borderColor: BORDER_GRAY,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: RED,
    marginTop: 4,
  },
  successText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: PRIMARY_GREEN,
    marginTop: 4,
  },
});
