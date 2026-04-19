import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE, PRIMARY_GREEN, TEXT_PRIMARY, Fonts } from '@/src/constants';

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Expenses Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: PRIMARY_GREEN,
  },
});
