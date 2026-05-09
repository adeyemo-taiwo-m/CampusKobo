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
  Image,
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
import { useLearningContext } from '../../context/LearningContext';
import { getLearningImageSource } from '../../utils/learningUtils';

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
  const { 
    finance101Series, 
    getProgressForContent, 
    isLoadingLearning 
  } = useLearningContext();

  const episodesWithStatus = useMemo(() => {
    let prevCompleted = true;
    return finance101Series.map((ep, index) => {
      const progress = getProgressForContent(ep.id);
      const isCompleted = progress?.status === 'completed';
      const isInProgress = progress?.status === 'in_progress';
      const isLocked = !prevCompleted && index > 0;
      
      const currentEpWithStatus = {
        ...ep,
        isCompleted,
        isInProgress,
        isLocked
      };

      // Update prevCompleted for the next episode
      prevCompleted = isCompleted;
      
      return currentEpWithStatus;
    });
  }, [finance101Series, getProgressForContent]);

  const completedCount = episodesWithStatus.filter(e => e.isCompleted).length;
  const totalEpisodes = finance101Series.length;
  const progressPercent = totalEpisodes > 0 ? (completedCount / totalEpisodes) * 100 : 0;

  const nextEpisode = useMemo(() => {
    return episodesWithStatus.find(e => e.isInProgress) || 
           episodesWithStatus.find(e => !e.isCompleted && !e.isLocked);
  }, [episodesWithStatus]);

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

  if (isLoadingLearning) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: Fonts.medium, color: TEXT_SECONDARY }}>Loading series...</Text>
      </SafeAreaView>
    );
  }

  const getStatusIcon = (episode: any) => {
    if (episode.isCompleted) return <Ionicons name="checkmark-circle" size={26} color={PRIMARY_GREEN} />;
    if (episode.isInProgress) return <Ionicons name="play-circle" size={26} color={PRIMARY_GREEN} />;
    if (episode.isLocked) return <Ionicons name="lock-closed" size={22} color="#D1D5DB" />;
    return <Ionicons name="ellipse-outline" size={22} color="#D1D5DB" />;
  };


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
        {nextEpisode && (
          <View style={styles.continueCard}>
            <Text style={styles.continueHeader}>
              {nextEpisode.isInProgress ? 'Continue where you left off' : 'Next Episode'}
            </Text>
            <Text style={styles.continueTitle}>EP 0{nextEpisode.episode_number} - {nextEpisode.title}</Text>
            <View style={styles.continueProgressRow}>
               <View style={styles.continueProgressBar}>
                  <View style={[styles.continueProgressFill, { width: nextEpisode.isInProgress ? '35%' : '0%' }]} />
               </View>
               <Text style={styles.continueTime}>{nextEpisode.duration}</Text>
            </View>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: nextEpisode.id, isSeries: 'true', type: 'article' }
              })}
            >
              <Text style={styles.continueButtonText}>
                {nextEpisode.isInProgress ? 'Continue Reading' : 'Start Reading'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Episode List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>All Episodes</Text>
          {episodesWithStatus.map((episode, index) => (
            <TouchableOpacity 
              key={episode.id} 
              style={[
                styles.episodeRow,
                episode.isLocked && { opacity: 0.7 }
              ]}
              disabled={episode.isLocked}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: episode.id, isSeries: 'true', type: 'article' }
              })}
            >
              <View style={[styles.episodeBadge, { backgroundColor: EPISODE_COLORS[index % EPISODE_COLORS.length] }]}>
                <Image 
                  source={getLearningImageSource(episode)} 
                  style={styles.episodeBadgeImage}
                  resizeMode="cover"
                />
                <View style={styles.badgeOverlay}>
                  <Text style={styles.episodeNumber}>0{episode.episode_number}</Text>
                </View>
              </View>
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle} numberOfLines={1}>
                  EP 0{episode.episode_number} — {episode.title} {episode.isLocked && '(locked)'}
                </Text>
                <Text style={styles.episodeDesc} numberOfLines={1}>
                  {episode.content.substring(0, 40)}...
                </Text>
                <Text style={styles.episodeDuration}>{episode.duration}</Text>
              </View>
              <View style={styles.statusContainer}>
                {getStatusIcon(episode)}
              </View>
            </TouchableOpacity>
          ))}
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
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  episodeBadgeImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  badgeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
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
