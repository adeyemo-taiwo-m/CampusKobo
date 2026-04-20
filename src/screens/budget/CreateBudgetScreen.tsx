import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { SuccessModal } from '../../components/SuccessScreen';

export const CreateBudgetScreen = () => {
  const router = useRouter();
  
  const [category, setCategory] = useState('Select category');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'Monthly' | 'Termly'>('Monthly');
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = category !== 'Select category' && amount.length > 0;

  const handleCreate = () => {
    setShowSuccess(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Create Budget" 
        showBack={true} 
        onBack={() => router.back()}
      />

      <SuccessModal 
        isVisible={showSuccess}
        title="Budget Created!"
        subtitle="Your budget is now active. We will alert you when you are nearing your limit."
        onDone={() => {
          setShowSuccess(false);
          router.push('/(tabs)/budget');
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.selectorBtn}>
                <Text style={styles.selectorText}>{category}</Text>
                <Ionicons name="chevron-down" size={20} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>

            <InputField
              label="Budget Amount"
              placeholder="₦0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Period</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity 
                  style={[styles.chip, period === 'Monthly' && styles.activeChip]}
                  onPress={() => setPeriod('Monthly')}
                >
                  <Text style={[styles.chipText, period === 'Monthly' && styles.activeChipText]}>Monthly</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.chip, period === 'Termly' && styles.activeChip]}
                  onPress={() => setPeriod('Termly')}
                >
                  <Text style={[styles.chipText, period === 'Termly' && styles.activeChipText]}>Termly</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Starts On</Text>
              <View style={styles.staticField}>
                <Text style={styles.staticText}>October 2025</Text>
                <Ionicons name="calendar-outline" size={18} color={TEXT_SECONDARY} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          title="Create Budget"
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
    gap: 24,
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
  selectorBtn: {
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
  selectorText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  activeChip: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  chipText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  activeChipText: {
    color: WHITE,
  },
  staticField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingHorizontal: 16,
  },
  staticText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    backgroundColor: WHITE,
  },
});

export default CreateBudgetScreen;
