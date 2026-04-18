import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PRIMARY_GREEN, BORDER_GRAY, SPACING } from '../constants';

export const PaginationDots = ({ total, activeIndex }: { total: number, activeIndex: number }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.LG,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: PRIMARY_GREEN,
    width: 20, // Make active dot slightly longer
  },
  inactiveDot: {
    backgroundColor: BORDER_GRAY,
  },
});
