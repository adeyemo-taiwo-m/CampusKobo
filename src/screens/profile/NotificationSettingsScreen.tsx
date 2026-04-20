import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';
import { Header } from '../../components/Header';

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

const ToggleRow = ({ label, description, value, onValueChange, disabled = false }: ToggleRowProps) => (
  <View style={[styles.toggleRow, disabled && { opacity: 0.5 }]}>
    <View style={styles.textCol}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleDescription}>{description}</Text>
    </View>
    <Switch 
      value={value} 
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E7EB', true: PRIMARY_GREEN }}
      ios_backgroundColor="#E5E7EB"
      disabled={disabled}
    />
  </View>
);

export const NotificationSettingsScreen = () => {
  const router = useRouter();
  const [master, setMaster] = useState(true);
  const [budget, setBudget] = useState(true);
  const [savings, setSavings] = useState(true);
  const [bills, setBills] = useState(true);
  const [newContent, setNewContent] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" showBack={true} onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageDescription}>Choose what you want to be notified about</Text>

        <View style={styles.section}>
          <ToggleRow 
            label="All Notifications" 
            description="Turn off to mute all notifications" 
            value={master} 
            onValueChange={setMaster} 
          />
        </View>

        <Text style={styles.sectionTitle}>Money Alerts</Text>
        <View style={styles.section}>
          <ToggleRow 
            label="Budget Alerts" 
            description="When you're close to your spending limit" 
            value={budget} 
            onValueChange={setBudget} 
            disabled={!master}
          />
          <ToggleRow 
            label="Savings Reminders" 
            description="When to add funds to your goals" 
            value={savings} 
            onValueChange={setSavings} 
            disabled={!master}
          />
          <ToggleRow 
            label="Bill Reminders" 
            description="Recurring expense due date alerts" 
            value={bills} 
            onValueChange={setBills} 
            disabled={!master}
          />
        </View>

        <Text style={styles.sectionTitle}>Learning</Text>
        <View style={styles.section}>
          <ToggleRow 
            label="New Content" 
            description="When new articles and videos are added" 
            value={newContent} 
            onValueChange={setNewContent} 
            disabled={!master}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
  },
  pageDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 24,
  },
  section: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  textCol: {
    flex: 1,
    paddingRight: 16,
  },
  toggleLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  toggleDescription: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
});

export default NotificationSettingsScreen;
