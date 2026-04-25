import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  BG_LIGHT, 
  Fonts,
  DARK_GREEN
} from '../../constants';
import { FINANCE_101_SERIES } from '../../constants/learningData';

const { width } = Dimensions.get('window');

const Finance101SeriesScreen = () => {
  const router = useRouter();
  const [completedCount, setCompletedCount] = useState(2); // Mock progress: 2 of 8

  const progressPercent = (completedCount / FINANCE_101_SERIES.length) * 100;

  const motivationalMessage = useMemo(() => {
    if (progressPercent === 0) return 'Start your financial journey today! 🚀';
    if (progressPercent <= 25) return 'Great start! Keep the momentum going 🔥';
    if (progressPercent <= 50) return "You're making real progress! Halfway there 💪";
    if (progressPercent <= 75) return "Almost there! You're doing amazing 🌟";
    if (progressPercent < 100) return 'So close! One last push to finish 🏆';
    return 'You completed the series! Financial genius 🎉';
  }, [progressPercent]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finance 101</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="search" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <View style={styles.bofTag}>
            <Text style={styles.bofTagText}>By BOF OAU</Text>
          </View>
          <Text style={styles.seriesTitle}>Finance 101 Series</Text>
          <Text style={styles.seriesSubtitle}>Everything you need to know about money — simplified for students</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextContent}>
            <Text style={styles.progressLabel}>🔥 Your Progress</Text>
            <Text style={styles.progressStats}>{completedCount} of {FINANCE_101_SERIES.length} episodes completed</Text>
            <Text style={styles.motivationalText}>{motivationalMessage}</Text>
          </View>
          <View style={styles.progressRingContainer}>
            <View style={styles.progressRingOuter}>
               <Text style={styles.progressPercentText}>{Math.round(progressPercent)}%</Text>
            </View>
          </View>
        </View>

        {/* Continue Card */}
        {completedCount < FINANCE_101_SERIES.length && (
          <View style={styles.continueCard}>
            <View style={styles.continueInfo}>
              <Text style={styles.continueLabel}>Continue where you left off</Text>
              <Text style={styles.continueTitle}>EP 0{FINANCE_101_SERIES[completedCount].episodeNumber}: {FINANCE_101_SERIES[completedCount].title}</Text>
              <Text style={styles.continueMeta}>{FINANCE_101_SERIES[completedCount].duration}</Text>
            </View>
            <TouchableOpacity 
              style={styles.continueBtn}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: FINANCE_101_SERIES[completedCount].id }
              })}
            >
              <Text style={styles.continueBtnText}>Continue Reading</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Episode List */}
        <View style={styles.episodeListSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          {FINANCE_101_SERIES.map((ep, index) => {
            const isCompleted = index < completedCount;
            const isLocked = index > completedCount;
            const isActive = index === completedCount;

            return (
              <TouchableOpacity 
                key={ep.id}
                style={[
                  styles.episodeRow,
                  isCompleted && styles.episodeRowCompleted,
                  isActive && styles.episodeRowActive
                ]}
                disabled={isLocked}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: ep.id }
                })}
              >
                <View style={[
                  styles.epNumberBox,
                  isCompleted && styles.epNumberBoxCompleted,
                  isLocked && styles.epNumberBoxLocked
                ]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={24} color={PRIMARY_GREEN} />
                  ) : (
                    <Text style={[
                      styles.epNumberText,
                      isLocked && styles.epNumberTextLocked
                    ]}>0{ep.episodeNumber}</Text>
                  )}
                </View>
                <View style={styles.epInfo}>
                  <Text style={[
                    styles.epTitle,
                    isLocked && styles.epTitleLocked
                  ]}>{ep.title}</Text>
                  <Text style={styles.epMeta}>{ep.duration} • Article</Text>
                </View>
                {isLocked ? (
                  <Ionicons name="lock-closed" size={20} color="#D1D5DB" />
                ) : (
                  <Ionicons name="play-circle" size={24} color={PRIMARY_GREEN} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: WHITE,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerInfo: {
    padding: 20,
  },
  bofTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  bofTagText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  seriesTitle: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  seriesSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  progressCard: {
    flexDirection: 'row',
    backgroundColor: '#064E3B', // Dark Green
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTextContent: {
    flex: 1,
  },
  progressLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#D1FAE5',
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
    fontSize: 12,
    color: '#D1FAE5',
    opacity: 0.8,
  },
  progressRingContainer: {
    marginLeft: 16,
  },
  progressRingOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  progressPercentText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
  continueCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  continueLabel: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    marginBottom: 8,
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
    marginBottom: 16,
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
  episodeListSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  episodeRowCompleted: {
    backgroundColor: '#F9FAFB',
  },
  episodeRowActive: {
    borderColor: PRIMARY_GREEN,
    borderWidth: 1.5,
  },
  epNumberBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  epNumberBoxCompleted: {
    backgroundColor: 'transparent',
  },
  epNumberBoxLocked: {
    backgroundColor: '#F9FAFB',
  },
  epNumberText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  epNumberTextLocked: {
    color: '#D1D5DB',
  },
  epInfo: {
    flex: 1,
  },
  epTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  epTitleLocked: {
    color: TEXT_SECONDARY,
  },
  epMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
});

export default Finance101SeriesScreen;
