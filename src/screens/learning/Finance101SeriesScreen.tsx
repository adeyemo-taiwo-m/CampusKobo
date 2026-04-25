import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FINANCE_101_SERIES } from '../../constants/learningData';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  Colors,
} from '../../constants';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EPISODE_COLORS = [
  '#E8F5E9', // Green
  '#E3F2FD', // Blue
  '#F3E5F5', // Purple
  '#FFF3E0', // Orange
  '#E0F2F1', // Teal
  '#FFEBEE', // Red
  '#FCE4EC', // Pink
  '#FFFDE7', // Yellow
];

const TEXT_COLORS = [
  '#2E7D32',
  '#1565C0',
  '#7B1FA2',
  '#E65100',
  '#00695C',
  '#C62828',
  '#AD1457',
  '#F9A825',
];

export const Finance101SeriesScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  
  // Mock progress
  const completedCount = 2;
  const totalCount = FINANCE_101_SERIES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getMotivationalMessage = (percent: number) => {
    if (percent === 0) return 'Start your financial journey today! 🚀';
    if (percent <= 25) return 'Great start! Keep the momentum going 🔥';
    if (percent <= 50) return "You're making real progress! Halfway there 💪";
    if (percent <= 75) return "Almost there! You're doing amazing 🌟";
    if (percent < 100) return 'So close! One last push to finish 🏆';
    return 'You completed the series! Financial genius 🎉';
  };

  const toggleAbout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAboutExpanded(!isAboutExpanded);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finance 101</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="search" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Info */}
        <View style={styles.heroSection}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>By BOF OAU</Text>
          </View>
          <Text style={styles.heroTitle}>Finance 101 Series</Text>
          <Text style={styles.heroSubtitle}>Everything you need to know about money — simplified for students</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>🔥 Your Progress</Text>
            <Text style={styles.progressStats}>{completedCount} of {totalCount} episodes completed</Text>
            <Text style={styles.motivationalText}>{getMotivationalMessage(progressPercent)}</Text>
          </View>
          <View style={styles.progressRingContainer}>
            {/* Simple Mock Progress Ring */}
            <View style={styles.ringOuter}>
              <View style={[styles.ringInner, { height: `${progressPercent}%`, backgroundColor: PRIMARY_GREEN }]} />
              <Text style={styles.ringText}>{progressPercent}%</Text>
            </View>
          </View>
        </View>

        {/* Continue Card */}
        {completedCount < totalCount && (
          <View style={styles.continueSection}>
            <Text style={styles.sectionLabel}>Continue where you left off</Text>
            <TouchableOpacity 
              style={styles.continueCard}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: FINANCE_101_SERIES[completedCount].id, isSeries: 'true' }
              })}
            >
              <View style={styles.continueContent}>
                <Text style={styles.continueTitle}>EP 0{FINANCE_101_SERIES[completedCount].episodeNumber}: {FINANCE_101_SERIES[completedCount].title}</Text>
                <Text style={styles.continueMeta}>{FINANCE_101_SERIES[completedCount].duration}</Text>
              </View>
              <TouchableOpacity style={styles.continueBtn}>
                <Text style={styles.continueBtnText}>Continue Reading</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* Episode List */}
        <View style={styles.episodesSection}>
          <Text style={styles.sectionLabel}>All Episodes</Text>
          {FINANCE_101_SERIES.map((ep, idx) => {
            const isCompleted = idx < completedCount;
            const isInProgress = idx === completedCount;
            const isLocked = idx > completedCount;

            return (
              <TouchableOpacity 
                key={ep.id}
                style={[styles.episodeRow, isLocked && styles.episodeLocked]}
                disabled={isLocked}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: ep.id, isSeries: 'true' }
                })}
              >
                <View style={[styles.numberBadge, { backgroundColor: EPISODE_COLORS[idx % EPISODE_COLORS.length] }]}>
                  <Text style={[styles.numberText, { color: TEXT_COLORS[idx % TEXT_COLORS.length] }]}>
                    0{ep.episodeNumber}
                  </Text>
                </View>
                
                <View style={styles.episodeMain}>
                  <Text style={styles.epTitle}>{ep.title}</Text>
                  <Text style={styles.epDesc} numberOfLines={1}>{ep.content}</Text>
                  <Text style={styles.epMeta}>{ep.duration}</Text>
                </View>

                <View style={styles.statusIcon}>
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={24} color={PRIMARY_GREEN} />
                  ) : isInProgress ? (
                    <Ionicons name="play-circle" size={24} color={PRIMARY_GREEN} />
                  ) : isLocked ? (
                    <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                  ) : (
                    <View style={styles.notStartedDot} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* About this series */}
        <TouchableOpacity style={styles.aboutContainer} onPress={toggleAbout}>
          <View style={styles.aboutHeader}>
            <Text style={styles.aboutLabel}>About this series</Text>
            <Ionicons 
              name={isAboutExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={TEXT_SECONDARY} 
            />
          </View>
          {isAboutExpanded && (
            <Text style={styles.aboutText}>
              Finance 101 is a curated series by the BOF OAU Research Division to help students build strong financial habits from scratch. We break down complex concepts into actionable steps tailored for the Nigerian campus lifestyle.
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: Colors.primary.P100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  progressCard: {
    marginHorizontal: 20,
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#10B981',
    marginBottom: 8,
  },
  progressStats: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: WHITE,
    marginBottom: 4,
  },
  motivationalText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#9CA3AF',
  },
  progressRingContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringInner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  ringText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
    zIndex: 1,
  },
  continueSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  continueCard: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  continueContent: {
    marginBottom: 16,
  },
  continueTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  continueMeta: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  continueBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: WHITE,
  },
  episodesSection: {
    marginBottom: 20,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  episodeLocked: {
    opacity: 0.6,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  numberText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  episodeMain: {
    flex: 1,
    marginRight: 12,
  },
  epTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  epDesc: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  epMeta: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  statusIcon: {
    width: 32,
    alignItems: 'center',
  },
  notStartedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  aboutContainer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginTop: 10,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  aboutText: {
    marginTop: 12,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
});
