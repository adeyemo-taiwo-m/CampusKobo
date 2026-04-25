import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
} from '../../constants';
import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { FINANCE_101_SERIES } from '../../constants/learningData';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EPISODE_COLORS = [
  '#3CB96A', // Primary Green
  '#0EA5E9', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#10B981', // Emerald
];

const Finance101SeriesScreen = () => {
  const router = useRouter();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  // Mock progress state
  // In a real app, this would come from a context or persistence layer
  const completedCount = 1;
  const inProgressId = 'f101-02';
  const totalEpisodes = FINANCE_101_SERIES.length;
  const progressPercent = (completedCount / totalEpisodes) * 100;

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

  const getStatusIcon = (episode: any, index: number) => {
    if (index < completedCount) return <Ionicons name="checkmark-circle" size={28} color={PRIMARY_GREEN} />;
    if (episode.id === inProgressId) return <Ionicons name="play-circle" size={28} color={PRIMARY_GREEN} />;
    if (index === completedCount + 1) return <View style={styles.notStartedIcon} />; // EP 3 example
    if (index > completedCount) return <Ionicons name="lock-closed" size={24} color="#9CA3AF" />;
    return <View style={styles.notStartedIcon} />;
  };

  const nextEpisode = useMemo(() => {
    return FINANCE_101_SERIES.find(e => e.id === inProgressId) || FINANCE_101_SERIES[0];
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        title="Finance 101" 
        showBack={true} 
        onBack={() => router.back()}
        showSearch={true}
        onSearch={() => {}}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>By BOF OAU</Text>
          </View>
          <Text style={styles.mainTitle}>Finance 101 Series</Text>
          <Text style={styles.subtitle}>
            Everything you need to know about money — simplified for students
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Your Progress</Text>
          <Text style={styles.progressCount}>{completedCount} of {totalEpisodes} episodes completed</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBarWrapper}>
              <ProgressBar progress={completedCount / totalEpisodes} height={8} fillColor={PRIMARY_GREEN} />
            </View>
            <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
          </View>
          <Text style={styles.motivationalText}>
            Keep going! {getMotivationalMessage(progressPercent)}
          </Text>
        </View>

        {/* Continue Card */}
        <View style={styles.continueCard}>
          <Text style={styles.continueHeader}>Continue where you left off</Text>
          <Text style={styles.continueTitle}>EP 0{nextEpisode.episodeNumber} - {nextEpisode.title}</Text>
          <View style={styles.continueProgressRow}>
             <View style={styles.continueProgressBar}>
                <View style={[styles.continueProgressFill, { width: '35%' }]} />
             </View>
             <Text style={styles.continueTime}>2 min left</Text>
          </View>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push({
              pathname: '/learning/detail',
              params: { id: nextEpisode.id, isSeries: 'true', type: 'article' }
            })}
          >
            <Text style={styles.continueButtonText}>Continue Reading</Text>
          </TouchableOpacity>
        </View>

        {/* Episode List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>All Episodes</Text>
          {FINANCE_101_SERIES.map((episode, index) => {
            const isLocked = index > completedCount + 1;
            const isCompleted = index < completedCount;
            const isInProgress = episode.id === inProgressId;
            
            return (
              <TouchableOpacity 
                key={episode.id} 
                style={styles.episodeRow}
                disabled={isLocked}
                onPress={() => router.push({
                  pathname: '/learning/detail',
                  params: { id: episode.id, isSeries: 'true', type: 'article' }
                })}
              >
                <View style={[styles.episodeBadge, { backgroundColor: EPISODE_COLORS[index % EPISODE_COLORS.length] }]}>
                  <Text style={styles.episodeNumber}>0{episode.episodeNumber}</Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle} numberOfLines={1}>
                    EP 0{episode.episodeNumber} — {episode.title} {isLocked && '(locked)'}
                  </Text>
                  <Text style={styles.episodeDesc} numberOfLines={1}>
                    Learn how to plan your spending
                  </Text>
                  <Text style={styles.episodeDuration}>5 min read</Text>
                </View>
                <View style={styles.statusContainer}>
                  {getStatusIcon(episode, index)}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <TouchableOpacity style={styles.aboutHeader} onPress={toggleAbout}>
            <Text style={styles.aboutTitle}>About this series</Text>
            <Ionicons 
              name={isAboutExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={TEXT_PRIMARY} 
            />
          </TouchableOpacity>
          {isAboutExpanded && (
            <Text style={styles.aboutText}>
              Finance 101 is a curated series by the BOF OAU Research Division to help students build strong financial habits from scratch. Each episode is designed to be quick, actionable, and relevant to the Nigerian student experience.
            </Text>
          )}
          {!isAboutExpanded && (
            <Text style={styles.aboutText} numberOfLines={1}>
              Finance 101 is a curated series by the BOF OAU Research Division to help students...
            </Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerInfo: {
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#E7F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    color: PRIMARY_GREEN,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  progressCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  progressCount: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarWrapper: {
    flex: 1,
    marginRight: 12,
  },
  progressPercent: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.bold,
  },
  motivationalText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  continueCard: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  continueHeader: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginBottom: 6,
  },
  continueTitle: {
    color: WHITE,
    fontSize: 17,
    fontFamily: Fonts.bold,
    marginBottom: 12,
  },
  continueProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginRight: 12,
  },
  continueProgressFill: {
    height: '100%',
    backgroundColor: WHITE,
    borderRadius: 3,
  },
  continueTime: {
    color: WHITE,
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  continueButton: {
    backgroundColor: '#E7F5ED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: PRIMARY_GREEN,
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  listSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  episodeBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  episodeNumber: {
    color: WHITE,
    fontSize: 24,
    fontFamily: Fonts.bold,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  episodeDesc: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  episodeDuration: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  statusContainer: {
    marginLeft: 8,
    width: 32,
    alignItems: 'center',
  },
  notStartedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  aboutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 24,
    marginBottom: 20,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  aboutText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  }
});

export default Finance101SeriesScreen;
