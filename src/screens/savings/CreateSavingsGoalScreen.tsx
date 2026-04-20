import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { SuccessModal } from '../../components/SuccessScreen';

export const CreateSavingsGoalScreen = () => {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('Select a date');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = name.length > 0 && targetAmount.length > 0;

  const handleCreate = () => {
    // Logic to save goal
    setShowSuccess(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Create Savings Goal" 
        showBack={true} 
        onBack={() => router.back()}
      />

      <SuccessModal 
        isVisible={showSuccess}
        title="Goal Created!"
        subtitle="Your savings goal is set. Start adding funds and watch your progress grow."
        onDone={() => {
          setShowSuccess(false);
          router.push('/(tabs)/savings');
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <InputField
              label="Goal Name"
              placeholder="e.g. New Laptop"
              value={name}
              onChangeText={setName}
            />

            <InputField
              label="Target Amount"
              placeholder="₦0"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Date (Optional)</Text>
              <TouchableOpacity style={styles.datePickerBtn}>
                <Text style={styles.dateText}>{targetDate}</Text>
                <Ionicons name="calendar-outline" size={18} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>

            <InputField
              label="Initial Deposit (Optional)"
              placeholder="₦0"
              value={initialDeposit}
              onChangeText={setInitialDeposit}
              keyboardType="numeric"
            />
            <Text style={styles.hintText}>How much do you want to start with?</Text>

            <InputField
              label="Notes (Optional)"
              placeholder="e.g. Saving from monthly allowance"
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          title="Create Goal"
          onPress={handleCreate}
          disabled={!isFormValid}
          variant="primary"
          fullWidth={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 0,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  datePickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  dateText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  hintText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: -16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    backgroundColor: WHITE,
  },
});

export default CreateSavingsGoalScreen;
