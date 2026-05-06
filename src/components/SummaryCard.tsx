import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  SPACING,
  Fonts,
} from '../constants';
import { useFormatCurrency } from '../hooks/useFormatCurrency';

interface SummaryCardProps {
  label: string;
  amount: number;
  limit?: number;
  progress?: number;
  caption?: string;
  motivation?: string;
  showActionButton?: boolean;
  actionButtonText?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  amount,
  limit,
  progress,
  caption,
  motivation,
  showActionButton,
  actionButtonText,
  onActionPress,
  style,
}) => {
  const { formatCurrency } = useFormatCurrency();
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.mainRow}>
        <View style={styles.amountBaseline}>
          <Text style={styles.amountText}>{formatCurrency(amount)}</Text>
          {limit !== undefined && (
            <Text style={styles.limitText}>/{formatCurrency(limit)}</Text>
          )}
        </View>
        {progress !== undefined && (
          <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
        )}
      </View>

      {progress !== undefined && (
        <Progress.Bar
          progress={progress}
          width={null}
          height={6}
          color={PRIMARY_GREEN}
          unfilledColor="#E8F5E9"
          borderWidth={0}
          borderRadius={4}
          style={styles.progressBar}
        />
      )}

      {(caption || motivation) && (
        <Text style={styles.caption}>
          {caption}{motivation ? `  •  ${motivation}` : ''}
        </Text>
      )}

      {showActionButton && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onActionPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionButtonText || 'Details'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  label: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    marginBottom: 16,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amountBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: TEXT_PRIMARY,
  },
  limitText: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    color: TEXT_SECONDARY,
    opacity: 0.7,
  },
  percentText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    opacity: 0.6,
  },
  progressBar: {
    marginVertical: 4,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 8,
    opacity: 0.8,
  },
  actionButton: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  actionButtonText: {
    color: WHITE,
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});
