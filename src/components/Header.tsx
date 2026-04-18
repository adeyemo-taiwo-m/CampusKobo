import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_PRIMARY, WHITE, SPACING, FONT_SIZE, BORDER_GRAY } from '../constants';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showEdit?: boolean;
  showBell?: boolean;
  showLearning?: boolean;
  showProfile?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
  onBell?: () => void;
  onLearning?: () => void;
  onProfile?: () => void;
}

export const Header = ({
  title,
  showBack,
  showEdit,
  showBell,
  showLearning,
  showProfile,
  onBack,
  onEdit,
  onBell,
  onLearning,
  onProfile,
}: HeaderProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          )}
          {showProfile && (
            <TouchableOpacity onPress={onProfile} style={styles.profileButton}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={20} color={WHITE} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>

        <View style={styles.rightContainer}>
          {showLearning && (
            <TouchableOpacity onPress={onLearning} style={styles.iconButton}>
              <Ionicons name="school-outline" size={24} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          )}
          {showBell && (
            <TouchableOpacity onPress={onBell} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          )}
          {showEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 3,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  iconButton: {
    padding: SPACING.XS,
  },
  profileButton: {
    marginRight: SPACING.SM,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    fontSize: FONT_SIZE.MD,
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
});
