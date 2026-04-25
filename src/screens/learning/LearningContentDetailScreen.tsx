import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LEARNING_CONTENT,
  FINANCE_101_SERIES,
} from '../../constants/learningData';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  Colors,
} from '../../constants';

const { width } = Dimensions.get('window');

export const LearningContentDetailScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, isSeries } = useLocalSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Find content
  const item = isSeries === 'true' 
    ? FINANCE_101_SERIES.find(e => e.id === id)
    : LEARNING_CONTENT.find(c => c.id === id);

  if (!item) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Content not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine type
  const type = isSeries === 'true' ? 'article' : (item as any).type || 'article';
  const category = (item as any).category || 'Series';
  const duration = item.duration;
  const title = item.title;
  const contentBody = item.content;
  const keyTakeaways = (item as any).keyTakeaways || [];
  const date = 'Apr 25, 2026';

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    setScrollProgress(Math.max(0, Math.min(1, progress)));
  };

  const renderArticle = () => (
    <View>
      {/* Hero Image Placeholder */}
      <View style={styles.heroImageContainer}>
        <View style={[styles.heroPlaceholder, { backgroundColor: Colors.primary.P100 }]}>
          <Ionicons name="document-text" size={60} color={PRIMARY_GREEN} />
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${scrollProgress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.metaRow}>
          <Ionicons name="document-text-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}>Article • {duration} • {date}</Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>{contentBody}</Text>
        </View>

        {keyTakeaways.length > 0 && (
          <View style={styles.takeawaysCard}>
            <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
            {keyTakeaways.map((takeaway: string, idx: number) => (
              <View key={idx} style={styles.takeawayRow}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.takeawayText}>{takeaway}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderVideo = () => (
    <View>
      {/* Video Player Placeholder */}
      <View style={styles.videoPlayer}>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={40} color={WHITE} />
        </TouchableOpacity>
        <View style={styles.videoDurationBadge}>
          <Text style={styles.videoDurationText}>{duration}</Text>
        </View>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.metaRow}>
          <Ionicons name="videocam-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}>Video • {duration} • {date}</Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.sectionTitle}>About this video</Text>
          <Text style={styles.bodyText}>{contentBody}</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Learn how to track every kobo</Text>
            <Text style={styles.bulletItem}>• Master the 50/30/20 rule</Text>
            <Text style={styles.bulletItem}>• Avoid the common student 'Sapa' trap</Text>
          </View>
        </View>

        {keyTakeaways.length > 0 && (
          <View style={styles.takeawaysCard}>
            <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
            {keyTakeaways.map((takeaway: string, idx: number) => (
              <View key={idx} style={styles.takeawayRow}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.takeawayText}>{takeaway}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderPodcast = () => (
    <View>
      {/* Podcast Cover */}
      <View style={styles.podcastHero}>
        <View style={styles.podcastCoverPlaceholder}>
          <Ionicons name="mic" size={80} color={PRIMARY_GREEN} />
        </View>
        <Text style={styles.podcastSubtitle}>By BOF OAU</Text>
      </View>

      <View style={styles.contentPadding}>
        {/* Audio Player Controls */}
        <View style={styles.audioPlayer}>
          <View style={styles.audioTrack}>
            <View style={[styles.audioProgress, { width: '30%' }]} />
            <View style={styles.audioKnob} />
          </View>
          <View style={styles.audioTimeRow}>
            <Text style={styles.audioTime}>4:32</Text>
            <Text style={styles.audioTime}>{duration}</Text>
          </View>
          <View style={styles.audioControlsRow}>
            <TouchableOpacity style={styles.speedBtn}>
              <Text style={styles.speedText}>1x</Text>
            </TouchableOpacity>
            <View style={styles.mainControls}>
              <TouchableOpacity>
                <MaterialCommunityIcons name="rewind-15" size={32} color={TEXT_PRIMARY} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.podcastPlayBtn}>
                <Ionicons name="pause" size={32} color={WHITE} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons name="fast-forward-15" size={32} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.bodyContainer}>
          <Text style={styles.sectionTitle}>About this episode</Text>
          <Text style={styles.bodyText}>{contentBody}</Text>
        </View>

        {keyTakeaways.length > 0 && (
          <View style={styles.takeawaysCard}>
            <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
            {keyTakeaways.map((takeaway: string, idx: number) => (
              <View key={idx} style={styles.takeawayRow}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.takeawayText}>{takeaway}</Text>
              </View>
            ))}
          </View>
        )}

        {/* More Episodes (Mock) */}
        <View style={styles.moreEpisodesSection}>
          <Text style={styles.sectionTitle}>More Episodes</Text>
          {[1, 2].map((i) => (
            <TouchableOpacity key={i} style={styles.episodeSmallCard}>
              <View style={styles.episodeSmallThumb} />
              <View style={styles.episodeSmallInfo}>
                <Text style={styles.episodeSmallTitle}>EP 0{i} — Financial Freedom</Text>
                <Text style={styles.episodeSmallMeta}>15 min • Apr {i + 10}, 2026</Text>
              </View>
              <Ionicons name="play-circle" size={24} color={PRIMARY_GREEN} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity 
          style={styles.headerBtn}
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isBookmarked ? PRIMARY_GREEN : TEXT_PRIMARY} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {type === 'article' && renderArticle()}
        {type === 'video' && renderVideo()}
        {type === 'podcast' && renderPodcast()}

        {/* Action CTAs */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaSectionTitle}>Apply What You Learned</Text>
          
          <TouchableOpacity 
            style={styles.ctaCard}
            onPress={() => router.push('/budget/create')}
          >
            <View style={[styles.ctaIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="bar-chart" size={24} color="#2196F3" />
            </View>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Create a Budget</Text>
              <Text style={styles.ctaSubtitle}>Set spending limits for food, transport and more →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.ctaCard}
            onPress={() => router.push('/savings/create')}
          >
            <View style={[styles.ctaIconBox, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="wallet" size={24} color={PRIMARY_GREEN} />
            </View>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Set a Savings Goal</Text>
              <Text style={styles.ctaSubtitle}>Start putting money aside for something you love →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Related Content */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
            {LEARNING_CONTENT.filter(c => c.id !== id).slice(0, 3).map((c) => (
              <TouchableOpacity 
                key={c.id} 
                style={styles.relatedCard}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: c.id }
                })}
              >
                <View style={styles.relatedThumb} />
                <Text style={styles.relatedCardTitle} numberOfLines={2}>{c.title}</Text>
                <Text style={styles.relatedCardMeta}>{c.duration}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
    backgroundColor: WHITE,
    zIndex: 10,
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
  // Article Hero
  heroImageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
  },
  // Video Player
  videoPlayer: {
    width: '100%',
    height: 210,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(26, 158, 63, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: WHITE,
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  // Podcast Hero
  podcastHero: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  podcastCoverPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: Colors.primary.P100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  podcastSubtitle: {
    marginTop: 20,
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: TEXT_SECONDARY,
  },
  // Shared Content Styles
  contentPadding: {
    padding: 20,
  },
  categoryChip: {
    backgroundColor: Colors.primary.P100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
    lineHeight: 36,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  metaText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  bodyContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  bodyText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  bulletList: {
    marginTop: 12,
    gap: 8,
  },
  bulletItem: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: '#4B5563',
  },
  takeawaysCard: {
    backgroundColor: '#E8F5E9',
    padding: 24,
    borderRadius: 24,
    marginBottom: 30,
  },
  takeawaysTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: PRIMARY_GREEN,
    marginBottom: 16,
  },
  takeawayRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  checkIcon: {
    fontSize: 16,
  },
  takeawayText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: '#1B5E20',
    lineHeight: 22,
  },
  // Audio Player
  audioPlayer: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 24,
    marginBottom: 30,
  },
  audioTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 8,
  },
  audioProgress: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 2,
  },
  audioKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_GREEN,
    position: 'absolute',
    top: -4,
    left: '30%',
    marginLeft: -6,
  },
  audioTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  audioTime: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  audioControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedBtn: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: TEXT_PRIMARY,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  podcastPlayBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // More Episodes
  moreEpisodesSection: {
    marginTop: 10,
  },
  episodeSmallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  episodeSmallThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  episodeSmallInfo: {
    flex: 1,
  },
  episodeSmallTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  episodeSmallMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  // CTA Section
  ctaSection: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  ctaSectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  ctaIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  // Related Section
  relatedSection: {
    padding: 20,
  },
  relatedScroll: {
    gap: 16,
    paddingTop: 4,
  },
  relatedCard: {
    width: 160,
  },
  relatedThumb: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: 8,
  },
  relatedCardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  relatedCardMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_SECONDARY,
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 10,
  },
  backBtnText: {
    color: WHITE,
    fontFamily: Fonts.bold,
  },
});
