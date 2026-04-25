import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_PRIMARY, WHITE, SPACING, FONT_SIZE, BORDER_GRAY, Fonts } from '../constants';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showEdit?: boolean;
  showBell?: boolean;
  showLearning?: boolean;
  showProfile?: boolean;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
  onBell?: () => void;
  onLearning?: () => void;
  onProfile?: () => void;
  onBookmark?: () => void;
  onSearch?: () => void;
  transparent?: boolean;
  tintColor?: string;
}

export const Header = ({
  title,
  showBack,
  showEdit,
  showBell,
  showLearning,
  showProfile,
  showBookmark,
  isBookmarked,
  showSearch,
  onBack,
  onEdit,
  onBell,
  onLearning,
  onProfile,
  onBookmark,
  onSearch,
  transparent,
  tintColor = TEXT_PRIMARY,
}: HeaderProps) => {
  return (
    <SafeAreaView style={[styles.safeArea, transparent && styles.transparentHeader]}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={24} color={tintColor} />
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
          <Text style={[styles.title, { color: tintColor }]} numberOfLines={1}>{title}</Text>
        </View>

        <View style={styles.rightContainer}>
          {showBookmark && (
            <TouchableOpacity onPress={onBookmark} style={[styles.iconButton, isBookmarked && styles.bookmarkActive]}>
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={22} 
                color={isBookmarked ? WHITE : tintColor} 
              />
            </TouchableOpacity>
          )}
          {showLearning && (
            <TouchableOpacity onPress={onLearning} style={styles.iconButton}>
              <Ionicons name="school-outline" size={24} color={tintColor} />
            </TouchableOpacity>
          )}
          {showBell && (
            <TouchableOpacity onPress={onBell} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={tintColor} />
            </TouchableOpacity>
          )}
          {showSearch && (
            <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
              <Ionicons name="search" size={24} color={tintColor} />
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
  transparentHeader: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
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
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semiBold,
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
  bookmarkActive: {
    backgroundColor: '#3CB96A',
    borderRadius: 8,
    padding: 6,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
